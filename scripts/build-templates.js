/**
 * scripts/build-templates.js
 * 
 * Production-ready compiler for ProtoSem Obsidian Content Pipeline.
 * 
 * Workflow:
 * 1. Reads portfolio-content/ (Weeks 00 to 19, Monday through Saturday).
 * 2. Copies all media (images & documents) to public/assets/weekly/<Week>/<Day>/ and mirrors to assets/weekly/.
 * 3. Uses src/services/obsidianParser.js to parse daily Markdown notes, frontmatter, topics, activities, evidence.
 * 4. Converts Obsidian image embeds (![[image.png]]) into web-compatible paths.
 * 5. Identifies unlinked media files and appends an automated Gallery section.
 * 6. Generates compiled weekly Markdown chronicles in src/content/blogs/Week_XX.md.
 * 7. Generates consolidated structured dataset at src/data/compiledProtoSem.json.
 */

const fs = require('fs');
const path = require('path');
const {
  parseDailyNote,
  categorizeFileType,
  slugify,
  IMAGE_EXTENSIONS,
  DOC_EXTENSIONS
} = require('../src/services/obsidianParser');

// Directory paths
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'portfolio-content');
const PUBLIC_ASSETS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'weekly');
const ROOT_ASSETS_DIR = path.join(ROOT_DIR, 'assets', 'weekly');
const COMPILED_DIR = path.join(ROOT_DIR, 'src', 'content', 'blogs');
const JSON_OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'data', 'compiledProtoSem.json');

// Supported Day directories in order
const DAY_ORDER = [
  '01_Monday',
  '02_Tuesday',
  '03_Wednesday',
  '04_Thursday',
  '05_Friday',
  '06_Saturday'
];

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Copy file safely
 */
