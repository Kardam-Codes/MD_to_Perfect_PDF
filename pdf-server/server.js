import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;

// Browser pooling for performance
class BrowserPool {
  constructor(maxSize = 3) {
    this.maxSize = maxSize;
    this.pool = [];
    this.activeCount = 0;
  }

  async getBrowser() {
    // Return existing browser if available
    if (this.pool.length > 0) {
      this.activeCount++;
      return this.pool.pop();
    }

    // Create new browser if under limit
    if (this.activeCount < this.maxSize) {
      this.activeCount++;
      return await this.createBrowser();
    }

    // Wait for a browser to become available
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
    const executablePath = puppeteer.executablePath();
    
    return await puppeteer.launch({
      headless: "new",
      executablePath,
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
      // Check if browser is still connected
      if (browser && browser.process() && !browser.process().killed) {
        // Clean up any existing pages
        const pages = await browser.pages();
        await Promise.all(pages.map(page => page.close().catch(() => {})));
        
        // Return to pool if not full
        if (this.pool.length < this.maxSize) {
          this.pool.push(browser);
        } else {
          await browser.close();
        }
      } else {
        await browser.close().catch(() => {});
      }
    } catch (error) {
      console.error('Error releasing browser:', error);
      await browser.close().catch(() => {});
    } finally {
      this.activeCount--;
    }
  }

  async closeAll() {
    await Promise.all([
      ...this.pool.map(browser => browser.close().catch(() => {}))
    ]);
    this.pool = [];
    this.activeCount = 0;
  }
}

// Create global browser pool
const browserPool = new BrowserPool(process.env.MAX_BROWSERS ? parseInt(process.env.MAX_BROWSERS) : 3);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down browser pool...');
  await browserPool.closeAll();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down browser pool...');
  await browserPool.closeAll();
  process.exit(0);
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// Restrict CORS to known origins
const allowedOrigins = [
  'chrome-extension://*', // Allow any Chrome extension
  'http://localhost:*',
  'https://localhost:*',
  'https://md-to-perfect-pdf.com',
  'https://kardam-codes.github.io',
  process.env.PRODUCTION_DOMAIN
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed.endsWith('*')) {
        return origin.startsWith(allowed.slice(0, -1));
      }
      return origin === allowed;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for localhost in development
  skip: (req) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1';
    return isDevelopment && isLocalhost;
  }
});

app.use('/export', limiter);
app.use(express.json({ limit: "50mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

/* =========================================================
   HEALTH CHECK
 ========================================================= */

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "md-to-perfect-pdf",
    version: "1.1.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    browserPool: {
      active: browserPool.activeCount,
      available: browserPool.pool.length,
      maxSize: browserPool.maxSize
    },
    message: "Use POST /export to generate PDFs"
  });
});

/* =========================================================
   DETAILED HEALTH ENDPOINT
 ========================================================= */

app.get("/health", (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100
    },
    browserPool: {
      active: browserPool.activeCount,
      available: browserPool.pool.length,
      maxSize: browserPool.maxSize,
      utilization: Math.round((browserPool.activeCount / browserPool.maxSize) * 100)
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  });
});

/* =========================================================
   PDF EXPORT ENDPOINT
========================================================= */

