import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { WebsiteCheckForm } from "@/components/WebsiteCheckForm";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
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

  return {
    title: messages.websiteCheck.metaTitle,
    description: messages.websiteCheck.metaDescription,
    alternates: {
      canonical: `${siteUrl}/${lang}/website-check/`,
      languages: buildLanguageAlternates("/website-check"),
    },
  };
}

export default async function WebsiteCheckPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <Link href={`/${lang}/`} className={styles.back}>
          {messages.websiteCheck.backHome}
        </Link>
        <h1>{messages.websiteCheck.title}</h1>
        <p className={styles.lead}>{messages.websiteCheck.lead}</p>
        <WebsiteCheckForm locale={lang} messages={messages.websiteCheck} />
      </main>
    </>
  );
}
