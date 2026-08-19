import type { HTMLAttributes } from "react";

export type StackSpacing = "xs" | "sm" | "md" | "lg" | "xl";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  spacing?: StackSpacing;
};
