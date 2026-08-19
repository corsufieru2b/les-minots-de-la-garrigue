import type { ElementType } from "react";

import { cn } from "@/utils/cn";

import styles from "./Card.module.css";
import type { CardProps } from "./Card.types";

export function Card({ as = "article", className, variant = "classic", ...props }: CardProps) {
  const Component = as as ElementType;

  return <Component className={cn(styles.card, styles[variant], className)} {...props} />;
}
