import type { SVGProps } from "react";
import { cx } from "./cx";
import styles from "./BrandMark.module.css";

export type BrandMarkProps = {
  size?: number;
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "width" | "height" | "children" | "viewBox">;

function markA11y(title?: string) {
  if (title) {
    return { role: "img" as const, "aria-label": title };
  }
  return { "aria-hidden": true as const, focusable: false as const };
}

/** Red rounded square with white sparkles (Appendix A). Fill follows `--accent`. */
export function BrandMark({
  size = 32,
  className,
  title,
  ...rest
}: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cx(styles.mark, className)}
      {...markA11y(title)}
      {...rest}
    >
      <rect width="64" height="64" rx="13" fill="currentColor" />
      <path
        fill="#fff"
        d="M38.5 16.5C40.66 27.84 40.66 27.84 52.0 30C40.66 32.16 40.66 32.16 38.5 43.5C36.34 32.16 36.34 32.16 25.0 30C36.34 27.84 36.34 27.84 38.5 16.5ZM19.5 14.5C20.54 19.96 20.54 19.96 26.0 21C20.54 22.04 20.54 22.04 19.5 27.5C18.46 22.04 18.46 22.04 13.0 21C18.46 19.96 18.46 19.96 19.5 14.5Z"
      />
      <circle cx="19" cy="45" r="2.8" fill="#fff" />
    </svg>
  );
}
