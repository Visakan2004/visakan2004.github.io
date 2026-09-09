/**
 * src/services/obsidianParser.js
 * 
 * Production-ready Markdown & Obsidian Parser for ProtoSem Daily Notes.
 * Parses frontmatter, headings, structured sections (Topics, Activities, Evidence, Takeaways),
 * converts Obsidian wikilinks & image embeds (![[image.png]]) into web-compatible Markdown,
 * and extracts structured metadata for frontend consumption.
 */

const path = require('path');

// Supported extensions
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
const DOC_EXTENSIONS = new Set(['mp4', 'webm', 'pdf', 'doc', 'docx']);

/**
 * Categorize file type based on extension
 */
function categorizeFileType(fileName) {
  if (!fileName) return 'other';
  const ext = path.extname(fileName).toLowerCase().replace('.', '');
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (ext === 'mp4' || ext === 'webm') return 'video';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'doc' || ext === 'docx') return 'document';
  return 'file';
}

/**
 * Clean & slugify strings for IDs
 */
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Extract YAML frontmatter if present
 */
function extractFrontmatter(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {}, body: rawContent };
  }

  const yamlBlock = match[1];
  const body = rawContent.slice(match[0].length);
  const frontmatter = {};

  const lines = yamlBlock.split(/\r?\n/);
  let currentKey = null;
  let isList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // List item under currentKey
    if (trimmed.startsWith('- ') && currentKey) {
      const itemVal = trimmed.substring(2).trim().replace(/^['"]|['"]$/g, '');
      if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(itemVal);
      continue;
    }

    // Key-value pair
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      currentKey = line.substring(0, colonIdx).trim();
      const rawVal = line.substring(colonIdx + 1).trim();
      if (rawVal === '' || rawVal === '[]') {
        frontmatter[currentKey] = [];
        isList = true;
      } else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        // inline array [a, b, c]
        frontmatter[currentKey] = rawVal
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        isList = false;
      } else {
        frontmatter[currentKey] = rawVal.replace(/^['"]|['"]$/g, '');
        isList = false;
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Convert Obsidian wikilinks and embed links to standard web Markdown
 * Examples:
 *   ![[image.png]] -> ![image.png](/assets/weekly/Week_00/01_Monday/image.png)
 *   ![[image.png|My Caption]] -> ![My Caption](/assets/weekly/Week_00/01_Monday/image.png)
 *   ![[image.png|300]] -> ![image.png](/assets/weekly/Week_00/01_Monday/image.png)
 *   [[Other Note]] -> Other Note
 *   [[Other Note|Display]] -> Display
 */
function convertObsidianLinks(content, week, day) {
  const assetBasePath = `/assets/weekly/${week}/${day}`;

  // 1. Convert Obsidian image/embed links: ![[filename.ext]] or ![[filename.ext|alt]]
  let converted = content.replace(/!\[\[\s*([^\]|]+)(?:\|([^\]]*))?\s*\]\]/g, (match, fileRef, altText) => {
    const cleanFile = fileRef.trim();
    const fileName = path.basename(cleanFile);
    // If altText is pure number (e.g. 300 for resizing in Obsidian), use filename
    const isDimension = altText && /^\d+x?\d*$/.test(altText.trim());
    const caption = (altText && !isDimension) ? altText.trim() : fileName;
    return `![${caption}](${assetBasePath}/${encodeURI(fileName)})`;
  });

  // 2. Convert standard relative markdown image links: ![alt](filename.ext) or ![alt](./filename.ext)
  converted = converted.replace(/!\[([^\]]*)\]\((?:\.\/)?([^):/\\]+\.[a-zA-Z0-9]+)\)/g, (match, alt, file) => {
    return `![${alt || file}](${assetBasePath}/${encodeURI(file)})`;
  });

  // 3. Convert Obsidian wikilinks: [[Target|Label]] -> Label or Target
  converted = converted.replace(/\[\[\s*([^\]|]+)(?:\|([^\]]*))?\s*\]\]/g, (match, target, label) => {
    return label ? label.trim() : target.trim();
  });

  return converted;
}

