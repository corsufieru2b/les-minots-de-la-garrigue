import { cn } from "@/utils/cn";

import styles from "./Divider.module.css";
import type { DividerProps } from "./Divider.types";

export function Divider({ className, orientation = "horizontal", variant = "simple", ...props }: DividerProps) {
  return (
    <hr
      className={cn(styles.divider, styles[orientation], variant === "accent" && styles.accent, className)}
      aria-orientation={orientation}
      {...props}
    />
  );
}
