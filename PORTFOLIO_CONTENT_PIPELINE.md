# Automated Obsidian-to-GitHub Portfolio Content Pipeline

A production-ready **"Dump and Compile"** automated workflow for documenting and publishing weekly PRICE ProtoSem fellowship chronicles, daily notes, and multimedia portfolio evidence directly from **Obsidian** to your live portfolio website.

---

## 🏗️ Architecture & How It Works

```
Obsidian Vault (portfolio-content/)
       │
       ▼  (Write Markdown & drop photos into Week/Day folder)
Git Push / GitHub Desktop
       │
       ▼  (Pushed to GitHub repository)
GitHub Actions (.github/workflows/auto-publish.yml)
       │
       ▼  (Runs node scripts/build-templates.js)
Compiled Artifacts:
  ├── public/assets/weekly/<Week>/<Day>/ (Optimized Media)
  ├── assets/weekly/<Week>/<Day>/        (Mirrored Web Media)
  ├── src/content/blogs/Week_XX.md       (Weekly Markdown Chronicles)
  └── src/data/compiledProtoSem.json     (Structured JSON Database)
       │
       ▼  (Auto-committed to repo with [skip ci])
Live Portfolio Website (Visakan K Portfolio)
```

No manual "Local Sync" clicking required. Everything compiles and publishes automatically.

---

## 🚀 The Student Workflow (Quick Start)

The daily publishing workflow takes less than 2 minutes:

1. **Step 1: Open Obsidian**
   - Launch Obsidian on your computer.
2. **Step 2: Open Vault**
   - Choose **"Open folder as vault"** and select the `portfolio-content` directory in this repository.
3. **Step 3: Go to the Day Folder**
   - In Obsidian's file explorer, expand the current week (e.g., `Week_00`) and open the day folder (e.g., `01_Monday`).
4. **Step 4: Write or Paste Your Note**
   - Create or edit a Markdown file in that folder (e.g., `Monday.md` or `01_Monday.md`).
   - Use standard headings (`## Topics Covered`, `## Practical Activities`, `## Evidence`, `## Key Takeaways`).
5. **Step 5: Drag & Drop Media**
   - Paste or drag photos, diagrams, or documents into the day note or directly into the day folder.
   - Obsidian automatically creates `![[image-name.jpg]]` embed links.
6. **Step 6: Commit and Push with GitHub Desktop**
   - Open GitHub Desktop.
   - You will see the new files in `portfolio-content/`.
   - Type a commit message (e.g., `"Update Week 00 Day 1 notes and photos"`) and click **Commit to main**, then click **Push origin**.
7. **Step 7: GitHub Actions Compiles Automatically**
   - GitHub Actions detects changes in `portfolio-content/**`, runs the compiler, and commits the compiled blogs, media, and JSON database back to the repository.
8. **Step 8: Live Website Updated**
   - Your portfolio website immediately receives the compiled weekly stories and evidence without any manual intervention!

---

## 📁 Repository Directory Structure

```
visakan2004.github.io/
├── portfolio-content/                  <-- Obsidian Vault Root
│   ├── .obsidian/
│   │   └── app.json                    <-- Obsidian attachment & link config
│   ├── Week_00/
│   │   ├── 01_Monday/
│   │   │   ├── Monday.md
│   │   │   └── marshmallow-challenge.jpg
│   │   ├── 02_Tuesday/
│   │   ├── 03_Wednesday/
│   │   ├── 04_Thursday/
│   │   ├── 05_Friday/
│   │   └── 06_Saturday/
│   ├── Week_01/
│   │   └── ...
│   └── Week_19/
│       └── ...
│
├── scripts/
│   └── build-templates.js              <-- Compiler script
│
├── src/
│   ├── services/
│   │   └── obsidianParser.js           <-- Daily note parser & link converter
│   ├── content/
│   │   └── blogs/                      <-- Generated weekly Markdown chronicles
│   │       ├── Week_00.md
│   │       └── ...
│   └── data/
│       └── compiledProtoSem.json       <-- Consolidated structured dataset
│
├── public/
│   └── assets/
│       └── weekly/                     <-- Generated web media assets
│           └── Week_00/01_Monday/
│
├── assets/
│   └── weekly/                         <-- Mirrored web media assets (GitHub Pages)
│       └── Week_00/01_Monday/
│
└── .github/
    └── workflows/
        └── auto-publish.yml            <-- GitHub Actions automated build workflow
```

---

## 📝 Daily Note Markdown Format & Conventions

The parser is designed to be forgiving and support both **YAML Frontmatter** and standard **Markdown Headings**.

### Recommended Daily Note Template

