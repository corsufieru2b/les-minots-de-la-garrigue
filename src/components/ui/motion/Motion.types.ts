import type { HTMLAttributes } from "react";

export type MotionProps = HTMLAttributes<HTMLDivElement> & {
  delay?: "none" | "fast" | "normal" | "slow";
};
