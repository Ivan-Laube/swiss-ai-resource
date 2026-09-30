/**
 * Sitemap-equivalent paths for R50 visual snapshots (locale-aware).
 */
import { listPublishableContentSlugs } from "../../src/content";
import type { Locale } from "../../src/i18n";
import { listRuleIds } from "../../src/rules";

export const VISUAL_LOCALES = ["de", "fr"] as const satisfies readonly Locale[];

export type VisualLocale = (typeof VISUAL_LOCALES)[number];

export type VisualRoute = {
  /** Stable screenshot basename (without locale / project). */
  id: string;
  /** Path under `/{lang}/` (empty string = home). */
  segment: string;
};

const FIXED_ROUTES: readonly VisualRoute[] = [
  { id: "home", segment: "" },
  { id: "guides", segment: "guides" },
  { id: "tools", segment: "tools" },
  { id: "vendors", segment: "vendors" },
  { id: "survey", segment: "survey" },
  { id: "benchmark", segment: "benchmark" },
  { id: "website-check", segment: "website-check" },
];

/** Unknown path → 404 / NotFoundView (same masking rules as other visual routes). */
export const VISUAL_404_ROUTE: VisualRoute = {
  id: "404",
  segment: "__visual-missing__",
};

/** All visual routes for a locale (fixed + content slugs + decision tools + 404). */
export function listVisualRoutes(lang: VisualLocale): VisualRoute[] {
  const contentRoutes = listPublishableContentSlugs(lang).map((slug) => ({
    id: slug,
    segment: slug,
  }));

  const toolRoutes = listRuleIds().map((toolId) => ({
    id: `tools-${toolId}`,
    segment: `tools/${toolId}`,
  }));

  return [...FIXED_ROUTES, ...contentRoutes, ...toolRoutes, VISUAL_404_ROUTE];
}

export function visualPath(lang: VisualLocale, route: VisualRoute): string {
  if (!route.segment) {
    return `/${lang}/`;
  }
  return `/${lang}/${route.segment}/`;
}

export function needsTurnstile(route: VisualRoute): boolean {
  return route.segment === "website-check" || route.segment === "survey";
}
