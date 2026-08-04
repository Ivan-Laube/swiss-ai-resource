import fs from "node:fs";
import path from "node:path";

import {
  parseVendorsFile,
  type Vendor,
} from "./schema";

export const VENDORS_PATH = path.join(process.cwd(), "data", "vendors.json");

function formatZodError(
  error: unknown,
  context: string,
  rawData?: unknown,
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
          Array.isArray(rawData) &&
          issue.path.length > 0 &&
          typeof issue.path[0] === "number"
        ) {
          const index = issue.path[0];
          const entry = rawData[index];
          const id =
            entry &&
            typeof entry === "object" &&
            entry !== null &&
            "id" in entry &&
            typeof (entry as { id: unknown }).id === "string"
              ? (entry as { id: string }).id
              : "?";
          label = `[${index}] id=${id} ${field}`;
        }
        return `  - ${label}: ${issue.message}`;
      })
      .join("\n");
    return new Error(`Invalid vendors data (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid vendors data (${context}): ${error.message}`);
  }

  return new Error(`Invalid vendors data (${context})`);
}

function assertUniqueIds(vendors: Vendor[]): void {
  const seen = new Map<string, number>();

  for (let index = 0; index < vendors.length; index += 1) {
    const { id } = vendors[index];
    const previous = seen.get(id);
    if (previous !== undefined) {
      throw new Error(
        `Duplicate vendor id "${id}" at index ${index} (first seen at index ${previous})`,
      );
    }
    seen.set(id, index);
  }
}

/** Load and validate data/vendors.json. Throws on invalid shape or duplicate ids. */
export function getVendors(): Vendor[] {
  if (!fs.existsSync(VENDORS_PATH)) {
    throw new Error(`Vendors file not found: ${VENDORS_PATH}`);
  }

  const raw = fs.readFileSync(VENDORS_PATH, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${VENDORS_PATH}: ${message}`);
  }

  let vendors: Vendor[];
  try {
    vendors = parseVendorsFile(data);
  } catch (error) {
    throw formatZodError(error, VENDORS_PATH, data);
  }

  assertUniqueIds(vendors);
  return vendors;
}

/** Look up a single vendor by id. Returns undefined if not found. */
export function getVendorById(id: string): Vendor | undefined {
  return getVendors().find((vendor) => vendor.id === id);
}

/** Validate data/vendors.json. Returns vendor count. */
export function validateVendors(): number {
  return getVendors().length;
}
