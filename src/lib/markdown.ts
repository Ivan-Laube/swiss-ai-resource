import { marked, type Tokens } from "marked";
import sanitizeHtml from "sanitize-html";

import { createHeadingSlugger } from "./slugify-heading";

/** Heading extracted for the table of contents (h2 / h3). */
export type MarkdownHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type RenderMarkdownResult = {
  html: string;
  headings: MarkdownHeading[];
};

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
    h1: ["id"],
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    h5: ["id"],
    h6: ["id"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
};

/** Ids already used by the page shell; a heading must never reuse them. */
const RESERVED_HEADING_IDS = [
  "main", // skip-link target (<main id="main">)
  "sources-heading",
  "toc-heading",
  "related-tools-heading",
  "caveats-heading",
  "related-heading",
];

/**
 * Render Markdown to sanitized HTML and collect heading ids for the TOC.
 * Required because the translate workflow auto-commits LLM drafts to
 * `content/{en,fr,it}` and marked passes raw HTML through.
 */
export function renderMarkdown(markdown: string): RenderMarkdownResult {
  const headings: MarkdownHeading[] = [];
  const slugify = createHeadingSlugger(RESERVED_HEADING_IDS);

  const renderer = new marked.Renderer();
  renderer.heading = function heading({ tokens, depth }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    const plain = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
    if (depth === 2 || depth === 3) {
      const id = slugify(plain);
      headings.push({ level: depth, text: plain, id });
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  const dirty = marked.parse(markdown, {
    async: false,
    renderer,
  }) as string;

  return {
    html: sanitizeHtml(dirty, SANITIZE_OPTIONS),
    headings,
  };
}
