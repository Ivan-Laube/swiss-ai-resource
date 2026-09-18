import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Tags/attrs produced by marked for our compliance Markdown
 * (headings, lists, links, tables, fenced code). Scripts, event handlers,
 * and non-http(s)/mailto URLs are stripped.
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "h1",
    "h2",
    "img",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title"],
    code: ["class"],
    th: ["align"],
    td: ["align"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
};

/**
 * Render Markdown to HTML, then sanitize before `dangerouslySetInnerHTML`.
 * Required because the translate workflow auto-commits LLM drafts to
 * `content/{en,fr,it}` and marked passes raw HTML through.
 */
export function renderMarkdown(markdown: string): string {
  const dirty = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(dirty, SANITIZE_OPTIONS);
}
