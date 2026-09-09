# Visakan K — AI & Data Analytics Portfolio

Welcome to the personal portfolio repository of **Visakan K** (MCA scholar at Kumaraguru College of Technology, Coimbatore).

- 🌐 **Live Website**: [visakan2004.github.io](https://visakan2004.github.io)
- 🚀 **PRICE ProtoSem**: Phygital Retail Intelligent Commerce and Entrepreneurship Fellowship (20-Week Chronicle)
- 🤖 **Specialization**: Machine Learning, Deep Learning, NLP, Data Analytics & Intelligent Systems

---

## ⚡ Automated Obsidian-to-GitHub Content Pipeline

This repository includes an automated **"Dump and Compile"** content engine that turns daily Obsidian notes and media into compiled weekly chronicles and structured JSON data.

For complete documentation on setting up Obsidian, writing daily notes, adding photos, and testing:
👉 **[Read the Full Pipeline Guide: PORTFOLIO_CONTENT_PIPELINE.md](PORTFOLIO_CONTENT_PIPELINE.md)**

### Quick Commands

```bash
# Run local development server (Express on port 3000)
npm start

# Compile Obsidian notes, media, and JSON database locally
npm run build:content
```

---

## 🛠️ Tech Stack

- **Frontend**: Modern Vanilla HTML5, CSS3 (Extreme Cyber Aurora / Glassmorphism), and Vanilla JavaScript
- **Backend**: Node.js & Express (`server.js`)
- **Pipeline Engine**: Node.js CommonJS parser (`src/services/obsidianParser.js`) and compiler (`scripts/build-templates.js`)
- **CI/CD Automation**: GitHub Actions (`.github/workflows/auto-publish.yml`)
- **Vault Editor**: Obsidian Markdown
