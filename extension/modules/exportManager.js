import { Utils } from "./utils.js";

export class ExportManager {
  constructor(editorElement, fontManager) {
    this.editor = editorElement;
    this.fontManager = fontManager;
    this.downloadBtn = document.getElementById("download");
    this.modal = document.getElementById("exportModal");
    this.closeBtn = document.getElementById("exportClose");
    this.cancelBtn = document.getElementById("exportCancel");
    this.confirmBtn = document.getElementById("exportConfirm");
    this.backdrop = this.modal?.querySelector(".modal-backdrop");
    this.themeSelect = null;
    this.pageSizeSelect = null;
    this.orientationSelect = null;
    this.fontSelect = document.getElementById("pdfFont");
    this.bindEvents();
  }

  bindEvents() {
    if (!this.downloadBtn) return;
    this.downloadBtn.addEventListener("click", () => this.openModal());
    if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.closeModal());
    if (this.cancelBtn) this.cancelBtn.addEventListener("click", () => this.closeModal());
    if (this.backdrop) this.backdrop.addEventListener("click", () => this.closeModal());
    if (this.confirmBtn) this.confirmBtn.addEventListener("click", () => this.exportPDF());
  }

  openModal() {
    if (!this.modal) return;
    this.modal.classList.add("open");
    this.modal.setAttribute("aria-hidden", "false");
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove("open");
    this.modal.setAttribute("aria-hidden", "true");
  }

  exportPDF() {
    const markdown = this.editor?.value || "";
    if (!markdown.trim()) {
      Utils.showToast("Paste something first!", "error");
      return;
    }

    const options = this.collectOptions();
    const html = this.renderMarkdownForPrint(markdown);
    const docTitle = this.getDocumentTitle(markdown);
    const theme = options.theme;
    if (theme === "dark") {
      Utils.showToast("For dark PDF, enable 'Background graphics' in print options.", "success");
    }
    const printWindow = window.open("about:blank", "_blank");
    if (!printWindow) {
      Utils.showToast("Popup blocked. Allow popups and try again.", "error");
      return;
    }

    const printHTML = this.buildPrintDocument(html, docTitle, theme, options);
    printWindow.document.open();
    printWindow.document.write(printHTML);
    printWindow.document.close();
    this.closeModal();

    printWindow.onload = () => {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
        } catch {
          Utils.showToast("Press Ctrl+P in the new tab to save as PDF.", "error");
        }
      }, 150);
    };
  }

  renderMarkdownForPrint(markdown) {
    if (!window.marked) return markdown;
    const normalized = markdown
      .replace(/^\s*\\{1,2}pagebreak\s*$/gim, "\n\n<div class=\"page-break\"></div>\n\n")
      .replace(/^\s*---\s*---\s*$/gim, "\n\n<div class=\"page-break\"></div>\n\n");
    marked.setOptions({ gfm: true, breaks: true });
    let html = marked.parse(normalized);
    html = html.replace(/<hr>\s*<hr>/g, '<div class="page-break"></div>');
    return html;
  }

  getDocumentTitle(markdown) {
    const heading = markdown.match(/^\s*#\s+(.+)$/m);
    return heading ? heading[1].trim() : "Markdown Document";
  }

  collectOptions() {
    const matchTheme = document.body.classList.contains("light") ? "light" : "dark";
    const selectedTheme = document.querySelector('input[name="pdfTheme"]:checked')?.value || "match";
    return {
      theme: selectedTheme === "match" ? matchTheme : selectedTheme,
      pageSize: document.querySelector('input[name="pdfPageSize"]:checked')?.value || "A4",
      orientation: document.querySelector('input[name="pdfOrientation"]:checked')?.value || "portrait",
      font: this.fontSelect?.value || "match"
    };
  }

  buildPrintDocument(contentHTML, docTitle, theme, options) {
    const isLight = theme === "light";
    const colors = isLight
      ? {
          text: "#0f172a",
          bg: "#ffffff",
          heading: "#0f172a",
          link: "#1d4ed8",
          border: "#dbe3ef",
          preBg: "#f8fafc",
          inlineCodeBg: "#eef2ff",
          quoteText: "#334155"
        }
      : {
          text: "#e5e7eb",
          bg: "#020617",
          heading: "#f8fafc",
          link: "#7dd3fc",
          border: "#334155",
          preBg: "#0b1220",
          inlineCodeBg: "#1e293b",
          quoteText: "#cbd5e1"
        };

    const fontFamily = this.resolveFontStack(options.font);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHTML(docTitle)}</title>
  <style>
    @page { size: ${options.pageSize} ${options.orientation}; margin: 18mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: ${colors.text};
      background: ${colors.bg};
      font: 14px/1.6 ${fontFamily};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { width: 100%; }
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      color: ${colors.heading};
      line-height: 1.25;
    }
    h1 { font-size: 26px; margin: 0 0 12px; }
    h2 { font-size: 22px; margin: 20px 0 10px; }
    h3 { font-size: 18px; margin: 16px 0 8px; }
    p { margin: 0 0 10px; }
    ul, ol { margin: 0 0 12px; padding-left: 22px; }
    li { margin: 3px 0; }
    ul ul, ol ol, ul ol, ol ul { margin-bottom: 0; }
    a { color: ${colors.link}; text-decoration: underline; }
    hr { border: 0; border-top: 1px solid ${colors.border}; margin: 16px 0; }
    p, li, td, th { overflow-wrap: anywhere; word-break: break-word; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    pre {
      background: ${colors.preBg};
      border: 1px solid ${colors.border};
      border-radius: 8px;
      padding: 10px 12px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      page-break-inside: avoid;
    }
    pre code {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    code:not(pre code) {
      background: ${colors.inlineCodeBg};
      border: 1px solid ${colors.border};
      border-radius: 4px;
      padding: 1px 4px;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
      margin: 10px 0;
      font-size: 12px;
    }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    th, td {
      border: 1px solid ${colors.border};
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    th {
      background: ${colors.inlineCodeBg};
      font-weight: 600;
    }
    img { max-width: 100%; height: auto; }
    blockquote {
      margin: 10px 0;
      padding: 4px 12px;
      border-left: 3px solid ${colors.border};
      color: ${colors.quoteText};
      background: ${colors.preBg};
      border-radius: 2px;
    }
    .page-break {
      break-before: page;
      page-break-before: always;
    }
  </style>
</head>
<body>
  <article class="doc">${contentHTML}</article>
</body>
</html>`;
  }

  escapeHTML(input) {
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  resolveFontStack(fontKey) {
    if (this.fontManager) {
      return this.fontManager.getFontStack(fontKey);
    }
    const fallback = `"Inter", system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;
    return fontKey === "match" ? fallback : fallback;
  }
}
