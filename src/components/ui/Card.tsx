import Link from "next/link";
import type { AriaAttributes, ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Card.module.css";

type CardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
  as?: "div" | "section" | "article";
  id?: string;
} & AriaAttributes;

export function Card({
  children,
  className,
  href,
  interactive,
  as: Tag = "div",
  ...rest
}: CardProps) {
  const isInteractive = Boolean(href) || interactive === true;
  const classes = cx(
    styles.root,
    isInteractive && styles.interactive,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  // Forwarding aria-* matters for `as="section"`: without an accessible
  // name (aria-labelledby) a <section> is not exposed as a region.
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
