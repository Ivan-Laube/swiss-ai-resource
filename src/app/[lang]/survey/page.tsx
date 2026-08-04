import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SurveyForm } from "@/components/SurveyForm";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
import { getSurvey, pickLocalized } from "@/survey";
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
  const survey = getSurvey();

  return {
    title: messages.survey.metaTitle,
    description:
      pickLocalized(survey.description, lang) || messages.survey.metaDescription,
    alternates: {
      canonical: `${siteUrl}/${lang}/survey/`,
      languages: buildLanguageAlternates("/survey"),
    },
  };
}

export default async function SurveyPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const survey = getSurvey();
  const title = pickLocalized(survey.title, lang);
  const description = pickLocalized(survey.description, lang);
  const estimatedTime = messages.survey.estimatedTime.replace(
    "{minutes}",
    String(survey.estimated_minutes),
  );

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <Link href={`/${lang}/`} className={styles.back}>
          {messages.survey.backHome}
        </Link>
        <h1>{title}</h1>
        <p className={styles.lead}>{description}</p>
        <p className={styles.meta}>{estimatedTime}</p>
        <SurveyForm
          survey={survey}
          locale={lang}
          messages={messages.survey}
        />
      </main>
    </>
  );
}
