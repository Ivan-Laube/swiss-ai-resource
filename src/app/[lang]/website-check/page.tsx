import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { WebsiteCheckForm } from "@/components/WebsiteCheckForm";
import { Container } from "@/components/ui";
import { resolvePageLinks } from "@/content";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { getScannerChecks } from "@/scanner";
import { getSurvey } from "@/survey";
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
    title: messages.websiteCheck.metaTitle,
    description: messages.websiteCheck.metaDescription,
    path: "website-check",
    languages: buildLanguageAlternates("/website-check"),
  });
}

export default async function WebsiteCheckPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const survey = getSurvey();

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <Link href={`/${lang}/`} className={styles.back}>
            {messages.websiteCheck.backHome}
          </Link>
          <h1>{messages.websiteCheck.title}</h1>
          <p className={styles.lead}>{messages.websiteCheck.lead}</p>
          <WebsiteCheckForm
            locale={lang}
            messages={messages.websiteCheck}
            surveyEstimatedMinutes={survey.estimated_minutes}
            relatedLinks={resolvePageLinks(
              lang,
              getScannerChecks().checks.flatMap((check) =>
                check.related_page ? [check.related_page] : [],
              ),
            )}
          />
        </Container>
      </main>
    </>
  );
}
