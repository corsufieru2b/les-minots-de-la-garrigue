import type { HTMLAttributes } from "react";

export type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export type SpacerProps = {
  size?: SpacerSize;
  horizontal?: boolean;
};

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  ratio?: `${number}/${number}`;
};

export type SeparatorProps = HTMLAttributes<HTMLHRElement>;

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;
