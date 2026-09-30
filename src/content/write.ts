import fs from "node:fs";
import path from "node:path";

import type { Locale } from "@/i18n/config";

import { getContentPage } from "./load";
import {
  parseContentFrontmatter,
  type ContentFrontmatter,
  type ContentSource,
} from "./schema";

function formatSourcesYaml(sources: ContentSource[]): string {
  return sources
    .map(
      (source) =>
        `  - title: ${JSON.stringify(source.title)}\n    url: ${JSON.stringify(source.url)}`,
    )
    .join("\n");
}

/** Serialize frontmatter + body to the repo Markdown shape. */
export function serializeContentMarkdown(
  frontmatter: ContentFrontmatter,
  body: string,
): string {
  const lines = [
    "---",
    `title: ${JSON.stringify(frontmatter.title)}`,
    `description: ${JSON.stringify(frontmatter.description)}`,
    `last_verified: ${JSON.stringify(frontmatter.last_verified)}`,
    `volatility: ${JSON.stringify(frontmatter.volatility)}`,
    `translation_status: ${JSON.stringify(frontmatter.translation_status)}`,
  ];

  if (frontmatter.category != null) {
    lines.push(`category: ${JSON.stringify(frontmatter.category)}`);
  }

  if (
    frontmatter.reviewed_by != null &&
    frontmatter.review_date != null &&
    frontmatter.review_scope != null
  ) {
    lines.push(
      `reviewed_by: ${JSON.stringify(frontmatter.reviewed_by)}`,
      `review_date: ${JSON.stringify(frontmatter.review_date)}`,
      `review_scope: ${JSON.stringify(frontmatter.review_scope)}`,
    );
  } else {
    lines.push(
      "reviewed_by: null",
      "review_date: null",
      "review_scope: null",
    );
  }

  lines.push(
    "sources:",
    formatSourcesYaml(frontmatter.sources),
    "---",
    "",
    body.replace(/\s+$/, ""),
    "",
  );

  return lines.join("\n");
}

export function contentPagePath(locale: Locale, slug: string): string {
  return path.join(process.cwd(), "content", locale, `${slug}.md`);
}

/**
 * Write a content page and re-parse via the loader so invalid output fails loud.
 * Returns the absolute output path.
 */
export function writeContentPage(
  locale: Locale,
  slug: string,
  frontmatter: ContentFrontmatter,
  body: string,
): string {
  parseContentFrontmatter(frontmatter, locale);

  const markdown = serializeContentMarkdown(frontmatter, body);
  const outPath = contentPagePath(locale, slug);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, markdown, "utf8");

  getContentPage(locale, slug);
  return outPath;
}
