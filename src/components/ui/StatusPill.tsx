import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./StatusPill.module.css";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type StatusPillProps = {
  tone: StatusTone;
  dashed?: boolean;
  children: ReactNode;
  className?: string;
};

const toneClass: Record<StatusTone, string> = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
  neutral: styles.neutral,
};

export function StatusPill({
  tone,
  dashed = false,
  children,
  className,
}: StatusPillProps) {
  return (
    <span
      className={cx(
        styles.root,
        toneClass[tone],
        dashed && styles.dashed,
        className,
      )}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </span>
  );
}
