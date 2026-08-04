import Link from "next/link";
import type { Locale } from "@/i18n";
import type { Messages } from "@/i18n/types";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  activeLang: Locale;
  messages: Messages;
};

export function SiteFooter({ activeLang, messages }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <nav aria-label={messages.footer.navLabel}>
        <ul className={styles.list}>
          <li>
            <Link href={`/${activeLang}/impressum/`}>
              {messages.footer.impressum}
            </Link>
          </li>
          <li>
            <Link href={`/${activeLang}/datenschutz/`}>
              {messages.footer.privacy}
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
