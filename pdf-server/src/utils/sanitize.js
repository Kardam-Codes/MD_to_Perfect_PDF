export const safeString = (value, fallback) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

export const safeBoolean = (value, fallback) =>
  typeof value === "boolean" ? value : fallback;

export const sanitizeFileName = (name) => {
  const base = safeString(name, "chatgpt-export.pdf")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
};

export const sanitizeHTML = (html) =>
  html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .substring(0, 1000000);

export function normalizeOptions(options = {}) {
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

  const validThemes = ["dark", "light"];
  const validPageSizes = ["A4", "Letter", "Legal"];
  const validOrientations = ["portrait", "landscape"];

  return {
    finalTheme: validThemes.includes(theme) ? theme : "dark",
    finalPageSize: validPageSizes.includes(pageSize) ? pageSize : "A4",
    finalOrientation: validOrientations.includes(orientation) ? orientation : "portrait",
    marginPreset,
    fontChoice,
    headerEnabled,
    footerEnabled,
    includeDateTime,
    pageBreaks,
    fileName
  };
}
