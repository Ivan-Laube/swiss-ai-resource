import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { getMessages, isLocale, locales } from "@/i18n";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const messages = getMessages(lang);

  return (
    <div lang={lang} className="localeShell">
      {children}
      <SiteFooter activeLang={lang} messages={messages} />
    </div>
  );
}
