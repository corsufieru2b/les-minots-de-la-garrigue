import type { HTMLAttributes, ReactNode } from "react";

export type IconWrapperSize = "sm" | "md" | "lg" | "xl";
export type IconWrapperVariant = "filled" | "outline" | "ghost";

export type IconWrapperProps = HTMLAttributes<HTMLSpanElement> & {
  size?: IconWrapperSize;
  variant?: IconWrapperVariant;
  active?: boolean;
  children: ReactNode;
};
