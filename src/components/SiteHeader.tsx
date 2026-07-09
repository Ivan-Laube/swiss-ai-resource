import Link from "next/link";
import styles from "./SiteHeader.module.css";

const languages = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
] as const;

type SiteHeaderProps = {
  activeLang?: (typeof languages)[number]["code"];
};

export function SiteHeader({ activeLang = "de" }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href={`/${activeLang}/`} className={styles.brand}>
        Swiss AI Resource
      </Link>
      <nav aria-label="Sprachen">
        <ul className={styles.langList}>
          {languages.map(({ code, label }) => (
            <li key={code}>
              <Link
                href={`/${code}/`}
                className={code === activeLang ? styles.active : undefined}
                aria-current={code === activeLang ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
