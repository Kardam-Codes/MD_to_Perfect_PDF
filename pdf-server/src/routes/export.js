import {
  normalizeOptions,
  sanitizeHTML
} from "../utils/sanitize.js";
import {
  buildDocumentHTML,
  buildPdfOptions,
  getFontFamily,
  getPdfMargins
} from "../utils/pdfTemplate.js";

export function registerExportRoute(app, browserPool) {
  app.post("/export", async (req, res) => {
    const startTime = Date.now();
    let browser = null;
    let page = null;

    try {
      const { html, options = {} } = req.body;

      if (!html) {
        return res.status(400).json({ error: "No HTML provided" });
      }

      const {
        finalTheme,
        finalPageSize,
        finalOrientation,
        marginPreset,
        fontChoice,
        headerEnabled,
        footerEnabled,
        includeDateTime,
        pageBreaks,
        fileName
      } = normalizeOptions(options);

      const borderColor = finalTheme === "light" ? "#cbd5e1" : "#1e293b";
      const textColor = finalTheme === "light" ? "#020617" : "#e5e7eb";
      const fontFamily = getFontFamily(fontChoice);
      const pdfMargins = getPdfMargins(marginPreset);

      const sanitizedHTML = sanitizeHTML(html);
      const htmlToRender =
        pageBreaks === "none"
          ? sanitizedHTML.replace(/<div class="page-break"><\/div>/g, "")
          : sanitizedHTML;

      browser = await browserPool.getBrowser();
      page = await browser.newPage();
      page.setDefaultNavigationTimeout(15000);

      const documentHTML = buildDocumentHTML({
        htmlToRender,
        finalTheme,
        fontFamily,
        borderColor
      });

      await page.setContent(documentHTML, {
        waitUntil: "domcontentloaded",
        timeout: 15000
      });

      const pdfOptions = buildPdfOptions({
        finalPageSize,
        finalOrientation,
        headerEnabled,
        footerEnabled,
        includeDateTime,
        textColor,
        pdfMargins
      });

      const pdfBuffer = await page.pdf(pdfOptions);

      if (page) await page.close();
      await browserPool.releaseBrowser(browser);

      const duration = Date.now() - startTime;
      console.log(`PDF generated successfully in ${duration}ms`);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("X-Generation-Time", `${duration}ms`);
      res.send(pdfBuffer);
    } catch (err) {
      console.error("PDF Export Error:", err?.stack || err);

      if (page) await page.close().catch(() => {});
      if (browser) await browserPool.releaseBrowser(browser).catch(() => {});

      const duration = Date.now() - startTime;
      console.error(`PDF generation failed after ${duration}ms`);

      res.status(500).json({
        success: false,
        error: err?.message || "PDF generation failed",
        duration: `${duration}ms`
      });
    }
  });
}
