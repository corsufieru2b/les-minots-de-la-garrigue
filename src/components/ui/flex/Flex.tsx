import { cn } from "@/utils/cn";

import styles from "./Flex.module.css";
import type { FlexProps } from "./Flex.types";

const justifyMap = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
  around: styles.justifyAround,
  evenly: styles.justifyEvenly,
} as const;

const gapMap = {
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
} as const;

export function Flex({
  align = "stretch",
  className,
  direction = "row",
  gap = "md",
  justify = "start",
  wrap = false,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        styles.flex,
        styles[direction],
        styles[align],
        justifyMap[justify],
        gapMap[gap],
        wrap && styles.wrap,
        className,
      )}
      {...props}
    />
  );
}
