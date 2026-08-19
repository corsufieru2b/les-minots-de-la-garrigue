import type { HTMLAttributes } from "react";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement>;
export type SkeletonProps = HTMLAttributes<HTMLDivElement>;
export type LoadingDotsProps = HTMLAttributes<HTMLDivElement>;
export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
};
