# MD → Perfect PDF

Turn Markdown into **clean, beautiful, print‑ready PDFs** — with full control over layout, typography, and theme.

This project is a **local-first Chrome Extension + PDF server** designed for people who care about *readability*, *formatting*, and *professional output*.

🚀 **[Get it Free on Chrome Web Store](https://chrome.google.com/webstore/detail/md-to-perfect-pdf/EXTENSION_ID)**  
🌐 **[Visit our Landing Page](https://kardam-codes.github.io/MD_to_Perfect_PDF/website/)**

---

## ✨ Why This Exists

Copy‑pasting Markdown into Word / Google Docs usually breaks:

* Code blocks ❌
* Headings ❌
* Lists ❌
* Page breaks ❌
* Dark/light theme consistency ❌

**MD → Perfect PDF** solves this by giving you:

* A live Markdown editor
* A Markdown‑first preview
* Pixel‑perfect PDF export

All **offline, private, and local**.

---

## ⚡ Quick Start

Start the server:
cd pdf-server
npm install
node server.js

Load the extension:
chrome://extensions → Developer Mode → Load unpacked → select extension/

Open the extension → paste content → preview → Download PDF

---

## 🚀 Deploy PDF Server on Render (Free Tier)

1. Push this repo to GitHub.
2. Create a new **Web Service** on Render.
3. Use these settings:
   - **Root Directory:** `pdf-server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
4. Add environment variable:
   - `PUPPETEER_SKIP_DOWNLOAD=true`
5. Deploy and copy the service URL (e.g. `https://your-app.onrender.com`).

You will use that URL in the extension’s `host_permissions` and fetch calls.

---

## ⚙️ Environment Switch (Local vs Production)

The editor supports a simple environment toggle.

### Local (default)
- `extension/editor.html` should have:
  - `<body data-export-env="local">`
- Uses: `http://localhost:3000/export`

### Production
- Set to:
  - `<body data-export-env="prod">`
- Uses: `https://chatgpt-pdf-extension.onrender.com/export`


## 🚀 Features

### 📝 Editor + Live Preview

* Paste Markdown directly
* Edit Markdown freely
* Instant preview with accurate formatting

### 🎨 Theme & Typography Control

## 🎨 Theme & Font Controls

* Toggle Light/Dark mode from the toolbar
* Use + / − buttons to adjust preview font size
* Headings scale proportionally for clean typography
* PDF export uses the same styling as preview
* Code blocks remain untouched for clarity

### 💻 Code Blocks (Markdown‑style)

* Syntax highlighting (dark & light)
* Copy‑code button
* Clean spacing & borders

### 📄 PDF Export

* True page breaks using `--- ---`
* Minimal margins
* Print‑friendly typography
* Same styling as preview

### 🧠 UX Polish

* Resizable editor / preview panels (with persistence)
* Scroll‑sync between editor and preview
* Empty‑state guidance
* Custom scrollbars

---

## 🗂️ Project Structure

```
MD_to_Perfect_PDF/
├─ extension/
│  ├─ editor.html
│  ├─ editor.css
│  ├─ editor.js
│  ├─ manifest.json
│  ├─ marked.min.js
│  ├─ highlight.min.js
│  ├─ highlight-dark.css
│  └─ highlight-light.css
│
├─ pdf-server/
│  ├─ server.js
│  ├─ package.json
│  └─ node_modules/ (ignored)
│
├─ website/                 # 🆕 Landing page
│  ├─ index.html            # Main landing page
│  ├─ style.css             # Design system
│  ├─ script.js             # Interactions
│  ├─ privacy.html          # Privacy policy
│  ├─ test.html             # Test results
│  └─ assets/               # Images & icons
│     ├─ hero-demo.webp      # Hero screenshot
│     ├─ export-modal.webp   # Export options
│     ├─ og-image.png       # Social sharing
│     └─ icon-128.png        # Extension icon
│
├─ .gitignore
└─ README.md
```

---

## 🧩 How It Works

### 1️⃣ Chrome Extension (Frontend)

* Accepts pasted Markdown content
* Renders Markdown using `marked`
* Enhances code blocks with `highlight.js`
* Sends rendered HTML to the PDF server

### 2️⃣ Local PDF Server (Backend)

* Receives styled HTML
* Uses headless Chromium (Puppeteer)
* Exports a high‑quality PDF

Nothing is uploaded anywhere. Everything runs locally.

---

## 🛠️ Setup Instructions

### ✅ Requirements

* Node.js (v18+ recommended)
* Google Chrome

---

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Kardam-Codes/MD_to_Perfect_PDF.git
cd MD_to_Perfect_PDF
```

---

### 🔹 2. Install PDF Server Dependencies

```bash
cd pdf-server
npm install
```

---

### 🔹 3. Start the PDF Server

```bash
node server.js
```

You should see:

```
📄 PDF server running at http://localhost:3000
```

---

### 🔹 4. Load Chrome Extension

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `extension/` folder

---

## 🧪 Usage

1. Open the extension
2. Paste your Markdown into the editor
3. Preview updates automatically
4. Adjust theme or font size if needed
5. Click **Download PDF**

### Tips

* Use `--- ---` to create page breaks
* Code blocks keep syntax highlighting automatically
* Everything runs locally (no uploads)

---

## 🧯 Troubleshooting

PDF not generating?
- Make sure the server is running on http://localhost:3000

Preview not updating?
- Reload the extension

Extension not loading?
- Ensure Developer Mode is enabled in chrome://extensions


## 🧠 Design Principles

* **Local‑first** → privacy by default
* **Predictable rendering** → what you see is what you print
* **Minimal UI** → content always comes first
* **Extensible architecture** → future features easy to add

---

## 🌐 Landing Page

This repository now includes a **production-ready landing page** in the `website/` folder:

### Features
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ✅ **Dark Theme** - Matches the extension's design philosophy  
- ✅ **Privacy First** - No external dependencies or tracking
- ✅ **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- ✅ **Interactive Elements** - Smooth scroll, animations, keyboard shortcuts
- ✅ **Accessibility** - WCAG AA compliant, screen reader friendly
- ✅ **Fast Loading** - < 2s initial load, no external dependencies

### Sections
1. Hero with CTA and trust badges
2. Problem → Solution comparison  
3. Features grid (6 cards)
4. How It Works (4 steps)
5. Export Options showcase
6. Privacy promise section
7. Final CTA
8. Footer with links

### View the Landing Page
- **Local Preview:** Open `website/index.html` in your browser
- **Live Demo:** [View on GitHub Pages](https://kardam-codes.github.io/MD_to_Perfect_PDF/website/)

---

## 🚀 Deployment

### Landing Page Deployment

#### GitHub Pages (Recommended)
1. Push to GitHub (this repo)
2. Go to Settings → Pages
3. Source: Deploy from a branch
4. Branch: main, folder: `/website`
5. Your site will be available at the GitHub Pages URL

#### Other Options
- **Netlify:** Drag-drop the `website/` folder
- **Vercel:** Connect your GitHub repo
- **Render:** Add as static site service

---

## 🛣️ Roadmap

### Phase B — PDF Quality

* Headers & footers
* Page numbers
* Cover page support
* Better table handling

### Phase C — Productivity

* Focus mode
* Preview‑only mode
* Export presets

### Phase D — Power Features

* Markdown auto‑capture
* Section navigation
* Multi‑document export

---

## 🤝 Contributing

Contributions are welcome!

If you want to:

* Improve UI/UX
* Enhance PDF output
* Add power features

Open an issue or submit a PR.

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## ⭐ Final Note

This project was built with **care for detail**, not speed.

If you value clean documents, readable code, and professional output — this tool is for you.
