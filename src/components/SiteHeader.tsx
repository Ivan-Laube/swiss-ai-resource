"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LanguageControl } from "@/components/LanguageControl";
import {
  BrandLockup,
  Button,
  Container,
  IconMenu,
  IconX,
} from "@/components/ui";
import { cx } from "@/components/ui/cx";
import { LEGAL_SLUGS } from "@/content/legal";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/types";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  activeLang: Locale;
  /** Only the nav strings — the full catalogue must not reach the client. */
  nav: Messages["nav"];
  availableLocales?: readonly Locale[];
};

type NavSection = "guides" | "tools" | "vendors" | "survey" | "websiteCheck";

function activeSection(pathname: string): NavSection | null {
  const segments = pathname.split("/").filter(Boolean);
  // /{lang}/… → section is the first path segment after the locale
  const section = segments[1];

  if (!section) {
    return null;
  }
  if (section === "guides") {
    return "guides";
  }
  if (section === "tools") {
    return "tools";
  }
  if (section === "vendors") {
    return "vendors";
  }
  if (section === "survey" || section === "benchmark") {
    return "survey";
  }
  if (section === "website-check") {
    return "websiteCheck";
  }
  if (LEGAL_SLUGS.has(section)) {
    return null;
  }
  // Published guide slug under /[lang]/[slug]/
  return "guides";
}

function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

/** "page" on the section's own URL, "true" anywhere else inside the section. */
function ariaCurrentFor(
  isCurrent: boolean,
  href: string,
  pathname: string,
): "page" | "true" | undefined {
  if (!isCurrent) {
    return undefined;
  }
  return withTrailingSlash(pathname) === href ? "page" : "true";
}

export function SiteHeader({
  activeLang,
  nav,
  availableLocales,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const section = activeSection(pathname);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const lastPathname = useRef(pathname);

  // Close the menu after client-side navigation. Skip the initial mount so a
  // tap that opened the menu before hydration isn't undone.
  useEffect(() => {
    if (lastPathname.current === pathname) {
      return;
    }
    lastPathname.current = pathname;
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }, [pathname]);

  const navItems: { id: NavSection; href: string; label: string }[] = [
    { id: "guides", href: `/${activeLang}/guides/`, label: nav.guides },
    { id: "tools", href: `/${activeLang}/tools/`, label: nav.tools },
    { id: "vendors", href: `/${activeLang}/vendors/`, label: nav.vendors },
    { id: "survey", href: `/${activeLang}/survey/`, label: nav.survey },
  ];

  const ctaHref = `/${activeLang}/website-check/`;
  const ctaCurrent = ariaCurrentFor(
    section === "websiteCheck",
    ctaHref,
    pathname,
  );

  const renderNavList = () => (
    <ul className={styles.navList}>
      {navItems.map((item) => {
        const isCurrent = section === item.id;
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cx(styles.navLink, isCurrent && styles.current)}
              aria-current={ariaCurrentFor(isCurrent, item.href, pathname)}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderLanguageControl = () => (
    <LanguageControl
      activeLang={activeLang}
      availableLocales={availableLocales}
      languagesLabel={nav.languagesLabel}
    />
  );

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link
          href={`/${activeLang}/`}
          className={styles.brand}
          aria-label={nav.brand}
        >
          <BrandLockup
            variant="header"
            wordmark={nav.wordmark}
            wordmarkTld={nav.wordmarkTld}
            subtitle={nav.brandSubtitle}
          />
        </Link>

        <nav className={styles.mainNav} aria-label={nav.mainLabel}>
          {renderNavList()}
        </nav>

        <div className={styles.desktopLang}>{renderLanguageControl()}</div>

        <Button
          href={ctaHref}
          className={styles.cta}
          aria-current={ctaCurrent}
        >
          {nav.websiteCheck}
        </Button>

        <details ref={menuRef} className={styles.menu}>
          <summary className={styles.menuSummary} aria-label={nav.menu}>
            <IconMenu className={styles.iconOpen} aria-hidden />
            <IconX className={styles.iconClose} aria-hidden />
          </summary>
          <div className={styles.menuPanel}>
            <Container className={styles.menuPanelInner}>
              <Button
                href={ctaHref}
                className={styles.menuCta}
                aria-current={ctaCurrent}
              >
                {nav.websiteCheck}
              </Button>
              <nav className={styles.menuNav} aria-label={nav.mainLabel}>
                {renderNavList()}
              </nav>
              {renderLanguageControl()}
            </Container>
          </div>
        </details>
      </Container>
    </header>
  );
}
