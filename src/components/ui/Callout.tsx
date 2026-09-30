import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Callout.module.css";

export type CalloutTone = "info" | "warning" | "neutral";

type CalloutProps = {
  tone?: CalloutTone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

const toneClass: Record<CalloutTone, string> = {
  info: styles.info,
  warning: styles.warning,
  neutral: styles.neutral,
};

export function Callout({
  tone = "neutral",
  title,
  children,
  className,
}: CalloutProps) {
  return (
    <aside className={cx(styles.root, toneClass[tone], className)}>
      {title ? <p className={styles.title}>{title}</p> : null}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
