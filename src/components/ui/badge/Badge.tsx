import { cn } from "@/utils/cn";

import styles from "./Badge.module.css";
import type { BadgeProps } from "./Badge.types";

export function Badge({ className, tone = "neutral", variant = "soft", ...props }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], styles[tone], className)} {...props} />;
}
