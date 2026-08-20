import type { CSSProperties, ReactNode } from "react";

import styles from "./Plate.module.css";

/**
 * A traced-line plate: the site's recurring illustration device (§5).
 *
 * Generic on purpose. The Hero (Phase 2), the four Compare argument slides
 * (Phase 4) and the six sector cards (Phase 6) all pass their own artwork as
 * children and share this draw behaviour unchanged — `MASTER_PLAN.md` makes
 * that reuse a Phase 2 exit criterion.
 *
 * Artwork children need no attributes of their own: the stylesheet supplies
 * fill, stroke, width and the dash animation to every stroked shape. Author
 * geometry only.
 *
 *     <Plate viewBox="0 0 100 100" drawn={inView}>
 *       <path d="M10 90 L50 20 L90 90" />
 *     </Plate>
 *
 * Always `aria-hidden`: a plate is texture that means something to a sighted
 * reader, never content. Whatever it illustrates is already said in the
 * section's real copy, so announcing it would only duplicate (§20).
 */
export function Plate({
  children,
  viewBox,
  drawn = false,
  opacity,
  strokeWidth,
  dashLength,
  duration,
  className,
  preserveAspectRatio,
}: {
  /** The artwork: paths, lines, polylines. Geometry only. */
  children: ReactNode;
  viewBox: string;
  /** Draws the plate. Drive from `useDrawOnEnter` or a section's own state. */
  drawn?: boolean;
  /** Settled opacity. §11 puts the Hero plate at 0.16, which is the default. */
  opacity?: number;
  strokeWidth?: number;
  /**
   * Dash length used to hide the strokes before they draw. The §8 default of
   * 2200 covers any path shorter than that; raise it for longer artwork, or
   * the stroke will repeat instead of drawing once.
   */
  dashLength?: number;
  /** Draw duration. Defaults to `--dur-draw` (2.6s per §8). */
  duration?: string;
  className?: string;
  preserveAspectRatio?: string;
}) {
  const style = {
    ...(opacity !== undefined ? { "--plate-opacity": opacity } : {}),
    ...(strokeWidth !== undefined ? { "--plate-stroke": strokeWidth } : {}),
    ...(dashLength !== undefined ? { "--plate-dash": dashLength } : {}),
    ...(duration !== undefined ? { "--plate-draw-duration": duration } : {}),
  } as CSSProperties;

  const classes = [styles.plate, drawn ? styles.go : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={classes}
      style={style}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
