import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
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

  return {
    title: messages.tools.indexTitle,
    description: messages.tools.indexLead,
    alternates: {
      canonical: `${siteUrl}/${lang}/tools/`,
      languages: buildLanguageAlternates("/tools"),
    },
  };
}

export default async function ToolsIndexPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const trees = getAllRules();

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <Link href={`/${lang}/`} className={styles.back}>
          {messages.tools.backHome}
        </Link>
        <h1>{messages.tools.indexTitle}</h1>
        <p className={styles.lead}>{messages.tools.indexLead}</p>

        {trees.length > 0 ? (
          <ul className={styles.toolList}>
            {trees.map((tree) => (
              <li key={tree.id}>
                <Link href={`/${lang}/tools/${tree.id}/`}>
                  {pickLocalized(tree.title, lang)}
                </Link>
                <p>{pickLocalized(tree.description, lang)}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </>
  );
}
