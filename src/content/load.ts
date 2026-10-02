import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { locales, type Locale } from "@/i18n/config";
import { renderMarkdown } from "@/lib/markdown";

import { LEGAL_SLUGS } from "./legal";
import {
  parseContentFrontmatter,
  type ContentFrontmatter,
} from "./schema";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type ContentPage = {
  locale: Locale;
  slug: string;
  path: string;
  frontmatter: ContentFrontmatter;
  body: string;
};

function localeDir(locale: Locale): string {
  return path.join(CONTENT_ROOT, locale);
}

function pageFilePath(locale: Locale, slug: string): string {
  return path.join(localeDir(locale), `${slug}.md`);
}

function formatZodError(error: unknown, filePath: string): Error {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    const issues = (
      error as {
        issues: Array<{ path: PropertyKey[]; message: string }>;
      }
    ).issues;
    const details = issues
      .map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  - ${field}: ${issue.message}`;
      })
      .join("\n");
    return new Error(`Invalid frontmatter in ${filePath}:\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid frontmatter in ${filePath}: ${error.message}`);
  }

  return new Error(`Invalid frontmatter in ${filePath}`);
}

/** List markdown slugs for a locale (filename stem, excluding .gitkeep). */
export function listContentSlugs(locale: Locale): string[] {
  const dir = localeDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.slice(0, -".md".length))
    .sort();
}

/** True for public pages; `_`-prefixed files are internal fixtures only. */
export function isPublishableSlug(slug: string): boolean {
  return !slug.startsWith("_");
}

/** List publishable markdown slugs (excludes `_fixture-*` and similar). */
export function listPublishableContentSlugs(locale: Locale): string[] {
  return listContentSlugs(locale).filter(isPublishableSlug);
}

/** Locales that have a publishable page for the given slug (for hreflang). */
export function localesWithSlug(slug: string): Locale[] {
  if (!isPublishableSlug(slug)) {
    return [];
  }

  return locales.filter((locale) =>
    listPublishableContentSlugs(locale).includes(slug),
  );
}

/** Parse and validate a single content page. Throws on invalid frontmatter. */
export function getContentPage(locale: Locale, slug: string): ContentPage {
  const filePath = pageFilePath(locale, slug);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Content page not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  let frontmatter: ContentFrontmatter;
  try {
    frontmatter = parseContentFrontmatter(data, locale);
  } catch (error) {
    throw formatZodError(error, filePath);
  }

  return {
    locale,
    slug,
    path: filePath,
    frontmatter,
    body: content.replace(/^\uFEFF?/, "").replace(/^\n+/, ""),
  };
}

/** Load all content pages, optionally filtered by locale. */
export function getAllContentPages(locale?: Locale): ContentPage[] {
  const targetLocales: Locale[] = locale ? [locale] : [...locales];
  const pages: ContentPage[] = [];

  for (const loc of targetLocales) {
    for (const slug of listContentSlugs(loc)) {
      pages.push(getContentPage(loc, slug));
    }
  }

  return pages;
}

/** Publishable guide pages for a locale (excludes legal pages and `_` fixtures). */
export function listGuidePages(locale: Locale): ContentPage[] {
  return getAllContentPages(locale).filter(
    (page) =>
      isPublishableSlug(page.slug) && !LEGAL_SLUGS.has(page.slug),
  );
}

/**
 * Guide pages must declare `category`. The same slug must share one category
 * across all locales that publish it. Legal pages and `_` fixtures omit it.
 */
function validateGuideCategories(): void {
  const bySlug = new Map<string, { locale: Locale; category: string | undefined }[]>();

  for (const locale of locales) {
    for (const page of listGuidePages(locale)) {
      const entries = bySlug.get(page.slug) ?? [];
      entries.push({ locale, category: page.frontmatter.category });
      bySlug.set(page.slug, entries);

      if (page.frontmatter.category == null) {
        throw new Error(
          `Guide page content/${locale}/${page.slug}.md must set frontmatter.category`,
        );
      }
    }
  }

  for (const [slug, entries] of bySlug) {
    const categories = new Set(
      entries.map((entry) => entry.category).filter((value) => value != null),
    );
    if (categories.size > 1) {
      const detail = entries
        .map((entry) => `${entry.locale}=${entry.category ?? "(missing)"}`)
        .join(", ");
      throw new Error(
        `Guide slug "${slug}" has inconsistent category across locales: ${detail}`,
      );
    }
  }
}

/** Validate every markdown file under content/{locale}/. Returns page count. */
export function validateAllContent(): number {
  let count = 0;

  for (const locale of locales) {
    for (const slug of listContentSlugs(locale)) {
      const page = getContentPage(locale, slug);
      // Rendering validates heading anchors ({#id}) and download: links as the build would.
      try {
        renderMarkdown(page.body, { locale: page.locale });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${page.path}: ${message}`);
      }
      count += 1;
    }
  }

  validateGuideCategories();

  return count;
}
