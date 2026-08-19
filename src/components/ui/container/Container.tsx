import { cn } from "@/utils/cn";

import styles from "./Container.module.css";
import type { ContainerProps } from "./Container.types";

const sizeClassMap = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  "2xl": styles.twoXl,
} as const;

export function Container({ centered = false, className, size = "lg", ...props }: ContainerProps) {
  return (
    <div className={cn(styles.container, sizeClassMap[size], centered && styles.centered, className)} {...props} />
  );
}
