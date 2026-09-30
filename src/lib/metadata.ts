import type { Metadata } from "next";
import { getMessages, type Locale } from "@/i18n";
import { siteName, siteUrl } from "@/lib/site";

/** Locale-aware root metadata: brand template, defaults, metadataBase. */
export function buildRootMetadata(locale: Locale): Metadata {
  const messages = getMessages(locale);

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: {
      default: messages.meta.title,
      template: `%s | ${siteName}`,
    },
    description: messages.meta.description,
  };
}
