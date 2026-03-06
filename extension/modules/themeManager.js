export class ThemeManager {
  constructor() {
    this.themeBtn = document.getElementById("themeToggle");
    this.themeIcon = document.getElementById("themeIcon");
    this.currentTheme = "dark";
    this.init();
  }

  init() {
    chrome.storage.local.get("theme", (data) => {
      const theme = data.theme === "light" ? "light" : "dark";
      this.setTheme(theme);
    });

    if (this.themeBtn) {
      this.themeBtn.addEventListener("click", () => {
        this.setTheme(this.currentTheme === "light" ? "dark" : "light");
      });
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.body.classList.toggle("light", theme === "light");
    chrome.storage.local.set({ theme });
    this.updateIcon();
  }

  updateIcon() {
    if (!this.themeIcon) return;
    if (this.currentTheme === "light") {
      this.themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="2"/>
        <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/>
      `;
    } else {
      this.themeIcon.innerHTML = `<path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>`;
    }
  }
}
