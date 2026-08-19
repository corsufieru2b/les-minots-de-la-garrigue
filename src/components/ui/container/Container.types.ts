import type { HTMLAttributes } from "react";

export type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize;
  centered?: boolean;
};
