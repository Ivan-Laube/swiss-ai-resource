import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n";
import { siteName, siteUrl } from "@/lib/site";

const ogLocaleTags: Record<Locale, string> = {
  de: "de_CH",
  en: "en",
  fr: "fr_CH",
  it: "it_CH",
};

/** Locale-aware root metadata: brand template, defaults, metadataBase, OG/Twitter. */
export function buildRootMetadata(locale: Locale): Metadata {
  const messages = getMessages(locale);
  const ogImage = {
    url: `/og/${locale}.png`,
    width: 1200,
    height: 630,
    alt: `${siteName} — ${messages.home.title}`,
  };

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: {
      default: messages.meta.title,
      template: `%s | ${siteName}`,
    },
    description: messages.meta.description,
    openGraph: {
      type: "website",
      locale: ogLocaleTags[locale],
      siteName,
      title: messages.meta.title,
      description: messages.meta.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
      images: [ogImage.url],
    },
  };
}

type PageMetadataInput = {
  locale: Locale;
  /** Page title (the root template appends " | aicompliant.ch"). */
  title: string;
  description: string;
  /** Path under the locale, without slashes ("" = home, "tools/x" = tool). */
  path: string;
  /** hreflang alternates for this page. */
  languages: NonNullable<Metadata["alternates"]>["languages"];
};

/**
 * Per-page metadata including Open Graph / Twitter. Next.js does not merge a
 * page's title/description into the layout's `openGraph`, so every page must
 * set its own — otherwise all shares show the site default.
 */
export function buildPageMetadata({
  locale,
  title,
  description,
  path,
  languages,
}: PageMetadataInput): Metadata {
  const url = `${siteUrl}/${locale}/${path ? `${path}/` : ""}`;
  const ogImage = {
    url: `/og/${locale}.png`,
    width: 1200,
    height: 630,
    alt: `${siteName} — ${title}`,
  };

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: path ? "article" : "website",
      locale: ogLocaleTags[locale],
      siteName,
      url,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
