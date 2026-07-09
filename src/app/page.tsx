import Link from "next/link";
import { getMessages } from "@/i18n";
import styles from "./page.module.css";

export default function RootPage() {
  const messages = getMessages("de");

  return (
    <main className={styles.page}>
      <p>{messages.rootRedirect.message}</p>
      <p>
        <Link href="/de/">{messages.rootRedirect.link}</Link>
      </p>
    </main>
  );
}
