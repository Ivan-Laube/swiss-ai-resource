import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { VendorTable } from "@/components/VendorTable";
import {
  buildLanguageAlternates,
  getMessages,
  isLocale,
  locales,
} from "@/i18n";
import { siteUrl } from "@/lib/site";
import { getVendors } from "@/vendors";
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
    title: messages.vendors.indexTitle,
    description: messages.vendors.indexLead,
    alternates: {
      canonical: `${siteUrl}/${lang}/vendors/`,
      languages: buildLanguageAlternates("/vendors"),
    },
  };
}

export default async function VendorsPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);
  const vendors = getVendors();

  return (
    <>
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main} lang={lang}>
        <Link href={`/${lang}/`} className={styles.back}>
          {messages.vendors.backHome}
        </Link>
        <h1>{messages.vendors.indexTitle}</h1>
        <p className={styles.lead}>{messages.vendors.indexLead}</p>

        <VendorTable
          vendors={vendors}
          vendorsMessages={messages.vendors}
          lang={lang}
        />

        <p className={styles.disclaimer}>{messages.vendors.disclaimer}</p>
      </main>
    </>
  );
}
