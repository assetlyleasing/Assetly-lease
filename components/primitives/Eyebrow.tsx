import type { ElementType, ReactNode } from "react";

import styles from "./Eyebrow.module.css";

/**
 * A small uppercase label in the §7 UI voice.
 *
 * Defaults to a `<span>`. Where the eyebrow genuinely titles a group of links
 * — the Footer's "Explore" and "Company" — pass a heading element so the
 * grouping is real structure and not just a visual cue (§20).
 */
export function Eyebrow({
  children,
  as: Tag = "span",
  onDark = false,
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Recolour for the Pitch surfaces: scrolled nav and footer. */
  onDark?: boolean;
  className?: string;
  id?: string;
}) {
  const classes = [styles.eyebrow, onDark ? styles.onDark : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} id={id}>
      {children}
    </Tag>
  );
}
