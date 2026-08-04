import path from "node:path";

import {
  getContentPage,
  localesWithSlug,
  writeContentPage,
  type ContentFrontmatter,
} from "@/content";
import {
  getVendors,
  writeVendors,
  type Vendor,
  type VendorFieldPatch,
} from "@/vendors";

import type { ActPageAction, ActVendorBump } from "./schema";

function toRepoRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).split(path.sep).join("/");
}

/** UTC calendar date as YYYY-MM-DD. */
export function utcDateString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Bump last_verified on every locale that has the slug.
 * Returns repo-relative paths written.
 */
export function applyBumps(
  actions: ActPageAction[],
  verifiedDate: string,
): string[] {
  const written: string[] = [];

  for (const action of actions) {
    for (const locale of localesWithSlug(action.slug)) {
      const page = getContentPage(locale, action.slug);
      if (page.frontmatter.last_verified === verifiedDate) {
        continue;
      }

      const frontmatter: ContentFrontmatter = {
        ...page.frontmatter,
        last_verified: verifiedDate,
      };
      const outPath = writeContentPage(
        locale,
        action.slug,
        frontmatter,
        page.body,
      );
      written.push(toRepoRelative(outPath));
    }
  }

  return written.sort();
}

/**
 * Clear lawyer review fields on DE pages only.
 * Returns repo-relative paths written (skips files that were already null).
 */
export function applyMaterialClears(actions: ActPageAction[]): string[] {
  const written: string[] = [];

  for (const action of actions) {
    const page = getContentPage("de", action.slug);
    const { reviewed_by, review_date, review_scope } = page.frontmatter;
    if (
      reviewed_by == null &&
      review_date == null &&
      review_scope == null
    ) {
      continue;
    }

    const frontmatter: ContentFrontmatter = {
      ...page.frontmatter,
      reviewed_by: null,
      review_date: null,
      review_scope: null,
    };
    const outPath = writeContentPage("de", action.slug, frontmatter, page.body);
    written.push(toRepoRelative(outPath));
  }

  return written.sort();
}

export type VendorMaterialPatch = {
  vendor_id: string;
  fields: VendorFieldPatch;
  /** When true, bump last_checked even if no claim fields changed. */
  bump_last_checked: boolean;
};

/**
 * Apply last_checked bumps and/or claim-field patches in one write of vendors.json.
 * Returns repo-relative path when the file changed, else [].
 */
export function applyVendorUpdates(options: {
  bumps: ActVendorBump[];
  patches: VendorMaterialPatch[];
  checkedDate: string;
}): string[] {
  const { bumps, patches, checkedDate } = options;
  if (bumps.length === 0 && patches.length === 0) {
    return [];
  }

  const vendors = getVendors();
  const byId = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  let dirty = false;

  for (const bump of bumps) {
    const current = byId.get(bump.vendor_id);
    if (!current) {
      throw new Error(`Unknown vendor id for bump: ${bump.vendor_id}`);
    }
    if (current.last_checked === checkedDate) {
      continue;
    }
    byId.set(bump.vendor_id, { ...current, last_checked: checkedDate });
    dirty = true;
  }

  for (const patch of patches) {
    const current = byId.get(patch.vendor_id);
    if (!current) {
      throw new Error(`Unknown vendor id for patch: ${patch.vendor_id}`);
    }
    const next: Vendor = { ...current, ...patch.fields };
    if (patch.bump_last_checked && next.last_checked !== checkedDate) {
      next.last_checked = checkedDate;
    }
    const fieldKeys = Object.keys(patch.fields);
    if (fieldKeys.length === 0 && next.last_checked === current.last_checked) {
      continue;
    }
    byId.set(patch.vendor_id, next);
    dirty = true;
  }

  if (!dirty) {
    return [];
  }

  // Preserve original array order.
  const updated = vendors.map((vendor) => byId.get(vendor.id) ?? vendor);
  return [writeVendors(updated)];
}
