import Link from "next/link";
import { BrandLockup, Container } from "@/components/ui";
import type { Locale } from "@/i18n";
import { formatIsoDate } from "@/lib/format-date";
import styles from "./SiteFooter.module.css";

export type SiteFooterLink = {
  href: string;
  label: string;
};

export type SiteFooterModel = {
  activeLang: Locale;
  brandLabel: string;
  brandDescription: string;
  wordmark: string;
  wordmarkTld: string;
  brandSubtitle: string;
  navLabel: string;
  colGuides: string;
  colTools: string;
  colData: string;
  colLegal: string;
  guides: SiteFooterLink[];
  tools: SiteFooterLink[];
  data: SiteFooterLink[];
  legal: SiteFooterLink[];
  lastSourceIso: string | null;
  lastSourceBefore: string;
  lastSourceAfter: string;
  disclaimer: string;
  copyright: string;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly SiteFooterLink[];
}) {
  return (
    <nav className={styles.column} aria-label={title}>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Presentational footer — safe for client components (no fs). */
export function SiteFooterView({ model }: { model: SiteFooterModel }) {
  const {
    activeLang,
    brandLabel,
    brandDescription,
    wordmark,
    wordmarkTld,
    brandSubtitle,
    navLabel,
    colGuides,
    colTools,
    colData,
    colLegal,
    guides,
    tools,
    data,
    legal,
    lastSourceIso,
    lastSourceBefore,
    lastSourceAfter,
    disclaimer,
    copyright,
  } = model;

  return (
    <footer className={styles.footer} aria-label={navLabel}>
      <Container className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandColumn}>
            <Link
              href={`/${activeLang}/`}
              className={styles.brand}
              aria-label={brandLabel}
            >
              <BrandLockup
                variant="footer"
                wordmark={wordmark}
                wordmarkTld={wordmarkTld}
                subtitle={brandSubtitle}
              />
            </Link>
            <p className={styles.brandDescription}>{brandDescription}</p>
            {lastSourceIso ? (
              <p className={styles.lastSourceCheck} data-visual-mask>
                {lastSourceBefore}
                <time dateTime={lastSourceIso}>
                  {formatIsoDate(lastSourceIso, activeLang)}
                </time>
                {lastSourceAfter}
              </p>
            ) : null}
          </div>

          <FooterColumn title={colGuides} links={guides} />
          <FooterColumn title={colTools} links={tools} />
          <FooterColumn title={colData} links={data} />
          <FooterColumn title={colLegal} links={legal} />
        </div>

        <div className={styles.bottom}>
          <p className={styles.disclaimer}>{disclaimer}</p>
          <p className={styles.copyright} data-visual-mask>
            {copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
