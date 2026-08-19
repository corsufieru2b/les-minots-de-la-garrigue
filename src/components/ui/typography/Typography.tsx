import type { ElementType } from "react";

import { cn } from "@/utils/cn";

import styles from "./Typography.module.css";
import type { TypographyProps, TypographyVariant } from "./Typography.types";

const defaultTagByVariant: Record<TypographyVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  bodyLarge: "p",
  body: "p",
  small: "small",
  caption: "span",
};

export function Typography<C extends ElementType = "p">({
  as,
  children,
  className,
  tone = "primary",
  variant = "body",
  ...props
}: TypographyProps<C>) {
  const Component = (as ?? defaultTagByVariant[variant]) as ElementType;

  return (
    <Component className={cn(styles.root, styles[variant], styles[tone], className)} {...props}>
      {children}
    </Component>
  );
}
