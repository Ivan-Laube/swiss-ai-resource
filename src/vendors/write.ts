import fs from "node:fs";
import path from "node:path";

import { getVendors, VENDORS_PATH } from "./load";
import { parseVendorsFile, type Vendor } from "./schema";

function toRepoRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).split(path.sep).join("/");
}

/**
 * Write the full vendors.json array and re-load so invalid output fails loud.
 * Returns the repo-relative path written.
 */
export function writeVendors(vendors: Vendor[]): string {
  parseVendorsFile(vendors);
  const ids = new Set<string>();
  for (const vendor of vendors) {
    if (ids.has(vendor.id)) {
      throw new Error(`Duplicate vendor id "${vendor.id}" before write`);
    }
    ids.add(vendor.id);
  }

  fs.mkdirSync(path.dirname(VENDORS_PATH), { recursive: true });
  fs.writeFileSync(
    VENDORS_PATH,
    `${JSON.stringify(vendors, null, 2)}\n`,
    "utf8",
  );

  getVendors();
  return toRepoRelative(VENDORS_PATH);
}
