import { cn } from "@/utils/cn";

import styles from "./Motion.module.css";
import type { MotionProps } from "./Motion.types";

type MotionVariant = "fade" | "slide" | "reveal" | "scale";

const delayClassMap = {
  none: styles.delayNone,
  fast: styles.delayFast,
  normal: styles.delayNormal,
  slow: styles.delaySlow,
} as const;

function MotionPrimitive({
  className,
  delay = "none",
  variant,
  ...props
}: MotionProps & { variant: MotionVariant }) {
  return (
    <div
      className={cn(styles.base, styles.show, styles[variant], delayClassMap[delay], className)}
      {...props}
    />
  );
}

export function Fade({ ...props }: MotionProps) {
  return <MotionPrimitive variant="fade" {...props} />;
}

export function Slide({ ...props }: MotionProps) {
  return <MotionPrimitive variant="slide" {...props} />;
}

export function Reveal({ ...props }: MotionProps) {
  return <MotionPrimitive variant="reveal" {...props} />;
}

export function Scale({ ...props }: MotionProps) {
  return <MotionPrimitive variant="scale" {...props} />;
}
