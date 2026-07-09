import Link from "next/link";
import { localeLabels, locales, type Locale } from "@/i18n";
import type { Messages } from "@/i18n/types";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  activeLang: Locale;
  messages: Messages;
};

export function SiteHeader({ activeLang, messages }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href={`/${activeLang}/`} className={styles.brand}>
        {messages.nav.brand}
      </Link>
      <nav aria-label={messages.nav.languagesLabel}>
        <ul className={styles.langList}>
          {locales.map((code) => (
            <li key={code}>
              <Link
                href={`/${code}/`}
                className={code === activeLang ? styles.active : undefined}
                aria-current={code === activeLang ? "page" : undefined}
                hrefLang={code}
              >
                {localeLabels[code]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
