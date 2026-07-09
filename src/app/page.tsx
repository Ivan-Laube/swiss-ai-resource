import Link from "next/link";
import styles from "./page.module.css";

export default function RootPage() {
  return (
    <main className={styles.page}>
      <p>Weiterleitung zur deutschen Startseite …</p>
      <p>
        <Link href="/de/">Zur Startseite (DE)</Link>
      </p>
    </main>
  );
}
