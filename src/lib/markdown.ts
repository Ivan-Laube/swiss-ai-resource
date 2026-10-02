import { Lexer, marked, type Tokens } from "marked";
import sanitizeHtml from "sanitize-html";

import type { Locale } from "@/i18n/config";
import { DOWNLOAD_LINK_PREFIX, downloadHref } from "@/templates/links";

import { listHeadingAnchors, splitHeadingAnchor } from "./heading-anchors";
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
 *
 * h2/h3 headings with an explicit `{#anchor}` marker use that anchor as id
 * (see `./heading-anchors`); the others get an id slugified from their text.
 * Throws on a malformed, misplaced, duplicate or reserved anchor.
 *
 * Links to `download:<template id>` become the Word download in `locale`
 * (DE fallback); an unknown template id throws.
 */
export function renderMarkdown(
  markdown: string,
  options: { locale?: Locale } = {},
): RenderMarkdownResult {
  const locale = options.locale ?? "de";
  const headings: MarkdownHeading[] = [];
  const explicit = listHeadingAnchors(markdown).map((a) => a.anchor);
  const reservedHit = explicit.find((id) => RESERVED_HEADING_IDS.includes(id));
  if (reservedHit) {
    throw new Error(
      `Heading anchor {#${reservedHit}} is reserved for the page shell; choose another`,
    );
  }
  // Generated ids must not take an id that a later heading claims explicitly.
  const slugify = createHeadingSlugger([...RESERVED_HEADING_IDS, ...explicit]);

  const renderer = new marked.Renderer();
  renderer.heading = function heading({ tokens, depth, text: raw }: Tokens.Heading) {
    const { text: source, anchor } = splitHeadingAnchor(raw);
    const text = this.parser.parseInline(
      anchor === null ? tokens : Lexer.lexInline(source),
    );
    const plain = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
    if (depth === 2 || depth === 3) {
      const id = anchor ?? slugify(plain);
      headings.push({ level: depth, text: plain, id });
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  const dirty = marked.parse(markdown, {
    walkTokens(token) {
      if (token.type === "link" && token.href.startsWith(DOWNLOAD_LINK_PREFIX)) {
        token.href = downloadHref(token.href.slice(DOWNLOAD_LINK_PREFIX.length), locale);
      }
    },
    async: false,
    renderer,
  }) as string;

  return {
    html: sanitizeHtml(dirty, SANITIZE_OPTIONS),
    headings,
  };
}
