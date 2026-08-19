import type { HTMLAttributes } from "react";

export type BadgeTone = "success" | "warning" | "error" | "info" | "neutral";
export type BadgeVariant = "filled" | "outline" | "soft";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  variant?: BadgeVariant;
};
