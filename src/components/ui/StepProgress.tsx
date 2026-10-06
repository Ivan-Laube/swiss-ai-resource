import { cx } from "./cx";
import styles from "./StepProgress.module.css";

type StepProgressProps = {
  label: string;
  value: number;
  max: number;
  min?: number;
  /** Announce label changes to screen readers. */
  live?: boolean;
  className?: string;
};

/**
 * Step/progress tracker that sticks below the site header while the
 * surrounding form or tool scrolls, so visitors always see where they are.
 */
export function StepProgress({
  label,
  value,
  max,
  min = 0,
  live = false,
  className,
}: StepProgressProps) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cx(styles.root, className)} aria-live={live ? "polite" : undefined}>
      <p className={styles.label}>{label}</p>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
