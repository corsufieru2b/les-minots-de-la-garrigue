import type { ButtonHTMLAttributes } from "react";

export type ChipVariant = "filled" | "outline" | "soft";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  variant?: ChipVariant;
};
