import { ThemeManager } from "./modules/themeManager.js";
import { ExportManager } from "./modules/exportManager.js";
import { Utils } from "./modules/utils.js";
import { FontManager } from "./modules/fontManager.js";

class EditorController {
  constructor() {
    this.editor = document.getElementById("editor");
    this.preview = document.getElementById("preview");
    this.workspace = document.getElementById("workspace");
    this.resizer = document.getElementById("resizer");
    this.themeManager = new ThemeManager();
    this.fontManager = new FontManager();
    this.exportManager = new ExportManager(this.editor, this.fontManager);
    this.isSyncingScroll = false;
    this.init();
  }

  async init() {
    if (!this.editor || !this.preview) return;

    const saved = await Utils.loadMarkdown();
    this.editor.value = saved;
    this.render();

    this.editor.addEventListener("input", () => {
      this.render();
      Utils.saveMarkdown(this.editor.value);
    });

    this.editor.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        Utils.saveMarkdown(this.editor.value);
        Utils.showToast("Saved", "success");
      }
    });

    this.setupResizer();
    this.setupScrollSync();
  }

  render() {
    let html = Utils.renderMarkdown(this.editor.value);
    html = html.replace(/<hr>\s*<hr>/g, '<div class="page-break"></div>');
    this.preview.innerHTML = html;
  }

  setupResizer() {
    if (!this.resizer || !this.workspace) return;

    chrome.storage.local.get("editorWidth", (data) => {
      if (!data.editorWidth) return;
      const rect = this.workspace.getBoundingClientRect();
      const width = Math.max(180, Math.min(data.editorWidth, rect.width - 180));
      this.workspace.style.gridTemplateColumns = `${width}px 8px auto`;
    });

    let dragging = false;

    this.resizer.addEventListener("mousedown", (e) => {
      dragging = true;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const rect = this.workspace.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < 180 || x > rect.width - 180) return;
      this.workspace.style.gridTemplateColumns = `${x}px 8px auto`;
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = "auto";
      document.body.style.cursor = "default";

      const width = parseInt(this.workspace.style.gridTemplateColumns, 10);
      if (!Number.isNaN(width)) {
        chrome.storage.local.set({ editorWidth: width });
      }
    });
  }

  setupScrollSync() {
    if (!this.editor || !this.preview) return;

    const sync = (from, to) => {
      if (this.isSyncingScroll) return;

      const fromRange = from.scrollHeight - from.clientHeight;
      const toRange = to.scrollHeight - to.clientHeight;
      if (fromRange <= 0 || toRange <= 0) return;

      const ratio = from.scrollTop / fromRange;
      this.isSyncingScroll = true;
      to.scrollTop = ratio * toRange;

      requestAnimationFrame(() => {
        this.isSyncingScroll = false;
      });
    };

    this.editor.addEventListener("scroll", () => sync(this.editor, this.preview));
    this.preview.addEventListener("scroll", () => sync(this.preview, this.editor));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.editorController = new EditorController();
});
