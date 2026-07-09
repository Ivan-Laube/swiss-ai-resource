import { SiteHeader } from "@/components/SiteHeader";
import styles from "./page.module.css";

export default function GermanHomePage() {
  return (
    <>
      <SiteHeader activeLang="de" />
      <main className={styles.main}>
        <p className={styles.eyebrow}>Schweizer KMU · KI-Einsatz</p>
        <h1>Swiss AI Deployment Resource</h1>
        <p className={styles.lead}>
          Praxisnahe Informationen zu KI-Deployment in der Schweiz: Compliance,
          Anbietervergleich und interaktive Entscheidungshilfen.
        </p>
        <p className={styles.note}>
          Deutsch ist die kanonische Sprache dieses Projekts. EN, FR und IT folgen
          in T2.
        </p>
      </main>
    </>
  );
}
