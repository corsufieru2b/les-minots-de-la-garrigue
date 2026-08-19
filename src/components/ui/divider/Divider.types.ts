import type { HTMLAttributes } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "simple" | "accent";

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
};
