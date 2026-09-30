import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Card.module.css";

type CardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
  as?: "div" | "section" | "article";
};

export function Card({
  children,
  className,
  href,
  interactive,
  as: Tag = "div",
}: CardProps) {
  const isInteractive = Boolean(href) || interactive === true;
  const classes = cx(
    styles.root,
    isInteractive && styles.interactive,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <Tag className={classes}>{children}</Tag>;
}
