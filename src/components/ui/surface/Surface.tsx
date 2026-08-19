import { cn } from "@/utils/cn";

import styles from "./Surface.module.css";
import type { SurfaceProps } from "./Surface.types";

export function Surface({ className, variant = "default", ...props }: SurfaceProps) {
  return <div className={cn(styles.surface, styles[variant], className)} {...props} />;
}
