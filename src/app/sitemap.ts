import type { MetadataRoute } from "next";
import { listPublishableContentSlugs, localesWithSlug } from "@/content";
import { buildLanguageAlternates, locales, type Locale } from "@/i18n";
import { siteUrl } from "@/lib/site";
import { listRuleIds } from "@/rules";

export const dynamic = "force-static";

const FIXED_SEGMENTS = [
  "tools",
  "vendors",
  "survey",
  "benchmark",
  "website-check",
] as const;

function entry(
  lang: Locale,
  path: string,
  availableLocales: readonly Locale[] = locales,
): MetadataRoute.Sitemap[number] {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  return {
    url: `${siteUrl}/${lang}${normalizedPath}/`,
    alternates: {
      languages: buildLanguageAlternates(normalizedPath, availableLocales),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    entries.push(entry(lang, ""));

    for (const segment of FIXED_SEGMENTS) {
      entries.push(entry(lang, `/${segment}`));
    }

    for (const slug of listPublishableContentSlugs(lang)) {
      entries.push(entry(lang, `/${slug}`, localesWithSlug(slug)));
    }

    for (const toolId of listRuleIds()) {
      entries.push(entry(lang, `/tools/${toolId}`));
    }
  }

  return entries;
}
