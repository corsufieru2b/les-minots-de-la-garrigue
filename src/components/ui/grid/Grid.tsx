import { cn } from "@/utils/cn";

import styles from "./Grid.module.css";
import type { GridProps } from "./Grid.types";

const columnsClassMap = {
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
} as const;

export function Grid({ className, columns = 3, minItemWidth, style, ...props }: GridProps) {
  return (
    <div
      className={cn(styles.grid, columnsClassMap[columns], className)}
      style={{ ...style, ...(minItemWidth ? { "--grid-min-width": minItemWidth } : null) }}
      {...props}
    />
  );
}
