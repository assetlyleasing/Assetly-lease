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

/**
 * One production setting controls the phone treatment. All three layouts are
 * kept live in CSS so a future review changes this value, not the artwork.
 */
export type HeroMobilePlateMode = "hidden" | "access" | "growth";
export const HERO_MOBILE_PLATE_MODE: HeroMobilePlateMode = "hidden";

export function HeroPlateArtwork() {
  return (
    <>
      {/*
       * ACCESS stays wholly left of the copy. The additional composition
       * transform preserves the reference-derived geometry while moving the
       * complete machine/building unit down and outward as one object.
       */}
      <g data-hero-plate-region="access">
        <g transform="translate(-20 118.4) scale(.86)">
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
        </g>
      </g>

      {/* SCALE travels below the proposition before lifting into GROW. */}
      <g data-hero-plate-region="scale">
        <path d="M450 512 C 515 545, 610 568, 720 568 C 758 568, 790 518, 820 474" />
      </g>

      {/* GROW is held to the right edge of the protected copy zone. */}
      <g data-hero-plate-region="growth">
        <path d="M820 600V474H910" />
        <path d="M940 600V360H1030" />
        <path d="M1060 600V240H1150" />
        <polyline points="820,474 940,360 1060,240 1150,165" />
        <circle data-hero-plate-node="1" cx="820" cy="474" r="5" />
        <circle data-hero-plate-node="2" cx="940" cy="360" r="5" />
        <circle data-hero-plate-node="3" cx="1060" cy="240" r="5" />
      </g>

      {/* One full-width ground datum closes every structure without doubling. */}
      <g data-hero-plate-region="datum">
        <line x1="0" y1="600" x2="1200" y2="600" />
      </g>
    </>
  );
}
