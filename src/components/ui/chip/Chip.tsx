import { forwardRef } from "react";

import { cn } from "@/utils/cn";

import styles from "./Chip.module.css";
import type { ChipProps } from "./Chip.types";

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, selected = false, type = "button", variant = "soft", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.chip, styles[variant], selected && styles.selected, className)}
      aria-pressed={selected}
      {...props}
    />
  );
});
