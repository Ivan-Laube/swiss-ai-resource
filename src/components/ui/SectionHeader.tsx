import type { ReactNode } from "react";
import { Button } from "./Button";
import { cx } from "./cx";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: { href: string; label: ReactNode };
  headingLevel?: 2 | 3;
  className?: string;
};

export function SectionHeader({
  kicker,
  title,
  lead,
  action,
  headingLevel = 2,
  className,
}: SectionHeaderProps) {
  const HeadingTag = headingLevel === 3 ? "h3" : "h2";

  return (
    <header className={cx(styles.root, className)}>
      <div className={styles.copy}>
        {kicker ? <p className={cx("kicker", styles.kicker)}>{kicker}</p> : null}
        <HeadingTag className={styles.title}>{title}</HeadingTag>
        {lead ? <p className={cx("lead", styles.lead)}>{lead}</p> : null}
      </div>
      {action ? (
        <div className={styles.action}>
          <Button variant="ghost" href={action.href}>
            {action.label}
          </Button>
        </div>
      ) : null}
    </header>
  );
}
