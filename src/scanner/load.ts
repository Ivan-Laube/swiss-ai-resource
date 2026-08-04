import fs from "node:fs";
import path from "node:path";

import { listPublishableContentSlugs } from "@/content";

import {
  parseScannerChecks,
  type LocalizedString,
  type ScannerCheck,
  type ScannerChecksFile,
} from "./schema";

const REQUIRED_LOCALES = ["en", "fr", "it"] as const;

export const SCANNER_CHECKS_PATH = path.join(
  process.cwd(),
  "data",
  "scanner-checks.json",
);

function formatZodError(error: unknown, context: string): Error {
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
    return new Error(`Invalid scanner checks (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid scanner checks (${context}): ${error.message}`);
  }

  return new Error(`Invalid scanner checks (${context})`);
}

function missingLocales(value: LocalizedString): string[] {
  return REQUIRED_LOCALES.filter((locale) => {
    const text = value[locale];
    return typeof text !== "string" || text.trim().length === 0;
  });
}

function assertLocalizedComplete(
  value: LocalizedString,
  filePath: string,
  pathLabel: string,
): void {
  const missing = missingLocales(value);
  if (missing.length > 0) {
    throw new Error(
      `Invalid scanner checks (${filePath}): ${pathLabel} missing locale(s): ${missing.join(", ")}`,
    );
  }
}

function assertCheckIdsUnique(file: ScannerChecksFile, filePath: string): void {
  const seen = new Set<string>();
  for (const check of file.checks) {
    if (seen.has(check.id)) {
      throw new Error(
        `Invalid scanner checks (${filePath}): duplicate check id "${check.id}"`,
      );
    }
    seen.add(check.id);
  }
}

function assertNestedIdsUnique(check: ScannerCheck, filePath: string): void {
  if (
    check.method === "script_signature" ||
    check.method === "static_scan_flag"
  ) {
    const seen = new Set<string>();
    for (const signature of check.signatures) {
      if (seen.has(signature.id)) {
        throw new Error(
          `Invalid scanner checks (${filePath}): check "${check.id}" has duplicate signature id "${signature.id}"`,
        );
      }
      seen.add(signature.id);
    }
  }

  if (check.method === "response_header") {
    const seen = new Set<string>();
    for (const header of check.headers) {
      if (seen.has(header.id)) {
        throw new Error(
          `Invalid scanner checks (${filePath}): check "${check.id}" has duplicate header id "${header.id}"`,
        );
      }
      seen.add(header.id);
    }
  }
}

function assertRelatedPages(file: ScannerChecksFile, filePath: string): void {
  const publishable = new Set(listPublishableContentSlugs("de"));

  for (const check of file.checks) {
    const slug = check.related_page;
    if (slug !== null && !publishable.has(slug)) {
      throw new Error(
        `Invalid scanner checks (${filePath}): check "${check.id}" related_page references unknown DE content slug "${slug}"`,
      );
    }
  }
}

/** Launch requires DE + EN + FR + IT on every user-facing LocalizedString. */
function assertFullLocales(file: ScannerChecksFile, filePath: string): void {
  for (const check of file.checks) {
    const base = `check id=${check.id}`;
    assertLocalizedComplete(check.title, filePath, `${base}.title`);
    assertLocalizedComplete(check.description, filePath, `${base}.description`);
  }
}

/** Load and validate data/scanner-checks.json. Throws on invalid shape. */
export function getScannerChecks(): ScannerChecksFile {
  if (!fs.existsSync(SCANNER_CHECKS_PATH)) {
    throw new Error(`Scanner checks file not found: ${SCANNER_CHECKS_PATH}`);
  }

  const raw = fs.readFileSync(SCANNER_CHECKS_PATH, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${SCANNER_CHECKS_PATH}: ${message}`);
  }

  let file: ScannerChecksFile;
  try {
    file = parseScannerChecks(data);
  } catch (error) {
    throw formatZodError(error, SCANNER_CHECKS_PATH);
  }

  assertCheckIdsUnique(file, SCANNER_CHECKS_PATH);
  for (const check of file.checks) {
    assertNestedIdsUnique(check, SCANNER_CHECKS_PATH);
  }
  assertRelatedPages(file, SCANNER_CHECKS_PATH);
  assertFullLocales(file, SCANNER_CHECKS_PATH);

  return file;
}

/** Look up a single check by id. Throws if the file is invalid or id missing. */
export function getScannerCheckById(id: string): ScannerCheck {
  const check = getScannerChecks().checks.find((c) => c.id === id);
  if (!check) {
    throw new Error(`Scanner check not found: ${id}`);
  }
  return check;
}

/** Validate the scanner checks file. Returns the check count. */
export function validateScannerChecks(): number {
  return getScannerChecks().checks.length;
}
