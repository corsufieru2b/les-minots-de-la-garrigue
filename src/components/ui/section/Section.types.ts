import type { HTMLAttributes } from "react";

import type { ContainerSize } from "../container";

export type SectionBackground = "background" | "surface" | "surfaceAlt" | "transparent";
export type SectionAlign = "left" | "center" | "right";
export type SectionSpacing = "sm" | "md" | "lg" | "xl";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  background?: SectionBackground;
  containerSize?: ContainerSize;
  align?: SectionAlign;
  spacing?: SectionSpacing;
};
