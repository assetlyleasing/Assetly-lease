/**
 * Hero plate — "Access → Scale → Grow" (SOURCE_OF_TRUTH.md §11, OD-02, DEC-037).
 *
 * §5's standing rule is that a plate must represent something real about its
 * section, never decorate it. This one is read left to right as the three words
 * of the tagline, in the register §11 asks for — an architectural/engineering
 * drawing rather than an infographic, with no arrowheads, labels, axes or
 * anything else that would turn it into a chart:
 *
 *   Access  — a mobile crane on its wheels on the ground datum, boom out and
 *             working over a floored building at the far left. Equipment in use
 *             rather than owned, put against the thing it is being used on.
 *   Scale   — the long rising curve leaving the crane's deck: the lease
 *             structure carrying the business from that first asset outward.
 *   Grow    — three open frames stepping up and away, each taller than the
 *             last and none closed at the top, with the rising line running
 *             through their corners and continuing past the final frame.
 *
 * The dimension run beneath the crane and the building measures the whole span
 * being accessed, and is the drafting convention that makes the drawing read as
 * measured rather than illustrated.
 *
 * Neither the crane nor the building is an approximation of the reference's —
 * both are that drawing, placed on this plate's datum. The crane is mirrored
 * about its own bounding box so the boom reaches back across the plate rather
 * than out of it. Every coordinate is `reference/home-2.html`'s hero plate
 * under a recorded transform, so the geometry can be re-derived rather than
 * guessed at:
 *
 *   crane     `x' = 660 - 0.95x`, `y' = 297.8 + 0.95y`   (mirrored)
 *   building  `x' = 70 + 1.25(x - 810)`, floors kept at the reference's own
 *             spacing and one more storey added rather than stretched
 *
 * Geometry only: `Plate` supplies stroke, fill, width and the draw animation.
 *
 * Authored in-house rather than supplied by a designer. `OD-02` therefore stays
 * open pending design review — see `PROGRESS.md`.
 */
export const HERO_PLATE_VIEWBOX = "0 0 1200 700";

export function HeroPlateArtwork() {
  return (
    <>
      {/* Ground datum. */}
      <line x1="60" y1="560" x2="1140" y2="560" />

      {/*
       * ACCESS — the building the asset is working on, at the far left, and
       * the crane working over it. The reference's floored tower, opened at
       * the bottom so the datum closes it the way the reference does.
       */}
      <path d="M70 560V372H205V560" />
      <path d="M70 394.4H205M70 435.8H205M70 477.2H205M70 518.6H205" />

      <path d="M546 560V457.4H447.2V560" />
      <path d="M546 457.4L477.6 402.3H371.2V457.4" />
      <path d="M371.2 402.3L120.4 305.4" />
      <path d="M120.4 305.4L102.4 345.3L138.5 360.5Z" />
      <path d="M477.6 402.3V360.5H302.8M302.8 360.5V402.3" />
      <path d="M422.5 360.5V324.4H194.5V360.5" />
      <circle cx="502.3" cy="516.3" r="31.4" />
      <circle cx="502.3" cy="516.3" r="11.4" />
      <circle cx="413" cy="516.3" r="31.4" />
      <circle cx="413" cy="516.3" r="11.4" />

      {/* Dimension run — the span being accessed, not owned. */}
      <line x1="70" y1="560" x2="70" y2="596" />
      <line x1="546" y1="560" x2="546" y2="596" />
      <line x1="70" y1="584" x2="546" y2="584" />

      {/* SCALE — the lease path leaving the crane's deck and rising away. */}
      <path d="M546 457.4 C 600 457.4, 645 420, 700 420" />

      {/* GROW — three open frames, each taller, none closed at the top. */}
      <path d="M700 560 L700 420 L820 420" />
      <path d="M850 560 L850 330 L970 330" />
      <path d="M1000 560 L1000 220 L1120 220" />

      {/* The rise carried through their corners and out past the last frame. */}
      <polyline points="700,420 850,330 1000,220 1092,152" />

      {/* Nodes at the junctions the ambient drift will later breathe against. */}
      <circle cx="546" cy="457.4" r="5" />
      <circle cx="700" cy="420" r="5" />
      <circle cx="850" cy="330" r="5" />
      <circle cx="1000" cy="220" r="5" />
    </>
  );
}
