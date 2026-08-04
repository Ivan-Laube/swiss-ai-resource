import path from "node:path";

import matter from "gray-matter";

import {
  parseContentFrontmatter,
  serializeContentMarkdown,
  writeContentPage,
  type ContentFrontmatter,
  type ContentPage,
} from "@/content";
import { stripCodeFence } from "@/lib/llm-output";

import type { TranslateTargetLocale } from "./prompt";

export type LlmTranslationParts = {
  title: string;
  description: string;
  body: string;
};

/** Parse LLM markdown that should contain only title/description frontmatter + body. */
export function parseLlmTranslation(raw: string): LlmTranslationParts {
  const cleaned = stripCodeFence(raw);
  const { data, content } = matter(cleaned);

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const body = content.replace(/^\uFEFF?/, "").replace(/^\n+/, "").trimEnd();

  if (!title) {
    throw new Error("LLM output missing frontmatter title");
  }
  if (!description) {
    throw new Error("LLM output missing frontmatter description");
  }
  if (!body) {
    throw new Error("LLM output missing body");
  }

  return { title, description, body };
}

/** Build the full Markdown file for a draft translation. */
export function assembleTranslationMarkdown(
  dePage: ContentPage,
  parts: LlmTranslationParts,
): string {
  const frontmatter: ContentFrontmatter = {
    title: parts.title,
    description: parts.description,
    last_verified: dePage.frontmatter.last_verified,
    volatility: dePage.frontmatter.volatility,
    translation_status: "draft",
    reviewed_by: null,
    review_date: null,
    review_scope: null,
    sources: dePage.frontmatter.sources,
  };

  // Validate shape before write (locale checked by caller via getContentPage).
  parseContentFrontmatter(frontmatter, "en");

  return serializeContentMarkdown(frontmatter, parts.body);
}

export function translationOutputPath(
  locale: TranslateTargetLocale,
  slug: string,
): string {
  return path.join(process.cwd(), "content", locale, `${slug}.md`);
}

/**
 * Write draft translation Markdown and re-parse via the content loader.
 * Returns the absolute output path.
 */
export function writeTranslation(
  dePage: ContentPage,
  locale: TranslateTargetLocale,
  parts: LlmTranslationParts,
): string {
  const frontmatter: ContentFrontmatter = {
    title: parts.title,
    description: parts.description,
    last_verified: dePage.frontmatter.last_verified,
    volatility: dePage.frontmatter.volatility,
    translation_status: "draft",
    reviewed_by: null,
    review_date: null,
    review_scope: null,
    sources: dePage.frontmatter.sources,
  };

  return writeContentPage(locale, dePage.slug, frontmatter, parts.body);
}
