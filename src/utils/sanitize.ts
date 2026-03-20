const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

export const stripHtmlTags = (value: string): string =>
  value.replace(/<[^>]*>/g, "");

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"'/`=]/g, (char) => HTML_ENTITIES[char] ?? char);

export const sanitizeTextInput = (value: string): string => {
  const withoutTags = stripHtmlTags(value);
  return escapeHtml(withoutTags).trim();
};

export const sanitizeUri = (value: string): string => {
  const cleaned = value.trim().replace(/[\r\n\t]/g, "");
  return cleaned;
};
