import Image from "next/image";

import { cn } from "@/utils/cn";

import styles from "./Image.module.css";
import type { AppImageProps } from "./Image.types";

export function AppImage({
  alt,
  className,
  fill = false,
  loading,
  priority = false,
  sizes = "100vw",
  src,
  variant = "responsive",
  ...props
}: AppImageProps) {
  const resolvedLoading = priority ? undefined : (loading ?? "lazy");

  return (
    <div className={cn(styles.wrapper, styles[variant], className)}>
      <Image
        alt={alt}
        className={styles.image}
        fill={fill}
        loading={resolvedLoading}
        priority={priority}
        sizes={sizes}
        src={src}
        {...props}
      />
    </div>
  );
}
