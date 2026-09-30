import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { getMessages, isLocale, locales } from "@/i18n";
import { buildRootMetadata } from "@/lib/metadata";
import { instrumentSans } from "../document";
import "../globals.css";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return {};
  }

  return buildRootMetadata(lang);
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);

  return (
    <html lang={lang} className={instrumentSans.variable}>
      <body>
        <div className="localeShell">
          <SkipLink label={messages.nav.skipToContent} />
          {children}
          <SiteFooter activeLang={lang} messages={messages} />
        </div>
      </body>
    </html>
  );
}
