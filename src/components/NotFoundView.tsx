"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleOrDefault, getMessages } from "@/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import styles from "./NotFoundView.module.css";

export function NotFoundView() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const lang = getLocaleOrDefault(segment);
  const messages = getMessages(lang);

  return (
    <div lang={lang} className="localeShell">
      <SiteHeader activeLang={lang} messages={messages} />
      <main className={styles.main}>
        <h1>{messages.notFound.title}</h1>
        <p>{messages.notFound.message}</p>
        <p>
          <Link href={`/${lang}/`}>{messages.notFound.homeLink}</Link>
        </p>
      </main>
    </div>
  );
}
