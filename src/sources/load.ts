import fs from "node:fs";
import path from "node:path";

import { listPublishableContentSlugs } from "@/content";
import { getVendors } from "@/vendors/load";

import {
  parseSourcesFile,
  type Source,
} from "./schema";

const SOURCES_PATH = path.join(process.cwd(), "data", "sources.json");

function formatZodError(
  error: unknown,
  context: string,
  rawSources?: unknown,
): Error {
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
        let label = field;
        if (
          Array.isArray(rawSources) &&
          issue.path.length >= 2 &&
          issue.path[0] === "sources" &&
          typeof issue.path[1] === "number"
        ) {
          const index = issue.path[1];
          const entry = rawSources[index];
          const id =
            entry &&
            typeof entry === "object" &&
            entry !== null &&
            "id" in entry &&
            typeof (entry as { id: unknown }).id === "string"
              ? (entry as { id: string }).id
              : "?";
          label = `sources[${index}] id=${id} ${field}`;
        }
        return `  - ${label}: ${issue.message}`;
      })
      .join("\n");
    return new Error(`Invalid sources data (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid sources data (${context}): ${error.message}`);
  }

  return new Error(`Invalid sources data (${context})`);
}

function assertUniqueIds(sources: Source[]): void {
  const seen = new Map<string, number>();

  for (let index = 0; index < sources.length; index += 1) {
    const { id } = sources[index];
    const previous = seen.get(id);
    if (previous !== undefined) {
      throw new Error(
        `Duplicate source id "${id}" at index ${index} (first seen at index ${previous})`,
      );
    }
    seen.set(id, index);
  }
}

function assertVendorIds(sources: Source[]): void {
  const vendorIds = new Set(getVendors().map((vendor) => vendor.id));

  for (let index = 0; index < sources.length; index += 1) {
    const { id, vendor_id: vendorId } = sources[index];
    if (vendorId === null) {
      continue;
    }
    if (!vendorIds.has(vendorId)) {
      throw new Error(
        `Source "${id}" at index ${index} references unknown vendor_id "${vendorId}"`,
      );
    }
  }
}

function assertDependentPages(sources: Source[]): void {
  const publishable = new Set(listPublishableContentSlugs("de"));

  for (let index = 0; index < sources.length; index += 1) {
    const { id, dependent_pages: dependentPages } = sources[index];
    for (const slug of dependentPages) {
      if (!publishable.has(slug)) {
        throw new Error(
          `Source "${id}" at index ${index} dependent_pages references unknown DE content slug "${slug}"`,
        );
      }
    }
  }
}

function assertFallbackUrls(sources: Source[]): void {
  for (let index = 0; index < sources.length; index += 1) {
    const { id, url, fallback_urls: fallbackUrls } = sources[index];
    const seen = new Set<string>();
    for (let fIndex = 0; fIndex < fallbackUrls.length; fIndex += 1) {
      const fallback = fallbackUrls[fIndex];
      if (fallback === url) {
        throw new Error(
          `Source "${id}" at index ${index} fallback_urls[${fIndex}] duplicates primary url`,
        );
      }
      if (seen.has(fallback)) {
        throw new Error(
          `Source "${id}" at index ${index} has duplicate fallback_urls entry "${fallback}"`,
        );
      }
      seen.add(fallback);
    }
  }
}

/** Load and validate data/sources.json. Throws on invalid shape, duplicate ids, bad vendor_id, or unknown dependent_pages. */
export function getSources(): Source[] {
  if (!fs.existsSync(SOURCES_PATH)) {
    throw new Error(`Sources file not found: ${SOURCES_PATH}`);
  }

  const raw = fs.readFileSync(SOURCES_PATH, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${SOURCES_PATH}: ${message}`);
  }

  let sources: Source[];
  try {
    const file = parseSourcesFile(data);
    sources = file.sources;
  } catch (error) {
    const rawSources =
      data &&
      typeof data === "object" &&
      data !== null &&
      "sources" in data
        ? (data as { sources: unknown }).sources
        : undefined;
    throw formatZodError(error, SOURCES_PATH, rawSources);
  }

  assertUniqueIds(sources);
  assertVendorIds(sources);
  assertDependentPages(sources);
  assertFallbackUrls(sources);
  return sources;
}

/** Look up a single source by id. Returns undefined if not found. */
export function getSourceById(id: string): Source | undefined {
  return getSources().find((source) => source.id === id);
}

/** Validate data/sources.json. Returns source count. */
export function validateSources(): number {
  return getSources().length;
}
