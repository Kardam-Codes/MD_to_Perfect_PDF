import puppeteer from "puppeteer";

export class BrowserPool {
  constructor(maxSize = 3) {
    this.maxSize = maxSize;
    this.pool = [];
    this.activeCount = 0;
  }

  async getBrowser() {
    if (this.pool.length > 0) {
      this.activeCount++;
      return this.pool.pop();
    }

    if (this.activeCount < this.maxSize) {
      this.activeCount++;
      return this.createBrowser();
    }

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.pool.length > 0) {
          clearInterval(checkInterval);
          this.activeCount++;
          resolve(this.pool.pop());
        }
      }, 100);
    });
  }

  async createBrowser() {
    return puppeteer.launch({
      headless: "new",
      executablePath: puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=medium",
        "--disable-extensions",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-backgrounding-occluded-windows"
      ]
    });
  }

  async releaseBrowser(browser) {
    try {
      if (browser && browser.process() && !browser.process().killed) {
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close().catch(() => {})));

        if (this.pool.length < this.maxSize) {
          this.pool.push(browser);
        } else {
          await browser.close();
        }
      } else if (browser) {
        await browser.close().catch(() => {});
      }
    } catch (error) {
      console.error("Error releasing browser:", error);
      if (browser) {
        await browser.close().catch(() => {});
      }
    } finally {
      this.activeCount--;
    }
  }

  async closeAll() {
    await Promise.all(this.pool.map((browser) => browser.close().catch(() => {})));
    this.pool = [];
    this.activeCount = 0;
  }
}
