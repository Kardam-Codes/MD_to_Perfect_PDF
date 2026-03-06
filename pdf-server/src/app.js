import express from "express";
import { BrowserPool } from "./browserPool.js";
import { MAX_BROWSERS } from "./config.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerExportRoute } from "./routes/export.js";

export function createApp() {
  const app = express();
  const browserPool = new BrowserPool(MAX_BROWSERS);

  applySecurityMiddleware(app);
  registerHealthRoutes(app, browserPool);
  registerExportRoute(app, browserPool);

  return { app, browserPool };
}
