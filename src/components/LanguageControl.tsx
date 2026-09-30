"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "@/components/ui/cx";
// Import from config/path directly: the "@/i18n" barrel pulls every message
// catalogue into the client bundle.
import {
  hrefLangTags,
  localeLabels,
  locales,
  type Locale,
} from "@/i18n/config";
import { pathForLocale } from "@/i18n/path";
import styles from "./LanguageControl.module.css";

type LanguageControlProps = {
  activeLang: Locale;
  availableLocales?: readonly Locale[];
  languagesLabel: string;
};

export function LanguageControl({
  activeLang,
  availableLocales = locales,
  languagesLabel,
}: LanguageControlProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <nav className={styles.root} aria-label={languagesLabel}>
      <ul className={styles.track}>
        {availableLocales.map((code) => {
          const isCurrent = code === activeLang;
          return (
            <li key={code}>
              <Link
                href={`${pathForLocale(pathname, code)}${hash}`}
                className={cx(styles.segment, isCurrent && styles.active)}
                aria-current={isCurrent ? "true" : undefined}
                hrefLang={hrefLangTags[code]}
              >
                {localeLabels[code]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
