import type { Locale } from "@/i18n/config";
import { listHeadingAnchors } from "@/lib/heading-anchors";
import {
  pageRefHref,
  parsePageRef,
  type ResolvedPageLink,
} from "@/lib/page-ref";

import { getContentPage, listPublishableContentSlugs } from "./load";

/**
 * Why a page ref (`slug` or `slug#anchor`) is invalid against canonical DE,
 * or null when it is valid. The anchor must be an explicit `{#…}` anchor.
 * Other locales follow DE via the translate workflow (`check:anchors`).
 */
export function pageRefProblem(ref: string): string | null {
  const { slug, anchor } = parsePageRef(ref);
  if (!listPublishableContentSlugs("de").includes(slug)) {
    return `unknown DE content slug "${slug}"`;
  }
  if (
    anchor !== null &&
    !listHeadingAnchors(getContentPage("de", slug).body).some(
      (a) => a.anchor === anchor,
    )
  ) {
    return `DE page "${slug}" has no heading anchor {#${anchor}} (add it to the heading in content/de/${slug}.md)`;
  }
  return null;
}

/** Heading source text without inline Markdown (emphasis, code, links). */
function plainHeading(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/**
 * Localized link for a page ref, or null when the page doesn't exist in
 * that locale. If the locale page lacks the anchor (translation not yet
 * regenerated), the link goes to the page top instead of a dead fragment.
 */
export function resolvePageLink(
  locale: Locale,
  ref: string,
): ResolvedPageLink | null {
  const { slug, anchor } = parsePageRef(ref);
  let page;
  try {
    page = getContentPage(locale, slug);
  } catch {
    return null;
  }

  const heading =
    anchor === null
      ? undefined
      : listHeadingAnchors(page.body).find((a) => a.anchor === anchor);

  return {
    ref,
    title: page.frontmatter.title,
    section: heading ? plainHeading(heading.text) : null,
    href: pageRefHref(locale, { slug, anchor: heading ? anchor : null }),
  };
}

/** Resolve many refs (deduplicated), dropping pages missing in the locale. */
export function resolvePageLinks(
  locale: Locale,
  refs: readonly string[],
): ResolvedPageLink[] {
  return [...new Set(refs)].flatMap((ref) => {
    const link = resolvePageLink(locale, ref);
    return link ? [link] : [];
  });
}
