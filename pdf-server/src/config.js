export const PORT = process.env.PORT || 3000;

export const MAX_BROWSERS = Number.parseInt(process.env.MAX_BROWSERS || "3", 10);

export const ALLOWED_ORIGINS = [
  "chrome-extension://*",
  "http://localhost:*",
  "https://localhost:*",
  "https://md-to-perfect-pdf.onrender.com",
  "https://kardam-codes.github.io",
  process.env.PRODUCTION_DOMAIN
].filter(Boolean);

export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 20
};
