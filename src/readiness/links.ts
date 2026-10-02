import { resolvePageLink } from "@/content";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import { getRule, pickLocalized } from "@/rules";
import { downloadHref } from "@/templates/links";

import { DOWNLOADS, SITE_PAGES, type ReadinessCheck } from "./schema";

/** A next-step link resolved for one locale. */
export type ResolvedLink = { href: string; label: string };

/** Every link string the check can show (questions, security, profile). */
function allLinks(check: ReadinessCheck): string[] {
  return [
    ...check.questions.flatMap((q) => q.links),
    ...check.security.questions.flatMap((q) => q.links),
    ...check.profile.flatMap((p) => p.add_links?.links ?? []),
  ];
}

/**
 * Resolve every link of the check to an href and a localized label.
 * Links that can't be resolved in this locale (page not translated yet)
 * are left out; the validator already guarantees they exist in DE.
 */
export function resolveReadinessLinks(
  check: ReadinessCheck,
  locale: Locale,
  messages: Messages,
): Record<string, ResolvedLink> {
  const out: Record<string, ResolvedLink> = {};
  for (const link of new Set(allLinks(check))) {
    const kind = link.slice(0, link.indexOf(":"));
    const target = link.slice(link.indexOf(":") + 1);
    switch (kind) {
      case "guide": {
        const resolved = resolvePageLink(locale, target);
        if (resolved) {
          out[link] = {
            href: resolved.href,
            label: resolved.section ? `${resolved.title} – ${resolved.section}` : resolved.title,
          };
        }
        break;
      }
      case "tool": {
        const tree = getRule(target);
        out[link] = {
          href: `/${locale}/tools/${target}/`,
          label: `${pickLocalized(tree.title, locale)} ${messages.readiness.toolLinkSuffix}`,
        };
        break;
      }
      case "site": {
        if (target in SITE_PAGES) {
          out[link] = {
            href: `/${locale}/${SITE_PAGES[target as keyof typeof SITE_PAGES]}`,
            label: target === "vendors" ? messages.nav.vendors : target,
          };
        }
        break;
      }
      case "download": {
        if (target in DOWNLOADS) {
          out[link] = {
            href: downloadHref(target, locale),
            label: target === "ai-policy-template" ? messages.readiness.downloadPolicyTemplate : target,
          };
        }
        break;
      }
    }
  }
  return out;
}
