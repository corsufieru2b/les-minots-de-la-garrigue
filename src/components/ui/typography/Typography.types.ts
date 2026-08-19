import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bodyLarge"
  | "body"
  | "small"
  | "caption";

export type TypographyTone = "primary" | "secondary";

export type TypographyProps<C extends ElementType = "p"> = {
  as?: C;
  children: ReactNode;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  className?: string | undefined;
} & Omit<ComponentPropsWithoutRef<C>, "as" | "children" | "className">;
