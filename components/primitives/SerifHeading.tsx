import type { ReactNode } from "react";

import styles from "./SerifHeading.module.css";

type HeadingLevel = 1 | 2 | 3 | 4;

/**
 * A DM Serif Display heading at one of the approved clamp sizes (§7).
 *
 * Heading level and visual size are separate props on purpose. Document
 * structure is an accessibility concern — one `h1` per page, no skipped levels
 * (§20) — while size is a design one, and forcing them to agree would mean
 * choosing the wrong heading level to get the right size.
 *
 * To emphasise a word, write an `<i>` in the children. globals.css colours
 * italics inside headings Moss site-wide, so the convention holds without a
 * prop:
 *
 *     <SerifHeading level={2}>Keep leverage <i>light</i>.</SerifHeading>
 */
export function SerifHeading({
  children,
  level = 2,
  size = "section",
  onDark = false,
  className,
  id,
}: {
  children: ReactNode;
  level?: HeadingLevel;
  size?: "display" | "section" | "panel";
  onDark?: boolean;
  className?: string;
  id?: string;
}) {
  const Tag = `h${level}` as const;

  const classes = [
    styles.heading,
    styles[size],
    onDark ? styles.onDark : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} id={id}>
      {children}
    </Tag>
  );
}
