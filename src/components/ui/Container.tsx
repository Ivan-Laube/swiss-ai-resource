import type { ReactNode } from "react";
import { cx } from "./cx";
import styles from "./Container.module.css";

type ContainerProps = {
  as?: "div" | "section";
  children: ReactNode;
  className?: string;
};

export function Container({
  as: Tag = "div",
  children,
  className,
}: ContainerProps) {
  return <Tag className={cx(styles.root, className)}>{children}</Tag>;
}
