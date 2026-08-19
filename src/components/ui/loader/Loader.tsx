import { cn } from "@/utils/cn";

import styles from "./Loader.module.css";
import type { LoadingDotsProps, ProgressProps, SkeletonProps, SpinnerProps } from "./Loader.types";

export function Spinner({ className, ...props }: SpinnerProps) {
  return <span className={cn(styles.spinner, className)} role="status" aria-label="Loading" {...props} />;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn(styles.skeleton, className)} aria-hidden="true" {...props} />;
}

export function LoadingDots({ className, ...props }: LoadingDotsProps) {
  return (
    <div className={cn(styles.dots, className)} role="status" aria-label="Loading" {...props}>
      <span />
      <span />
      <span />
    </div>
  );
}

export function Progress({ className, value, ...props }: ProgressProps) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn(styles.progressTrack, className)} role="progressbar" aria-valuenow={boundedValue} aria-valuemin={0} aria-valuemax={100} {...props}>
      <span className={styles.progressBar} style={{ width: `${boundedValue}%` }} />
    </div>
  );
}
