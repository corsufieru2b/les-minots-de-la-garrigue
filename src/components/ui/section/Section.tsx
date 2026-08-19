import { cn } from "@/utils/cn";

import { Container } from "../container";
import styles from "./Section.module.css";
import type { SectionProps } from "./Section.types";

export function Section({
  align = "left",
  background = "transparent",
  children,
  className,
  containerSize = "lg",
  spacing = "lg",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(styles.section, styles[background], styles[align], styles[spacing], className)}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