/**
 * Extract list items or text from a markdown section
 */
function extractSectionList(sectionContent) {
  if (!sectionContent) return [];
  const items = [];
  const lines = sectionContent.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*[-*+]\s+(.*)$/) || line.match(/^\s*\d+\.\s+(.*)$/);
    if (match) {
      items.push(match[1].trim());
    }
  }
  // If no bullet items found, split by non-empty lines
  if (items.length === 0) {
    const paragraphs = sectionContent
      .split(/\r?\n\r?\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0 && !p.startsWith('#'));
    return paragraphs;
  }
  return items;
}

/**
 * Parse structured daily note
 * 
 * @param {string} rawContent Full markdown file content
 * @param {object} context { week: 'Week_00', day: '01_Monday', fileName: 'note.md' }
 */
function parseDailyNote(rawContent, context = {}) {
  const week = context.week || 'Week_00';
  const day = context.day || '01_Monday';
  const assetBasePath = `/assets/weekly/${week}/${day}`;

  const { frontmatter, body } = extractFrontmatter(rawContent);

  // Extract Top-level Title (# Title) or from fileName if descriptive
  const rawFileTitle = context.fileName ? path.basename(context.fileName, path.extname(context.fileName)) : '';
  const isGenericFileName = !rawFileTitle || /^(note|notes|monday|tuesday|wednesday|thursday|friday|saturday|\d+_\w+)$/i.test(rawFileTitle.trim());
  const fileTitle = isGenericFileName ? '' : rawFileTitle.trim();

  let title = frontmatter.title || '';
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) {
    if (!title) title = h1Match[1].trim();
  }
  if (!title && fileTitle) {
    title = fileTitle;
  }

  // Split into sections by Markdown H2 or H3 headings (## or ### Heading)
  const sections = {};
  const headingsFound = [];
  const sectionRegex = /^#{2,3}\s+([^\r\n]+)\r?\n([\s\S]*?)(?=^#{2,3}\s+|$)/gm;
  let match;
  let firstParagraph = '';

  // Extract introductory summary (text before the first ## or ### heading)
  const firstHIdx = body.search(/^#{2,3}\s+/m);
  if (firstHIdx > 0) {
    firstParagraph = body.substring(0, firstHIdx)
      .replace(/^#\s+[^\r\n]+\r?\n?/m, '') // remove # Title
      .trim();
  } else if (firstHIdx === -1) {
    firstParagraph = body
      .replace(/^#\s+[^\r\n]+\r?\n?/m, '')
      .trim();
  }

  while ((match = sectionRegex.exec(body)) !== null) {
    const rawHeading = match[1].trim();
    const headingKey = rawHeading.toLowerCase();
    const content = match[2].trim();
    sections[headingKey] = content;

    // Collect descriptive subheadings as potential topics
    if (!headingKey.includes('evidence') && !headingKey.includes('gallery') && !headingKey.includes('takeaway')) {
      headingsFound.push(rawHeading);
    }
  }

  // Find Topics
  let topics = [];
  if (frontmatter.topics) {
    topics = Array.isArray(frontmatter.topics) ? frontmatter.topics : [frontmatter.topics];
  } else {
    for (const [key, content] of Object.entries(sections)) {
      if (key.includes('topic') || key.includes('learning') || key.includes('concept')) {
        topics = extractSectionList(content);
        break;
      }
    }
    // Fallback: If no dedicated topics section, use the extracted subheadings
    if (topics.length === 0 && headingsFound.length > 0) {
      topics = headingsFound;
    }
  }

  // Find Activities
  let activities = [];
  if (frontmatter.activities) {
    activities = Array.isArray(frontmatter.activities) ? frontmatter.activities : [frontmatter.activities];
  } else {
    for (const [key, content] of Object.entries(sections)) {
      if (key.includes('activit') || key.includes('task') || key.includes('practical') || key.includes('work done')) {
        activities = extractSectionList(content);
        break;
      }
    }
  }

  // Find Takeaways
  let takeaways = [];
  if (frontmatter.takeaways || frontmatter.takeaway) {
    const raw = frontmatter.takeaways || frontmatter.takeaway;
    takeaways = Array.isArray(raw) ? raw : [raw];
  } else {
    for (const [key, content] of Object.entries(sections)) {
      if (key.includes('takeaway') || key.includes('reflection') || key.includes('summary')) {
        takeaways = extractSectionList(content);
        break;
      }
    }
    // Check for inline takeaway formats like **Day X takeaway: ...**
    if (takeaways.length === 0) {
      const inlineMatches = body.matchAll(/\*\*[^:*]*takeaway:\s*([^*]+)\*\*/gi);
      for (const m of inlineMatches) {
        if (m[1]) takeaways.push(m[1].trim());
      }
    }
  }

  // Summary
  const summary = frontmatter.summary || frontmatter.description || firstParagraph || '';

  // Extract Evidence explicitly referenced in Markdown
  const evidenceList = [];
  const foundFileNames = new Set();

  // 1. Check embedded Obsidian links: ![[filename.ext|Caption]]
  const embedRegex = /!\[\[\s*([^\]|]+)(?:\|([^\]]*))?\s*\]\]/g;
  let embedMatch;
  while ((embedMatch = embedRegex.exec(rawContent)) !== null) {
    const cleanFile = path.basename(embedMatch[1].trim());
    const isDimension = embedMatch[2] && /^\d+x?\d*$/.test(embedMatch[2].trim());
    const caption = (embedMatch[2] && !isDimension) ? embedMatch[2].trim() : cleanFile;

    if (!foundFileNames.has(cleanFile)) {
      foundFileNames.add(cleanFile);
      const fileType = categorizeFileType(cleanFile);
      const storageKey = `${week}/${day}/${cleanFile}`;
      const url = `${assetBasePath}/${cleanFile}`;

      evidenceList.push({
        id: slugify(`${week}_${day}_${cleanFile}`),
        title: caption,
        caption: caption,
        fileName: cleanFile,
        fileType: fileType,
        url: url,
        previewUrl: url,
        storageKey: storageKey,
        linked: true
      });
    }
  }

  // 2. Check standard Markdown image / link references
  const mdMediaRegex = /!\[([^\]]*)\]\((?:\.\/)?([^):/\\]+\.[a-zA-Z0-9]+)\)/g;
  let mdMatch;
  while ((mdMatch = mdMediaRegex.exec(rawContent)) !== null) {
    const cleanFile = path.basename(mdMatch[2].trim());
    const caption = mdMatch[1] ? mdMatch[1].trim() : cleanFile;

    if (!foundFileNames.has(cleanFile)) {
      foundFileNames.add(cleanFile);
      const fileType = categorizeFileType(cleanFile);
      const storageKey = `${week}/${day}/${cleanFile}`;
      const url = `${assetBasePath}/${cleanFile}`;

      evidenceList.push({
        id: slugify(`${week}_${day}_${cleanFile}`),
        title: caption,
        caption: caption,
        fileName: cleanFile,
        fileType: fileType,
        url: url,
        previewUrl: url,
        storageKey: storageKey,
        linked: true
      });
    }
  }

  // Strip top-level H1 title from body for clean nesting in weekly blogs
  const bodyWithoutH1 = body.replace(/^#\s+[^\r\n]+\r?\n*/m, '').trim();

  // Convert all Obsidian image links in the body to web-compatible links
  const webMarkdown = convertObsidianLinks(bodyWithoutH1 || body, week, day);

  return {
    title: title || `${day.replace(/^\d+_/, '')} Notes`,
    date: frontmatter.date || '',
    week: week,
    day: day,
    summary,
    topics,
    activities,
    takeaways,
    evidence: evidenceList,
    linkedFileNames: Array.from(foundFileNames),
    rawBody: body,
    compiledMarkdown: webMarkdown,
    frontmatter
  };
}

module.exports = {
  parseDailyNote,
  convertObsidianLinks,
  extractFrontmatter,
  extractSectionList,
  categorizeFileType,
  slugify,
  IMAGE_EXTENSIONS,
  DOC_EXTENSIONS
};
