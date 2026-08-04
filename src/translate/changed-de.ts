import { execFileSync } from "node:child_process";
import path from "node:path";

import matter from "gray-matter";

import { isPublishableSlug, listPublishableContentSlugs } from "@/content";

/** Canonical prose fields that require EN/FR/IT regeneration when they change. */
export type CanonicalContent = {
  title: string;
  description: string;
  body: string;
};

const DE_CONTENT_PREFIX = "content/de/";

function normalizeBody(body: string): string {
  return body.replace(/^\uFEFF?/, "").replace(/^\n+/, "").trimEnd();
}

/** Extract title/description/body from raw Markdown (no Zod — git history may be older). */
export function extractCanonicalContent(rawMarkdown: string): CanonicalContent {
  const { data, content } = matter(rawMarkdown);
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  return {
    title,
    description,
    body: normalizeBody(content),
  };
}

export function canonicalContentEquals(
  a: CanonicalContent,
  b: CanonicalContent,
): boolean {
  return (
    a.title === b.title &&
    a.description === b.description &&
    a.body === b.body
  );
}

function git(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf8",
    cwd: process.cwd(),
    maxBuffer: 16 * 1024 * 1024,
  });
}

function gitExists(ref: string): boolean {
  try {
    git(["rev-parse", "--verify", `${ref}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

/** Null object SHA used by GitHub for new-branch pushes. */
export function isNullGitSha(sha: string | undefined | null): boolean {
  return !sha || /^0+$/.test(sha);
}

function slugFromDePath(repoRelativePath: string): string | null {
  const normalized = repoRelativePath.split(path.sep).join("/");
  if (!normalized.startsWith(DE_CONTENT_PREFIX) || !normalized.endsWith(".md")) {
    return null;
  }
  const name = normalized.slice(DE_CONTENT_PREFIX.length);
  if (name.includes("/")) {
    return null;
  }
  return name.slice(0, -".md".length);
}

function readBlob(ref: string, repoRelativePath: string): string | null {
  try {
    return git(["show", `${ref}:${repoRelativePath}`]);
  } catch {
    return null;
  }
}

/**
 * List publishable DE slugs whose title/description/body changed between two commits.
 * New pages count as changed. Deleted pages are omitted (no auto-delete of translations).
 */
export function listChangedCanonicalDeSlugs(
  beforeRef: string,
  afterRef: string,
): string[] {
  if (isNullGitSha(beforeRef) || !gitExists(beforeRef)) {
    // No usable before commit: treat every publishable DE page at after as changed.
    return listPublishableContentSlugs("de");
  }

  if (!gitExists(afterRef)) {
    throw new Error(`Git ref not found: ${afterRef}`);
  }

  const diffOut = git([
    "diff",
    "--name-only",
    "--diff-filter=ACMR",
    beforeRef,
    afterRef,
    "--",
    DE_CONTENT_PREFIX,
  ]);

  const paths = [
    ...new Set(
      diffOut
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  ].sort();

  const changed: string[] = [];

  for (const filePath of paths) {
    const slug = slugFromDePath(filePath);
    if (!slug || !isPublishableSlug(slug)) {
      continue;
    }

    const afterRaw = readBlob(afterRef, filePath);
    if (afterRaw == null) {
      // Deleted or missing at after — skip.
      continue;
    }

    const beforeRaw = readBlob(beforeRef, filePath);
    const afterCanon = extractCanonicalContent(afterRaw);

    if (beforeRaw == null) {
      changed.push(slug);
      continue;
    }

    const beforeCanon = extractCanonicalContent(beforeRaw);
    if (!canonicalContentEquals(beforeCanon, afterCanon)) {
      changed.push(slug);
    }
  }

  return changed;
}

export type ResolveChangedDeSlugsOptions = {
  /** Force these slugs (workflow_dispatch). */
  slugs?: string[];
  /** Force every publishable DE slug. */
  all?: boolean;
  beforeRef?: string;
  afterRef?: string;
};

/**
 * Resolve which DE slugs need translation regeneration.
 * Prefer explicit --slug/--all; otherwise diff the git range.
 */
export function resolveChangedDeSlugs(
  options: ResolveChangedDeSlugsOptions = {},
): string[] {
  if (options.all) {
    return listPublishableContentSlugs("de");
  }

  if (options.slugs && options.slugs.length > 0) {
    const unique = [...new Set(options.slugs)];
    for (const slug of unique) {
      if (!isPublishableSlug(slug)) {
        throw new Error(`Refusing fixture slug: ${slug}`);
      }
      if (!listPublishableContentSlugs("de").includes(slug)) {
        throw new Error(`Unknown publishable DE slug: ${slug}`);
      }
    }
    return unique;
  }

  const afterRef = options.afterRef ?? "HEAD";
  const beforeRef = options.beforeRef ?? "HEAD~1";
  return listChangedCanonicalDeSlugs(beforeRef, afterRef);
}
