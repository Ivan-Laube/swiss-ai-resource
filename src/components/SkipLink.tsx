import styles from "./SkipLink.module.css";

type SkipLinkProps = {
  label: string;
};

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#main" className={styles.skipLink}>
      {label}
    </a>
  );
}
