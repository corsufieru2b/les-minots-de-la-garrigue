import type { HTMLAttributes } from "react";

export type SurfaceVariant = "default" | "elevated" | "outline" | "filled";

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
};
