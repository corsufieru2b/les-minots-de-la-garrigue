import type { HTMLAttributes } from "react";

export type FlexDirection = "row" | "column";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export type FlexProps = HTMLAttributes<HTMLDivElement> & {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
};
