import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  const messages = getMessages(lang);

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: `${siteUrl}/${lang}/`,
      languages: buildLanguageAlternates(),
    },
  };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <p className={styles.eyebrow}>{messages.home.eyebrow}</p>
        <h1>{messages.home.title}</h1>
        <p className={styles.lead}>{messages.home.lead}</p>
        <p className={styles.note}>{messages.home.note}</p>
      </main>
    </>
  );
}
