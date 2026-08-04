import { callAnthropic, getModel } from "@/lib/anthropic";

import type { Vendor } from "../schema";
import {
  buildVendorExtractFixJsonPrompt,
  buildVendorExtractPrompt,
  type VendorExtractPrompt,
} from "./prompt";
import { parseLlmVendorExtract } from "./parse";
import {
  sourcedCellsEqual,
  vendorClaimFields,
  type ExtractSourceInput,
  type ExtractVendorResult,
  type VendorClaimField,
  type VendorFieldPatch,
} from "./schema";

const DEFAULT_EXTRACT_MODEL = "claude-sonnet-4-20250514";

export function getVendorExtractModel(): string {
  return (
    getModel("VENDOR_EXTRACT_MODEL", "") ||
    getModel("CLASSIFY_MODEL", DEFAULT_EXTRACT_MODEL)
  );
}

async function extractWithLlm(
  prompt: VendorExtractPrompt,
): Promise<ReturnType<typeof parseLlmVendorExtract>> {
  const model = getVendorExtractModel();
  const raw = await callAnthropic({
    system: prompt.system,
    user: prompt.user,
    model,
  });

  try {
    return parseLlmVendorExtract(raw);
  } catch {
    const fixPrompt = buildVendorExtractFixJsonPrompt(prompt.user, raw);
    const fixedRaw = await callAnthropic({
      system: fixPrompt.system,
      user: fixPrompt.user,
      model,
    });
    return parseLlmVendorExtract(fixedRaw);
  }
}

/**
 * Drop proposed cells whose source_url is not one of the evidence URLs,
 * and drop cells that match the current vendor row (no-op).
 */
function sanitizeAndDiff(
  vendor: Vendor,
  proposed: ReturnType<typeof parseLlmVendorExtract>["fields"],
  allowedUrls: Set<string>,
): { fields: VendorFieldPatch; fields_changed: VendorClaimField[] } {
  const fields: VendorFieldPatch = {};
  const fields_changed: VendorClaimField[] = [];

  for (const key of vendorClaimFields) {
    const cell = proposed[key];
    if (cell === undefined) {
      continue;
    }
    if (cell.source_url !== null && !allowedUrls.has(cell.source_url)) {
      continue;
    }
    const current = vendor[key];
    if (sourcedCellsEqual(current, cell)) {
      continue;
    }
    switch (key) {
      case "hosting_regions":
        fields.hosting_regions = cell as Vendor["hosting_regions"];
        break;
      case "swiss_hosting":
        fields.swiss_hosting = cell as Vendor["swiss_hosting"];
        break;
      case "eu_hosting":
        fields.eu_hosting = cell as Vendor["eu_hosting"];
        break;
      case "dpa_url":
        fields.dpa_url = cell as Vendor["dpa_url"];
        break;
      case "training_opt_out":
        fields.training_opt_out = cell as Vendor["training_opt_out"];
        break;
      case "certifications":
        fields.certifications = cell as Vendor["certifications"];
        break;
      case "pricing_tier":
        fields.pricing_tier = cell as Vendor["pricing_tier"];
        break;
      case "swiss_entity":
        fields.swiss_entity = cell as Vendor["swiss_entity"];
        break;
      case "eu_entity":
        fields.eu_entity = cell as Vendor["eu_entity"];
        break;
    }
    fields_changed.push(key);
  }

  return { fields, fields_changed };
}

export type ExtractVendorFieldsOptions = {
  vendor: Vendor;
  sources: ExtractSourceInput[];
  dryRun?: boolean;
};

/**
 * LLM-extract claim field patches for a vendor from material source snapshots.
 * Fail-safe: empty patches + error (never invent).
 */
export async function extractVendorFields(
  options: ExtractVendorFieldsOptions,
): Promise<ExtractVendorResult> {
  const { vendor, sources, dryRun } = options;

  if (sources.length === 0) {
    return {
      fields: {},
      fields_changed: [],
      rationale: "No evidence sources provided",
      confidence: null,
      error: "No evidence sources provided",
    };
  }

  const prompt = buildVendorExtractPrompt({ vendor, sources });
  const allowedUrls = new Set(sources.map((s) => s.url));

  if (dryRun) {
    return {
      fields: {},
      fields_changed: [],
      rationale: "[dry-run] vendor extract skipped",
      confidence: null,
    };
  }

  try {
    const result = await extractWithLlm(prompt);
    const { fields, fields_changed } = sanitizeAndDiff(
      vendor,
      result.fields,
      allowedUrls,
    );
    return {
      fields,
      fields_changed,
      rationale: result.rationale,
      confidence: result.confidence ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      fields: {},
      fields_changed: [],
      rationale: `Parse/API failure; no field patches applied: ${message}`,
      confidence: "low",
      error: message,
    };
  }
}
