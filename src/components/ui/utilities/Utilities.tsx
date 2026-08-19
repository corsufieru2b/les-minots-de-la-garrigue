import type { ReactNode } from "react";

import styles from "./Utilities.module.css";
import type { AspectRatioProps, SeparatorProps, SpacerProps, VisuallyHiddenProps } from "./Utilities.types";

const spaceValueBySize = {
  xs: "var(--space-xs)",
  sm: "var(--space-sm)",
  md: "var(--space-md)",
  lg: "var(--space-lg)",
  xl: "var(--space-xl)",
  "2xl": "var(--space-2xl)",
  "3xl": "var(--space-3xl)",
  "4xl": "var(--space-4xl)",
} as const;

export function Spacer({ horizontal = false, size = "md" }: SpacerProps) {
  const dimension = spaceValueBySize[size];

  return (
    <span
      className={styles.spacer}
      aria-hidden="true"
      style={horizontal ? { display: "inline-block", width: dimension } : { height: dimension }}
    />
  );
}

export function Separator(props: SeparatorProps) {
  return <hr className={styles.separator} {...props} />;
}

export function AspectRatio({ children, ratio = "16/9", style, ...props }: AspectRatioProps) {
  return (
    <div className={styles.aspectRatio} style={{ ...style, aspectRatio: ratio }} {...props}>
      {children}
    </div>
  );
}

export function VisuallyHidden({ children, ...props }: VisuallyHiddenProps & { children: ReactNode }) {
  return (
    <span className={styles.srOnly} {...props}>
      {children}
    </span>
  );
}

export function ScreenReaderOnly({ children, ...props }: VisuallyHiddenProps & { children: ReactNode }) {
  return (
    <span className={styles.srOnly} {...props}>
      {children}
    </span>
  );
}
