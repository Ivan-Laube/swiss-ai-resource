import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadinessCheck, type ProfileField } from "@/components/ReadinessCheck";
import { SiteHeader } from "@/components/SiteHeader";
import { Container } from "@/components/ui";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";
import { getReadinessCheck } from "@/readiness";
import { resolveReadinessLinks } from "@/readiness/links";
import { pickLocalized } from "@/rules";
import { getSurvey } from "@/survey";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const check = getReadinessCheck();
  const metadata = buildPageMetadata({
    locale: lang,
    title: pickLocalized(check.title, lang),
    description: pickLocalized(check.description, lang),
    path: "tools/ai-readiness",
    languages: buildLanguageAlternates("/tools/ai-readiness"),
  });
  // Not indexed until the check is complete in all languages (status "live").
  return check.status === "live" ? metadata : { ...metadata, robots: { index: false, follow: false } };
}

/** Profile questions with their wording resolved (survey questions reused). */
function profileFields(): ProfileField[] {
  const check = getReadinessCheck();
  const survey = getSurvey();
  return check.profile.map((p) => {
    if (p.from_survey) {
      const q = survey.questions.find((s) => s.id === p.from_survey);
      if (!q || !("options" in q)) {
        throw new Error(`Readiness profile "${p.id}": survey question "${p.from_survey}" has no options`);
      }
      return { id: p.id, prompt: q.prompt, options: q.options.map((o) => ({ id: o.id, label: o.label })) };
    }
    return { id: p.id, prompt: p.prompt!, options: p.options! };
  });
}

export default async function ReadinessPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const check = getReadinessCheck();

  return (
    <>
      <SiteHeader activeLang={lang} nav={messages.nav} />
      <main id="main" className={styles.main} lang={lang}>
        <Container>
          <Link href={`/${lang}/tools/`} className={`${styles.back} readiness-print-hide`}>
            {messages.tools.backToIndex}
          </Link>
          <h1 className={styles.title}>{pickLocalized(check.title, lang)}</h1>
          <p className={styles.lead}>{pickLocalized(check.description, lang)}</p>
          <ReadinessCheck
            check={check}
            profile={profileFields()}
            links={resolveReadinessLinks(check, lang, messages)}
            locale={lang}
            messages={messages.readiness}
            siteUrl={siteUrl}
          />
        </Container>
      </main>
    </>
  );
}