```markdown
---
title: "Orientation & Team Icebreakers"
date: "2026-08-17"
week: "Week_00"
day: "01_Monday"
topics:
  - "Introduction to PRICE ProtoSem Fellowship"
  - "Cohort Networking & Mindset Alignment"
  - "Design Thinking Fundamentals"
activities:
  - "The Marshmallow Challenge spaghetti tower prototyping"
  - "Cross-functional team formation and introductions"
takeaways:
  - "Rapid prototyping reveals assumptions earlier than endless planning."
---

# Orientation & Team Icebreakers

Our journey began with immersive introductions, exploring the philosophy of ProtoSem, and getting to know our fellow innovators. Rather than standard lectures, we dove directly into experiential problem-solving.

## Topics Covered
- Introduction to PRICE ProtoSem Fellowship
- Cohort Networking & Mindset Alignment
- Design Thinking Fundamentals

## Practical Activities
- The Marshmallow Challenge spaghetti tower prototyping
- Cross-functional team formation and introductions
- Interactive cohort goal setting

## Evidence
- ![[marshmallow-challenge.jpg|The Marshmallow Challenge: Rapid prototyping in action]]

## Key Takeaways
- Rapid prototyping reveals assumptions earlier than endless planning.
- True collaboration requires empathy, active listening, and collective ownership.
```

### Supported Sections
- **Title**: Defined via frontmatter `title: "..."` or `# Your Title` H1 heading.
- **Date**: Defined via frontmatter `date: "YYYY-MM-DD"`.
- **Topics**: `## Topics` or `## Topics Covered` or `## Key Learnings` (bullet list).
- **Activities**: `## Activities` or `## Practical Activities` or `## Tasks` (bullet list).
- **Evidence**: `## Evidence` or `## Artifacts` (with `![[image.jpg|Caption]]` or relative markdown links).
- **Takeaways**: `## Key Takeaways` or `## Reflections`.

---

## 🖼️ Adding Media & Images

### How Obsidian Image Links Work
When you drop an image (e.g. `team-photo.jpg`) into Obsidian, it creates a link formatted as:
```markdown
![[team-photo.jpg]]
```
You can also specify a caption or alt text using the pipe `|` symbol:
```markdown
![[team-photo.jpg|Team brainstorming session]]
```

### Automatic Web Conversion
During compilation, `scripts/build-templates.js` automatically:
1. Copies `team-photo.jpg` into `public/assets/weekly/<Week>/<Day>/team-photo.jpg` and `assets/weekly/<Week>/<Day>/team-photo.jpg`.
2. Converts the wikilink into web-standard Markdown:
   ```markdown
   ![Team brainstorming session](/assets/weekly/Week_00/01_Monday/team-photo.jpg)
   ```

### Automatic Unlinked Media Detection & Gallery Generation
If you drop images or documents into a day folder without referencing them in your Markdown note:
- The compiler detects them automatically.
- Adds them to `compiledProtoSem.json` evidence list with `linked: false`.
- Generates an automated **`### Gallery`** section at the bottom of that day's compiled weekly blog!

### Supported Media Extensions
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- **Documents & Video**: `.mp4`, `.webm`, `.pdf`, `.doc`, `.docx`

---

## 🔄 GitHub Actions Automation Details

The automated pipeline is defined in `.github/workflows/auto-publish.yml`:

- **Triggers**:
  - Automatically runs when files in `portfolio-content/**` are pushed to `main`.
  - Can be manually triggered anytime via the **Actions** tab in GitHub (**"Run workflow"**).
  - Automatically runs on a scheduled cron every Monday at 05:00 UTC (`0 5 * * 1`).
- **Environment**: Ubuntu, Node.js 20.
- **Permissions**: `contents: write` (permits pushing compiled artifacts back to repository).
- **Commit Safety**:
  - Stages only generated output files (`public/assets/weekly/**`, `assets/weekly/**`, `src/content/blogs/**`, `src/data/compiledProtoSem.json`).
  - Uses `[skip ci]` in the commit message to prevent recursive build loops.

---

## 🧪 Testing the Compiler Locally

You can test the entire compilation process locally on your machine anytime.

### Command
```bash
npm run build:content
```
Or directly:
```bash
node scripts/build-templates.js
```

### Testing Asset Serving with the Local Server
```bash
npm start
```
Open your browser and navigate to:
- Website: `http://localhost:3000`
- Compiled JSON: `http://localhost:3000/src/data/compiledProtoSem.json`
- Sample compiled asset: `http://localhost:3000/assets/weekly/Week_00/01_Monday/marshmallow-challenge.jpg`

---

## 🛠️ Troubleshooting Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Image not displaying on website** | Image name in note does not match actual filename exactly (case-sensitive) | Ensure filename in `![[my-photo.jpg]]` matches the file inside that day's folder. |
| **Image dropped in root instead of day folder** | Obsidian vault settings not configured | Verify `portfolio-content/.obsidian/app.json` has `"attachmentFolderPath": "./"`. |
| **GitHub Action fails with permissions error** | GitHub repository workflow permissions restricted | Go to GitHub Repo -> **Settings** -> **Actions** -> **General** -> **Workflow permissions** -> Select **"Read and write permissions"** -> Save. |
| **Command `node` not found locally** | Node.js directory not in current terminal PATH | Open a new PowerShell terminal or run `npm run build:content`. |
| **Unlinked images not showing in notes** | Expected behavior for unlinked photos | The compiler automatically puts unlinked photos into the `### Gallery` section and `compiledProtoSem.json`. |
