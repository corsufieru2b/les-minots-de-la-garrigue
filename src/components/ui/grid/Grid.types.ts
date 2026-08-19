import type { HTMLAttributes } from "react";

export type GridColumns = 2 | 3 | 4;

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: GridColumns;
  minItemWidth?: string;
};
