import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n";

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

  return <div lang={lang}>{children}</div>;
}
