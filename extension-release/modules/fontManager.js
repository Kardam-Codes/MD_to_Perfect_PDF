export class FontManager {
  constructor() {
    this.fontSelect = document.getElementById("fontSelect");
    this.pdfFontSelect = document.getElementById("pdfFont");
    this.fontPreview = document.getElementById("fontPreviewText");
    this.root = document.documentElement;
    this.currentFont = "system";
    this.fontStacks = {
      system: `system-ui, -apple-system, "Segoe UI", Arial, sans-serif`,
      arial: `Arial, "Helvetica Neue", Helvetica, sans-serif`,
      verdana: `Verdana, Geneva, sans-serif`,
      tahoma: `Tahoma, "Segoe UI", sans-serif`,
      trebuchet: `"Trebuchet MS", "Lucida Grande", sans-serif`,
      georgia: `Georgia, "Times New Roman", serif`,
      times: `"Times New Roman", Times, serif`,
      palatino: `"Palatino Linotype", Palatino, "Book Antiqua", serif`,
      garamond: `Garamond, "Times New Roman", serif`,
      source_code: `"Courier New", Courier, monospace`
    };
    this.init();
  }

  init() {
    chrome.storage.local.get("editorFont", (data) => {
      const saved = data.editorFont;
      this.setFont(this.fontStacks[saved] ? saved : "system", false);
    });

    if (this.fontSelect) {
      this.fontSelect.addEventListener("change", () => {
        this.setFont(this.fontSelect.value, true);
      });
    }

    if (this.pdfFontSelect) {
      this.pdfFontSelect.addEventListener("change", () => this.updatePreview());
    }
  }

  setFont(fontKey, persist) {
    this.currentFont = this.fontStacks[fontKey] ? fontKey : "system";
    const stack = this.fontStacks[this.currentFont];
    this.root.style.setProperty("--editor-font", stack);
    this.root.style.setProperty("--preview-font", stack);

    if (this.fontSelect) this.fontSelect.value = this.currentFont;
    if (this.pdfFontSelect && this.pdfFontSelect.value === "match") {
      this.updatePreview();
    }
    this.updatePreview();
    if (persist) chrome.storage.local.set({ editorFont: this.currentFont });
  }

  getCurrentFontKey() {
    return this.currentFont;
  }

  getCurrentFontStack() {
    return this.fontStacks[this.currentFont] || this.fontStacks.system;
  }

  getFontStack(fontKey) {
    if (fontKey === "match") return this.getCurrentFontStack();
    return this.fontStacks[fontKey] || this.fontStacks.system;
  }

  updatePreview() {
    if (!this.fontPreview) return;
    const key = this.pdfFontSelect?.value || "match";
    this.fontPreview.style.fontFamily = this.getFontStack(key);
  }
}
