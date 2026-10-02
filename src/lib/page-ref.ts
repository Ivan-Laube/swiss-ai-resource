import { z } from "@/lib/zod";

/**
 * Reference from data files (decision trees, scanner checks, readiness check)
 * to a guide page or a section of it: `ndsg-ai-basics` or
 * `ndsg-ai-basics#transparenz`. The anchor must be an explicit `{#…}` heading
 * anchor (see `heading-anchors.ts`), never a generated id. Client-safe.
 */
export const PAGE_REF_RE =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:#[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$/;

export const pageRefSchema = z.string().regex(PAGE_REF_RE, {
  message:
    "Must be a content slug, optionally with a section anchor (e.g. ndsg-ai-basics or ndsg-ai-basics#transparenz)",
});

export type PageRef = { slug: string; anchor: string | null };

export function parsePageRef(ref: string): PageRef {
  const hash = ref.indexOf("#");
  return hash === -1
    ? { slug: ref, anchor: null }
    : { slug: ref.slice(0, hash), anchor: ref.slice(hash + 1) };
}

/** Site path for a page ref: `/de/ndsg-ai-basics/#transparenz`. */
export function pageRefHref(locale: string, ref: PageRef): string {
  return `/${locale}/${ref.slug}/${ref.anchor ? `#${ref.anchor}` : ""}`;
}

/** A resolved link for UI: localized label and href. */
export type ResolvedPageLink = {
  ref: string;
  title: string;
  /** Localized section heading when the ref has an anchor that exists in the locale. */
  section: string | null;
  href: string;
};
