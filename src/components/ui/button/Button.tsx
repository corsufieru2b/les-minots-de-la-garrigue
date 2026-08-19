import { forwardRef } from "react";

import { cn } from "@/utils/cn";

import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    leftIcon,
    loading = false,
    rightIcon,
    size = "md",
    type = "button",
    variant = "primary",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {leftIcon ? <span className={styles.iconSlot}>{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className={styles.iconSlot}>{rightIcon}</span> : null}
    </button>
  );
});