function copyFileSafe(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/**
 * Check if file is a supported image
 */
function isImage(fileName) {
  const ext = path.extname(fileName).toLowerCase().replace('.', '');
  return IMAGE_EXTENSIONS.has(ext);
}

/**
 * Check if file is supported media / document
 */
function isMediaOrDoc(fileName) {
  const ext = path.extname(fileName).toLowerCase().replace('.', '');
  return IMAGE_EXTENSIONS.has(ext) || DOC_EXTENSIONS.has(ext);
}

/**
 * Main Compiler Function
 */
function buildPipeline() {
  console.log('====================================================');
  console.log('🚀 Starting ProtoSem Portfolio Content Compilation');
  console.log('====================================================');

  // Ensure output directories exist
  ensureDir(PUBLIC_ASSETS_DIR);
  ensureDir(ROOT_ASSETS_DIR);
  ensureDir(COMPILED_DIR);
  ensureDir(path.dirname(JSON_OUTPUT_PATH));

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`⚠️ Content directory not found: ${CONTENT_DIR}. Creating now.`);
    ensureDir(CONTENT_DIR);
  }

  const allDaysData = {};
  const allEvidence = [];
  const weeklyBlogs = {};

  let totalNotesProcessed = 0;
  let totalMediaCopied = 0;
  let totalEvidenceGenerated = 0;

  // Process Week_00 through Week_19
  for (let weekIdx = 0; weekIdx <= 19; weekIdx++) {
    const weekStr = 'Week_' + (weekIdx < 10 ? '0' + weekIdx : weekIdx);
    const weekDir = path.join(CONTENT_DIR, weekStr);

    weeklyBlogs[weekStr] = {
      week: weekStr,
      weekNumber: weekIdx,
      days: []
    };

    if (!fs.existsSync(weekDir)) {
      continue;
    }

    for (let dayIdx = 0; dayIdx < DAY_ORDER.length; dayIdx++) {
      const dayFolder = DAY_ORDER[dayIdx];
      const dayDir = path.join(weekDir, dayFolder);
      const dayName = dayFolder.replace(/^\d+_/, '');
      const dayNumber = dayIdx + 1;
      const dayKey = `${weekStr}_${dayFolder}`;

      if (!fs.existsSync(dayDir)) {
        continue;
      }

      // Read files in day directory
      const filesInDay = fs.readdirSync(dayDir);

      // Find Markdown files and Media files
      const mdFiles = filesInDay.filter(f => f.endsWith('.md') && !f.startsWith('.'));
      const mediaFiles = filesInDay.filter(f => isMediaOrDoc(f) && !f.startsWith('.'));

      // Copy media files to public/assets/weekly/<Week>/<Day>/ and assets/weekly/<Week>/<Day>/
      for (const media of mediaFiles) {
        const srcPath = path.join(dayDir, media);
        const publicDest = path.join(PUBLIC_ASSETS_DIR, weekStr, dayFolder, media);
        const rootDest = path.join(ROOT_ASSETS_DIR, weekStr, dayFolder, media);

        copyFileSafe(srcPath, publicDest);
        copyFileSafe(srcPath, rootDest);
        totalMediaCopied++;
      }

      // If no markdown and no media, skip empty day
      if (mdFiles.length === 0 && mediaFiles.length === 0) {
        continue;
      }

      // Aggregate day content across markdown files (usually 1 note per day, e.g. Monday.md or notes.md)
      let aggregatedNote = {
        title: `${dayName} - Week ${weekIdx < 10 ? '0' + weekIdx : weekIdx}`,
        date: '',
        summary: '',
        topics: [],
        activities: [],
        takeaways: [],
        evidence: [],
        linkedFileNames: [],
        compiledMarkdown: '',
        rawBody: ''
      };

      if (mdFiles.length > 0) {
        // Read primary markdown file (or combine if multiple)
        const parsedNotes = mdFiles.map(mdFile => {
          const filePath = path.join(dayDir, mdFile);
          const rawContent = fs.readFileSync(filePath, 'utf8');
          return parseDailyNote(rawContent, {
            week: weekStr,
            day: dayFolder,
            fileName: mdFile
          });
        });

        // Combine primary note fields
        const primary = parsedNotes[0];
        aggregatedNote.title = primary.title || aggregatedNote.title;
        aggregatedNote.date = primary.date || '';
        aggregatedNote.summary = primary.summary || '';
        aggregatedNote.topics = primary.topics || [];
        aggregatedNote.activities = primary.activities || [];
        aggregatedNote.takeaways = primary.takeaways || [];
        aggregatedNote.evidence = [...primary.evidence];
        aggregatedNote.linkedFileNames = [...primary.linkedFileNames];
        aggregatedNote.compiledMarkdown = parsedNotes.map(n => n.compiledMarkdown).join('\n\n---\n\n');
        aggregatedNote.rawBody = parsedNotes.map(n => n.rawBody).join('\n\n');

        // Merge extra notes if multiple
        for (let k = 1; k < parsedNotes.length; k++) {
          aggregatedNote.topics.push(...parsedNotes[k].topics);
          aggregatedNote.activities.push(...parsedNotes[k].activities);
          aggregatedNote.takeaways.push(...parsedNotes[k].takeaways);
          aggregatedNote.evidence.push(...parsedNotes[k].evidence);
          aggregatedNote.linkedFileNames.push(...parsedNotes[k].linkedFileNames);
        }

        totalNotesProcessed += mdFiles.length;
      }

      // Detect unlinked media files
      const linkedSet = new Set(aggregatedNote.linkedFileNames);
      const unlinkedMediaList = [];
      const galleryList = [];

      for (const media of mediaFiles) {
        const webUrl = `/assets/weekly/${weekStr}/${dayFolder}/${media}`;
        const storageKey = `${weekStr}/${dayFolder}/${media}`;
        const isLinked = linkedSet.has(media);

        if (!isLinked) {
          const fileType = categorizeFileType(media);
          const unlinkedItem = {
            id: slugify(`${weekStr}_${dayFolder}_${media}`),
            title: media,
            caption: media,
            fileName: media,
            fileType: fileType,
            url: webUrl,
            previewUrl: webUrl,
            storageKey: storageKey,
            linked: false
          };
          unlinkedMediaList.push(unlinkedItem);
          aggregatedNote.evidence.push(unlinkedItem);
        }

        // Add all images to gallery
        if (isImage(media)) {
          galleryList.push(webUrl);
        }
      }

      // Generate Markdown gallery section for unlinked images if any exist
      let galleryMarkdown = '';
      const unlinkedImages = unlinkedMediaList.filter(m => isImage(m.fileName));
      if (unlinkedImages.length > 0) {
        galleryMarkdown = '\n\n### Gallery\n\n' + unlinkedImages.map(img => {
          return `![${img.title}](${img.url})`;
        }).join('\n\n');

        aggregatedNote.compiledMarkdown += galleryMarkdown;
      }

      // Construct structured day object
      const dayData = {
        id: dayKey,
        week: weekStr,
        weekNumber: weekIdx,
        day: dayFolder,
        dayName: dayName,
        dayNumber: dayNumber,
        date: aggregatedNote.date,
        title: aggregatedNote.title,
        summary: aggregatedNote.summary,
        topics: aggregatedNote.topics,
        activities: aggregatedNote.activities,
        takeaways: aggregatedNote.takeaways,
        evidence: aggregatedNote.evidence,
        gallery: galleryList,
        unlinkedMedia: unlinkedMediaList,
        storageKey: `${weekStr}/${dayFolder}`,
        compiledMarkdown: aggregatedNote.compiledMarkdown,
        hasContent: true
      };

      allDaysData[dayKey] = dayData;
      // Also provide canonical slash key for flexible frontend access
      allDaysData[`${weekStr}/${dayFolder}`] = dayData;

      weeklyBlogs[weekStr].days.push(dayData);

      // Add to global evidence list
      for (const ev of aggregatedNote.evidence) {
        allEvidence.push({
          ...ev,
          week: weekStr,
          day: dayFolder,
          weekNumber: weekIdx,
          dayNumber: dayNumber
        });
        totalEvidenceGenerated++;
      }
    }
  }

  // Generate Weekly Markdown files in src/content/blogs/Week_XX.md
  for (let weekIdx = 0; weekIdx <= 19; weekIdx++) {
    const weekStr = 'Week_' + (weekIdx < 10 ? '0' + weekIdx : weekIdx);
    const weekData = weeklyBlogs[weekStr];
    const mdOutPath = path.join(COMPILED_DIR, `${weekStr}.md`);

    let mdContent = '';
    mdContent += `# PRICE ProtoSem — ${weekStr.replace('_', ' ')}\n\n`;

    if (!weekData || weekData.days.length === 0) {
      mdContent += `*Weekly notes for ${weekStr.replace('_', ' ')} are currently in progress.*\n\n`;
      mdContent += `Drop daily notes into \`portfolio-content/${weekStr}/<Day>/\` to automatically compile this chronicle.\n`;
    } else {
      mdContent += `> Consolidated Weekly Learning Journey & Portfolio Evidence\n\n`;

      for (const day of weekData.days) {
        mdContent += `## ${day.dayName} — ${day.title}\n\n`;
        if (day.date) {
          mdContent += `**Date:** ${day.date}\n\n`;
        }

        if (day.compiledMarkdown) {
          mdContent += `${day.compiledMarkdown}\n\n`;
        } else {
          if (day.summary) {
            mdContent += `${day.summary}\n\n`;
          }

          if (day.topics && day.topics.length > 0) {
            mdContent += `### Topics Covered\n`;
            for (const t of day.topics) {
              mdContent += `- ${t}\n`;
            }
            mdContent += `\n`;
          }

          if (day.activities && day.activities.length > 0) {
            mdContent += `### Practical Activities\n`;
            for (const a of day.activities) {
              mdContent += `- ${a}\n`;
            }
            mdContent += `\n`;
          }

          if (day.takeaways && day.takeaways.length > 0) {
            mdContent += `### Key Takeaways\n`;
            for (const tk of day.takeaways) {
              mdContent += `- ${tk}\n`;
            }
            mdContent += `\n`;
          }
        }

        mdContent += `---\n\n`;
      }
    }

    fs.writeFileSync(mdOutPath, mdContent.trim() + '\n', 'utf8');
  }

  // Generate compiled JSON output at src/data/compiledProtoSem.json
  const finalJson = {
    lastCompiled: new Date().toISOString(),
    weeksCount: 20,
    stats: {
      totalWeeks: 20,
      totalNotesProcessed,
      totalMediaCopied,
      totalEvidenceGenerated,
      activeDaysCount: Object.keys(allDaysData).length / 2 // account for alias keys
    },
    days: allDaysData,
    evidence: allEvidence
  };

  // Avoid unnecessary commits if content did not change
  if (fs.existsSync(JSON_OUTPUT_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(JSON_OUTPUT_PATH, 'utf8'));
      if (
        JSON.stringify(existing.days || {}) === JSON.stringify(finalJson.days) &&
        JSON.stringify(existing.evidence || []) === JSON.stringify(finalJson.evidence)
      ) {
        finalJson.lastCompiled = existing.lastCompiled || finalJson.lastCompiled;
      }
    } catch (e) {}
  }

  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(finalJson, null, 2), 'utf8');

  console.log('✅ Compilation Completed Successfully!');
  console.log(`📁 Weekly Markdown Blogs: ${COMPILED_DIR}`);
  console.log(`📄 Structured JSON Output: ${JSON_OUTPUT_PATH}`);
  console.log(`🖼️ Media Copied: ${totalMediaCopied} files to ${PUBLIC_ASSETS_DIR}`);
  console.log(`📝 Notes Processed: ${totalNotesProcessed} notes`);
  console.log(`🔍 Evidence Records: ${totalEvidenceGenerated} items`);
  console.log('====================================================');
}

// Execute if run directly
if (require.main === module) {
  try {
    buildPipeline();
    process.exit(0);
  } catch (err) {
    console.error('❌ Compilation failed:', err);
    process.exit(1);
  }
}

module.exports = { buildPipeline };
