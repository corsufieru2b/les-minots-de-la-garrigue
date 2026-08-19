import { cn } from "@/utils/cn";

import styles from "./Stack.module.css";
import type { StackProps } from "./Stack.types";

export function HStack({ className, spacing = "md", ...props }: StackProps) {
  return <div className={cn(styles.base, styles.horizontal, styles[spacing], className)} {...props} />;
}

export function VStack({ className, spacing = "md", ...props }: StackProps) {
  return <div className={cn(styles.base, styles.vertical, styles[spacing], className)} {...props} />;
}

export function CenteredStack({ className, spacing = "md", ...props }: StackProps) {
  return <div className={cn(styles.base, styles.vertical, styles.centered, styles[spacing], className)} {...props} />;
}

export function SpaceBetweenStack({ className, spacing = "md", ...props }: StackProps) {
  return <div className={cn(styles.base, styles.horizontal, styles.spaceBetween, styles[spacing], className)} {...props} />;
}
