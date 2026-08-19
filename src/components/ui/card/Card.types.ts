import type { HTMLAttributes } from "react";

export type CardVariant =
  | "classic"
  | "image"
  | "interactive"
  | "simple"
  | "premium"
  | "section"
  | "shadow"
  | "flat";

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div";
  variant?: CardVariant;
};
