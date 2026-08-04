import fs from "node:fs";
import path from "node:path";

import {
  parseGlossaryFile,
  type GlossaryTerm,
} from "./schema";

const GLOSSARY_PATH = path.join(process.cwd(), "data", "glossary.json");

function formatZodError(
  error: unknown,
  context: string,
  rawTerms?: unknown,
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
          Array.isArray(rawTerms) &&
          issue.path.length >= 2 &&
          issue.path[0] === "terms" &&
          typeof issue.path[1] === "number"
        ) {
          const index = issue.path[1];
          const entry = rawTerms[index];
          const id =
            entry &&
            typeof entry === "object" &&
            entry !== null &&
            "id" in entry &&
            typeof (entry as { id: unknown }).id === "string"
              ? (entry as { id: string }).id
              : "?";
          label = `terms[${index}] id=${id} ${field}`;
        }
        return `  - ${label}: ${issue.message}`;
      })
      .join("\n");
    return new Error(`Invalid glossary data (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid glossary data (${context}): ${error.message}`);
  }

  return new Error(`Invalid glossary data (${context})`);
}

function assertUniqueIds(terms: GlossaryTerm[]): void {
  const seen = new Map<string, number>();

  for (let index = 0; index < terms.length; index += 1) {
    const { id } = terms[index];
    const previous = seen.get(id);
    if (previous !== undefined) {
      throw new Error(
        `Duplicate glossary id "${id}" at index ${index} (first seen at index ${previous})`,
      );
    }
    seen.set(id, index);
  }
}

function assertUniqueDe(terms: GlossaryTerm[]): void {
  const seen = new Map<string, number>();

  for (let index = 0; index < terms.length; index += 1) {
    const de = terms[index].de.trim();
    const previous = seen.get(de);
    if (previous !== undefined) {
      throw new Error(
        `Duplicate glossary de "${de}" at index ${index} (first seen at index ${previous})`,
      );
    }
    seen.set(de, index);
  }
}

/** Load and validate data/glossary.json. Throws on invalid shape or duplicate id/de. */
export function getTerms(): GlossaryTerm[] {
  if (!fs.existsSync(GLOSSARY_PATH)) {
    throw new Error(`Glossary file not found: ${GLOSSARY_PATH}`);
  }

  const raw = fs.readFileSync(GLOSSARY_PATH, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${GLOSSARY_PATH}: ${message}`);
  }

  let terms: GlossaryTerm[];
  try {
    const file = parseGlossaryFile(data);
    terms = file.terms;
  } catch (error) {
    const rawTerms =
      data &&
      typeof data === "object" &&
      data !== null &&
      "terms" in data
        ? (data as { terms: unknown }).terms
        : undefined;
    throw formatZodError(error, GLOSSARY_PATH, rawTerms);
  }

  assertUniqueIds(terms);
  assertUniqueDe(terms);
  return terms;
}

/** Look up a single term by id. Returns undefined if not found. */
export function getTermById(id: string): GlossaryTerm | undefined {
  return getTerms().find((term) => term.id === id);
}

/** Look up a single term by exact German label (trimmed). Returns undefined if not found. */
export function getTermByDe(de: string): GlossaryTerm | undefined {
  const needle = de.trim();
  return getTerms().find((term) => term.de.trim() === needle);
}

/** Validate data/glossary.json. Returns term count. */
export function validateGlossary(): number {
  return getTerms().length;
}
