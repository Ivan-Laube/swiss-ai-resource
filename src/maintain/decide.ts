import type { ClassifyReport } from "@/classify";
import { getSourceById, getSources } from "@/sources";
import type { RunReport } from "@/snapshot";

import type { ActPageAction, ActVendorBump } from "./schema";

export type ActDecision = {
  bumped: ActPageAction[];
  material: ActPageAction[];
  skipped_slugs: string[];
};

export type VendorActDecision = {
  bumped: ActVendorBump[];
  material: Array<{ vendor_id: string; source_ids: string[] }>;
  skipped: string[];
};

function addSlugSource(
  map: Map<string, Set<string>>,
  slug: string,
  sourceId: string,
): void {
  let set = map.get(slug);
  if (!set) {
    set = new Set();
    map.set(slug, set);
  }
  set.add(sourceId);
}

function toActions(
  map: Map<string, Set<string>>,
  reason: ActPageAction["reason"],
): ActPageAction[] {
  return [...map.entries()]
    .map(([slug, ids]) => ({
      slug,
      source_ids: [...ids].sort(),
      reason,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Decide which content slugs to bump vs clear review fields for.
 * Material wins over bump when a slug appears in both sets.
 *
 * Freshness bumps require a byte-identical successful fetch (`unchanged`).
 * Cosmetic classifications do not bump — a non-empty diff must not mint a
 * freshness claim (prompt injection on the source page could coerce "cosmetic").
 */
export function decideActActions(
  runReport: RunReport,
  classifyReport: ClassifyReport,
): ActDecision {
  const materialMap = new Map<string, Set<string>>();
  const bumpUnchangedMap = new Map<string, Set<string>>();
  const skipped = new Set<string>();

  for (const result of runReport.results) {
    const source = getSourceById(result.id);
    const pages = source?.dependent_pages ?? [];

    if (!result.ok || result.change === "kept") {
      for (const slug of pages) {
        skipped.add(slug);
      }
      continue;
    }

    if (result.change === "unchanged" && pages.length > 0) {
      for (const slug of pages) {
        addSlugSource(bumpUnchangedMap, slug, result.id);
      }
    }
  }

  for (const entry of classifyReport.sources) {
    const pages = entry.dependent_pages;

    if (
      entry.status === "classified" &&
      entry.classification === "material" &&
      pages.length > 0
    ) {
      for (const slug of pages) {
        addSlugSource(materialMap, slug, entry.id);
      }
    }
  }

  const materialSlugs = new Set(materialMap.keys());

  const bumpMap = new Map<string, Set<string>>();
  for (const [slug, ids] of bumpUnchangedMap) {
    if (materialSlugs.has(slug)) {
      continue;
    }
    for (const id of ids) {
      addSlugSource(bumpMap, slug, id);
    }
  }

  // Track skipped slugs that never made it into bump or material.
  for (const slug of skipped) {
    if (bumpMap.has(slug) || materialSlugs.has(slug)) {
      skipped.delete(slug);
    }
  }

  const bumped: ActPageAction[] = [...bumpMap.entries()]
    .map(([slug, ids]) => ({
      slug,
      source_ids: [...ids].sort(),
      reason: "unchanged" as const,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    bumped,
    material: toActions(materialMap, "material"),
    skipped_slugs: [...skipped].sort(),
  };
}

function addVendorSource(
  map: Map<string, Set<string>>,
  vendorId: string,
  sourceId: string,
): void {
  let set = map.get(vendorId);
  if (!set) {
    set = new Set();
    map.set(vendorId, set);
  }
  set.add(sourceId);
}

/**
 * Decide which vendors to bump last_checked vs extract field patches for.
 * Material wins over bump when a vendor appears in both sets.
 *
 * Same freshness rule as content: only `unchanged` sources bump `last_checked`.
 * Cosmetic diffs do not bump.
 */
export function decideVendorActions(
  runReport: RunReport,
  classifyReport: ClassifyReport,
): VendorActDecision {
  const vendorSources = getSources().filter((source) => source.vendor_id != null);
  const sourceToVendor = new Map<string, string>();
  for (const source of vendorSources) {
    if (source.vendor_id) {
      sourceToVendor.set(source.id, source.vendor_id);
    }
  }

  const materialMap = new Map<string, Set<string>>();
  const bumpUnchangedMap = new Map<string, Set<string>>();
  const skipped = new Set<string>();

  for (const result of runReport.results) {
    const vendorId = sourceToVendor.get(result.id);
    if (!vendorId) {
      continue;
    }

    if (!result.ok || result.change === "kept") {
      skipped.add(vendorId);
      continue;
    }

    if (result.change === "unchanged") {
      addVendorSource(bumpUnchangedMap, vendorId, result.id);
    }
  }

  for (const entry of classifyReport.sources) {
    const vendorId = sourceToVendor.get(entry.id);
    if (!vendorId) {
      continue;
    }

    if (entry.status === "baseline" || entry.status === "failed") {
      skipped.add(vendorId);
      continue;
    }

    if (
      entry.status === "classified" &&
      entry.classification === "material"
    ) {
      addVendorSource(materialMap, vendorId, entry.id);
    }
  }

  const materialIds = new Set(materialMap.keys());

  const bumpMap = new Map<string, Set<string>>();
  for (const [vendorId, ids] of bumpUnchangedMap) {
    if (materialIds.has(vendorId)) {
      continue;
    }
    for (const id of ids) {
      addVendorSource(bumpMap, vendorId, id);
    }
  }

  for (const vendorId of skipped) {
    if (bumpMap.has(vendorId) || materialIds.has(vendorId)) {
      skipped.delete(vendorId);
    }
  }

  const bumped: ActVendorBump[] = [...bumpMap.entries()]
    .map(([vendor_id, ids]) => ({
      vendor_id,
      source_ids: [...ids].sort(),
      reason: "unchanged" as const,
    }))
    .sort((a, b) => a.vendor_id.localeCompare(b.vendor_id));

  const material = [...materialMap.entries()]
    .map(([vendor_id, ids]) => ({
      vendor_id,
      source_ids: [...ids].sort(),
    }))
    .sort((a, b) => a.vendor_id.localeCompare(b.vendor_id));

  return {
    bumped,
    material,
    skipped: [...skipped].sort(),
  };
}
