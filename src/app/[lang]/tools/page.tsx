import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolCard, ToolLinkCard } from "@/components/ToolCard";
import { Container } from "@/components/ui";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { getReadinessCheck, readinessQuestionCount } from "@/readiness";
import { getAllRules, pickLocalized } from "@/rules";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  const messages = getMessages(lang);

  return buildPageMetadata({
    locale: lang,
    title: messages.tools.indexTitle,
    description: messages.tools.indexLead,
    path: "tools",
    languages: buildLanguageAlternates("/tools"),
  });
}

export default async function ToolsIndexPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const trees = getAllRules();
  const readiness = getReadinessCheck();

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <Link href={`/${lang}/`} className={styles.back}>
            {messages.tools.backHome}
          </Link>
          <h1 className={styles.title}>{messages.tools.indexTitle}</h1>
          <p className={styles.lead}>{messages.tools.indexLead}</p>

          {trees.length > 0 ? (
            <ul className={styles.grid}>
              {readiness.status === "live" && readiness.listed ? (
                <li className={styles.gridItem}>
                  <ToolLinkCard
                    href={`/${lang}/tools/ai-readiness/`}
                    title={pickLocalized(readiness.title, lang)}
                    description={pickLocalized(readiness.description, lang)}
                    meta={messages.readiness.cardMeta.replace(
                      "{count}",
                      String(readinessQuestionCount(readiness)),
                    )}
                  />
                </li>
              ) : null}
              {trees.map((tree) => (
                <li key={tree.id} className={styles.gridItem}>
                  <ToolCard
                    tree={tree}
                    locale={lang}
                    maxQuestionsLabel={messages.tools.maxQuestions}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </main>
    </>
  );
}
