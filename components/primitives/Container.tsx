import type { ElementType, ReactNode } from "react";

import styles from "./Container.module.css";

/**
 * Applies the §9 page gutter. Every section's horizontal alignment comes from
 * here so the nav, the footer, and the sections between them share one edge.
 */
export function Container({
  children,
  as: Tag = "div",
  bleed = false,
  className,
}: {
  children: ReactNode;
  /** Element to render. Use a landmark tag where one is meaningful. */
  as?: ElementType;
  /** Drop the maximum measure for a genuinely full-bleed section. */
  bleed?: boolean;
  className?: string;
}) {
  const classes = [
    styles.container,
    bleed ? styles.bleed : styles.wide,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
