import { cn } from "@/utils/cn";

import styles from "./IconWrapper.module.css";
import type { IconWrapperProps } from "./IconWrapper.types";

export function IconWrapper({
  active = false,
  children,
  className,
  size = "md",
  variant = "ghost",
  ...props
}: IconWrapperProps) {
  return (
    <span
      className={cn(styles.root, styles[size], styles[variant], active && styles.active, className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
}
