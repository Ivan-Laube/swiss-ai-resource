import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DecisionTree } from "@/components/DecisionTree";
import { SiteHeader } from "@/components/SiteHeader";
import { Container } from "@/components/ui";
import { resolvePageLinks } from "@/content";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { getRule, listRuleIds, pickLocalized } from "@/rules";
import { getSurvey } from "@/survey";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string; toolId: string }>;
};

export function generateStaticParams() {
  const params: { lang: string; toolId: string }[] = [];

  for (const lang of locales) {
    for (const toolId of listRuleIds()) {
      params.push({ lang, toolId });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, toolId } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  try {
    const tree = getRule(toolId);
    return buildPageMetadata({
      locale: lang,
      title: pickLocalized(tree.title, lang),
      description: pickLocalized(tree.description, lang),
      path: `tools/${toolId}`,
      languages: buildLanguageAlternates(`/tools/${toolId}`),
    });
  } catch {
    return {};
  }
}

export default async function ToolPage({ params }: PageProps) {
  const { lang, toolId } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  let tree;
  try {
    tree = getRule(toolId);
  } catch {
    notFound();
  }

  const messages = getMessages(lang);
  const relatedRefs = Object.values(tree.nodes).flatMap((node) =>
    node.type === "outcome" ? node.related_pages : [],
  );
  // Pages missing in this locale are omitted (R35).
  const relatedLinks = resolvePageLinks(lang, relatedRefs);
  const surveyEstimatedMinutes = getSurvey().estimated_minutes;

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <Link href={`/${lang}/tools/`} className={styles.back}>
            {messages.tools.backToIndex}
          </Link>
          <h1 className={styles.title}>{pickLocalized(tree.title, lang)}</h1>
          <p className={styles.lead}>
            {pickLocalized(tree.description, lang)}
          </p>
          <DecisionTree
            tree={tree}
            locale={lang}
            toolsMessages={messages.tools}
            relatedLinks={relatedLinks}
            surveyEstimatedMinutes={surveyEstimatedMinutes}
          />
        </Container>
      </main>
    </>
  );
}
