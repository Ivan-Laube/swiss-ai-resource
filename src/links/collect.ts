import { getAllContentPages, isPublishableSlug } from "@/content";
import { getAllRules } from "@/rules";
import { getVendors, type Vendor } from "@/vendors";

import type { LinkCitation } from "./schema";

const MARKDOWN_LINK_RE =
  /\[([^\]]*)\]\((https:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g;

const VENDOR_CLAIM_FIELDS = [
  "hosting_regions",
  "swiss_hosting",
  "eu_hosting",
  "dpa_url",
  "training_opt_out",
  "certifications",
  "pricing_tier",
  "swiss_entity",
  "eu_entity",
] as const;

export type UrlCitationMap = Map<string, LinkCitation[]>;

function addCitation(
  map: UrlCitationMap,
  url: string,
  citation: LinkCitation,
): void {
  const existing = map.get(url);
  if (!existing) {
    map.set(url, [citation]);
    return;
  }
  if (existing.some((c) => c.kind === citation.kind && c.id === citation.id)) {
    return;
  }
  existing.push(citation);
}

function collectMarkdownHttpsUrls(body: string): string[] {
  const urls: string[] = [];
  MARKDOWN_LINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MARKDOWN_LINK_RE.exec(body)) !== null) {
    urls.push(match[2]);
  }
  return urls;
}

function collectVendorUrls(map: UrlCitationMap, vendor: Vendor): void {
  addCitation(map, vendor.website, {
    kind: "vendor",
    id: `${vendor.id}#website`,
  });

  for (const field of VENDOR_CLAIM_FIELDS) {
    const cell = vendor[field];
    if (cell.source_url) {
      addCitation(map, cell.source_url, {
        kind: "vendor",
        id: `${vendor.id}#${field}.source_url`,
      });
    }
  }

  if (vendor.dpa_url.value) {
    addCitation(map, vendor.dpa_url.value, {
      kind: "vendor",
      id: `${vendor.id}#dpa_url.value`,
    });
  }
}

/**
 * Collect unique https:// URLs cited on published surfaces
 * (content frontmatter + body, vendors.json, decision rules).
 */
export function collectPublishedUrls(): UrlCitationMap {
  const map: UrlCitationMap = new Map();

  for (const page of getAllContentPages()) {
    if (!isPublishableSlug(page.slug)) {
      continue;
    }

    for (const source of page.frontmatter.sources) {
      addCitation(map, source.url, {
        kind: "content",
        id: `${page.locale}/${page.slug}#sources`,
      });
    }

    for (const url of collectMarkdownHttpsUrls(page.body)) {
      addCitation(map, url, {
        kind: "content",
        id: `${page.locale}/${page.slug}#body`,
      });
    }
  }

  for (const vendor of getVendors()) {
    collectVendorUrls(map, vendor);
  }

  for (const tree of getAllRules()) {
    for (const [nodeId, node] of Object.entries(tree.nodes)) {
      if (node.type !== "outcome") {
        continue;
      }
      for (const source of node.sources) {
        addCitation(map, source.url, {
          kind: "rule",
          id: `${tree.id}#${nodeId}`,
        });
      }
    }
  }

  return map;
}
