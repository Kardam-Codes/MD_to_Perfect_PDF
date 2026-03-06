export class Utils {
  static async saveMarkdown(content) {
    return new Promise((resolve) => chrome.storage.local.set({ markdown: content }, resolve));
  }

  static async loadMarkdown() {
    return new Promise((resolve) => {
      chrome.storage.local.get("markdown", (data) => resolve(data.markdown || ""));
    });
  }

  static renderMarkdown(markdown) {
    if (!window.marked) return markdown;
    marked.setOptions({ gfm: true, breaks: true });
    return marked.parse(markdown || "");
  }

  static showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }
}
