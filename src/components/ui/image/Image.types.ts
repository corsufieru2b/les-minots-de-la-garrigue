import type { ImageProps } from "next/image";

export type AppImageVariant = "responsive" | "rounded" | "card" | "hero";

export type AppImageProps = Omit<ImageProps, "fill"> & {
  variant?: AppImageVariant;
  fill?: boolean;
};
