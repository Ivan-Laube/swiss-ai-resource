import { BrandMark } from "./BrandMark";
import { cx } from "./cx";
import styles from "./BrandLockup.module.css";

export type BrandLockupProps = {
  variant?: "header" | "footer";
  wordmark: string;
  wordmarkTld: string;
  subtitle: string;
  className?: string;
};

const markSize = {
  header: 32,
  footer: 28,
} as const;

/** Mark + wordmark + subtitle. Wrap in a Link in the shell. */
export function BrandLockup({
  variant = "header",
  wordmark,
  wordmarkTld,
  subtitle,
  className,
}: BrandLockupProps) {
  return (
    <span className={cx(styles.root, className)}>
      <BrandMark size={markSize[variant]} />
      <span className={styles.text}>
        <span className={styles.wordmark}>
          {wordmark}
          <span className={styles.tld}>{wordmarkTld}</span>
        </span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
    </span>
  );
}
