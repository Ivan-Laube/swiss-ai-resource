import { listGuidePages } from "@/content";
import type { Locale } from "@/i18n";
import type { Messages } from "@/i18n/types";
import { getLastSourceCheckDate } from "@/lib/last-source-check";
import { getAllRules, pickLocalized } from "@/rules";
import {
  SiteFooterView,
  type SiteFooterLink,
  type SiteFooterModel,
} from "./SiteFooterView";

export type { SiteFooterLink, SiteFooterModel };
export { SiteFooterView };

type SiteFooterProps = {
  activeLang: Locale;
  messages: Messages;
};

/** Serializable footer data for server and client (e.g. global 404). */
export function buildSiteFooterModel(
  activeLang: Locale,
  messages: Messages,
): SiteFooterModel {
  const guides = listGuidePages(activeLang).map((page) => ({
    href: `/${activeLang}/${page.slug}/`,
    label: page.frontmatter.title,
  }));

  const tools: SiteFooterLink[] = [
    ...getAllRules().map((tree) => ({
      href: `/${activeLang}/tools/${tree.id}/`,
      label: pickLocalized(tree.title, activeLang),
    })),
    {
      href: `/${activeLang}/website-check/`,
      label: messages.nav.websiteCheck,
    },
  ];

  const data: SiteFooterLink[] = [
    {
      href: `/${activeLang}/vendors/`,
      label: messages.nav.vendors,
    },
    {
      href: `/${activeLang}/survey/`,
      label: messages.nav.survey,
    },
    {
      href: `/${activeLang}/benchmark/`,
      label: messages.footer.benchmark,
    },
  ];

  const legal: SiteFooterLink[] = [
    {
      href: `/${activeLang}/impressum/`,
      label: messages.footer.impressum,
    },
    {
      href: `/${activeLang}/datenschutz/`,
      label: messages.footer.privacy,
    },
  ];

  const [lastSourceBefore = "", lastSourceAfter = ""] =
    messages.footer.lastSourceCheck.split("{date}");

  return {
    activeLang,
    brandLabel: messages.nav.brand,
    brandDescription: messages.footer.brandDescription,
    wordmark: messages.nav.wordmark,
    wordmarkTld: messages.nav.wordmarkTld,
    brandSubtitle: messages.nav.brandSubtitle,
    navLabel: messages.footer.navLabel,
    colGuides: messages.footer.colGuides,
    colTools: messages.footer.colTools,
    colData: messages.footer.colData,
    colLegal: messages.footer.colLegal,
    guides,
    tools,
    data,
    legal,
    lastSourceIso: getLastSourceCheckDate(),
    lastSourceBefore,
    lastSourceAfter,
    disclaimer: messages.footer.disclaimer,
    copyright: messages.footer.copyright.replace(
      "{year}",
      String(new Date().getFullYear()),
    ),
  };
}

export function SiteFooter({ activeLang, messages }: SiteFooterProps) {
  return (
    <SiteFooterView model={buildSiteFooterModel(activeLang, messages)} />
  );
}