app.post("/export", async (req, res) => {
  const startTime = Date.now();
  let browser = null;
  let page = null;

  try {
    const { html, options = {} } = req.body;

    if (!html) {
      return res.status(400).json({ error: "No HTML provided" });
    }

    // Input validation and sanitization
    const safeString = (value, fallback) =>
      typeof value === "string" && value.trim() ? value.trim() : fallback;

    const safeBoolean = (value, fallback) =>
      typeof value === "boolean" ? value : fallback;

    const sanitizeFileName = (name) => {
      const base = safeString(name, "chatgpt-export.pdf")
        .replace(/[\\/:*?"<>|]+/g, "-")
        .replace(/\s+/g, " ")
        .trim();
      return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
    };

    const sanitizeHTML = (html) => {
      // Basic HTML sanitization - remove script tags and dangerous attributes
      return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
        .substring(0, 1000000); // Limit to 1MB
    };

    // Parse and validate options
    const theme = safeString(options.theme, "dark");
    const pageSize = safeString(options.pageSize, "A4");
    const orientation = safeString(options.orientation, "portrait");
    const marginPreset = safeString(options.margin, "normal");
    const fontChoice = safeString(options.font, "Inter");
    const headerEnabled = safeBoolean(options.header, false);
    const footerEnabled = safeBoolean(options.footer, true);
    const includeDateTime = safeBoolean(options.includeDateTime, false);
    const pageBreaks = safeString(options.pageBreaks, "auto");
    const fileName = sanitizeFileName(options.fileName);

    // Validate theme
    const validThemes = ['dark', 'light'];
    const finalTheme = validThemes.includes(theme) ? theme : 'dark';

    // Validate page size
    const validPageSizes = ['A4', 'Letter', 'Legal'];
    const finalPageSize = validPageSizes.includes(pageSize) ? pageSize : 'A4';

    // Validate orientation
    const validOrientations = ['portrait', 'landscape'];
    const finalOrientation = validOrientations.includes(orientation) ? orientation : 'portrait';

    // Sanitize HTML input
    const sanitizedHTML = sanitizeHTML(html);

    // Get browser from pool
    browser = await browserPool.getBrowser();
    page = await browser.newPage();

    // Set timeout for page operations
    page.setDefaultNavigationTimeout(15000);

    /* -----------------------------------------------------
       BASE DOCUMENT TEMPLATE
    ----------------------------------------------------- */

const background = finalTheme === "light" ? "#ffffff" : "#020617";
    const textColor = finalTheme === "light" ? "#020617" : "#e5e7eb";
    const borderColor = finalTheme === "light" ? "#cbd5e1" : "#1e293b";
    const fontFamily = (() => {
      switch (fontChoice.toLowerCase()) {
        case "roboto":
          return `"Roboto", "Segoe UI", Arial, sans-serif`;
        case "serif":
        case "times":
          return `"Times New Roman", Times, serif`;
        default:
          return `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
      }
    })();

    const marginMap = {
      compact: { top: "18mm", bottom: "18mm", left: "12mm", right: "12mm" },
      normal: { top: "30mm", bottom: "26mm", left: "18mm", right: "18mm" },
      spacious: { top: "36mm", bottom: "30mm", left: "22mm", right: "22mm" }
    };

    const pdfMargins = marginMap[marginPreset] || marginMap.normal;

let htmlToRender = sanitizedHTML;
    if (pageBreaks === "none") {
      htmlToRender = htmlToRender.replace(/<div class="page-break"><\/div>/g, "");
    }

    const documentHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    @page {
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background: ${background};
      color: ${textColor};
      font-family: ${fontFamily};
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* -------- PAGE WRAPPER -------- */
    .pdf-root {
      width: 100%;
      box-sizing: border-box;
    }

    /* -------- PAGE BREAK -------- */
    .page-break {
      page-break-before: always;
    }

    /* -------- CODE BLOCK -------- */
    pre {
      background: ${theme === "light" ? "#f8fafc" : "#0b1220"};
      color: inherit;
      border: 1px solid ${borderColor};
      border-radius: 10px;
      padding: 12px 14px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.45;
      page-break-inside: avoid;
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", monospace;
    }

    /* -------- HEADINGS -------- */
    h1, h2, h3 {
      page-break-after: avoid;
    }

    /* -------- LISTS -------- */
    ul, ol {
      padding-left: 22px;
    }

    li {
      margin: 4px 0;
    }

    /* -------- TABLES -------- */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }

    th, td {
      border: 1px solid ${borderColor};
      padding: 6px 8px;
      text-align: left;
    }

    th {
      background: ${theme === "light" ? "#eef2ff" : "#020617"};
    }
  </style>
</head>

<body>
  <div class="pdf-root">
    ${htmlToRender}
  </div>
</body>
</html>
    `;

    page.setDefaultNavigationTimeout(15000);
    await page.setContent(documentHTML, {
      waitUntil: "domcontentloaded",
      timeout: 15000
    });

    /* -----------------------------------------------------
       GENERATE PDF
    ----------------------------------------------------- */

    const displayHeaderFooter = headerEnabled || footerEnabled || includeDateTime;
    const nowString = includeDateTime ? new Date().toLocaleString() : "";
    const headerTemplate = headerEnabled || includeDateTime ? `
        <div style="
          font-size:9px;
          width:100%;
          text-align:center;
          color:${textColor};
          padding-top:6px;
        ">
          ${includeDateTime ? nowString : ""}
        </div>
      ` : "<div></div>";

    const footerTemplate = footerEnabled ? `
        <div style="
          font-size:9px;
          width:100%;
          display:flex;
          justify-content:space-between;
          padding:0 18mm;
          color:${textColor};
        ">
          <span>Generated by MD -> Perfect PDF</span>
          <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>
      ` : "<div></div>";

const pdfBuffer = await page.pdf({
      format: finalPageSize,
      landscape: finalOrientation === "landscape",
      printBackground: true,
      displayHeaderFooter,
      headerTemplate,
      footerTemplate,
      margin: pdfMargins
    });

    // Clean up page and return browser to pool
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

    // Clean up resources
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

/* =========================================================
   START SERVER
========================================================= */

// Export app for testing
export { app };

// Start server only if not being tested
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`📄 PDF server running at http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔒 Rate limiting: 20 requests per 15 minutes`);
    console.log(`🌐 CORS: Restricted to allowed origins`);
  });
}
