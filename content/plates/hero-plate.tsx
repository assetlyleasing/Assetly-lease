/**
 * Hero plate — "Access → Scale → Grow" (SOURCE_OF_TRUTH.md §11, OD-02).
 *
 * §5's standing rule is that a plate must represent something real about its
 * section, never decorate it. This one is read left to right as the three words
 * of the tagline, in the register §11 asks for — an architectural/engineering
 * drawing rather than an infographic, with no arrowheads, labels, axes or
 * anything else that would turn it into a chart:
 *
 *   Access  — a modular open framework on the left: the asset itself, drawn as
 *             equipment resting on the ground datum, open rather than sealed
 *             because the business uses it without owning it.
 *   Scale   — the long rising curve leaving the asset's flank: the lease
 *             structure carrying the business from that first asset outward.
 *   Grow    — three open frames stepping up and away, each taller than the
 *             last and none closed at the top, with the rising line running
 *             through their corners and continuing past the final frame.
 *
 * The dimension run beneath the asset and the left-hand datum edge are the
 * drafting conventions that make it read as a measured drawing.
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
      {/* Ground datum and the left-hand drawing edge. */}
      <line x1="60" y1="560" x2="1140" y2="560" />
      <line x1="60" y1="200" x2="60" y2="560" />

      {/* ACCESS — the asset: an open modular frame standing on the datum. */}
      <path d="M120 560 L120 384 L380 384 L380 560" />
      <line x1="98" y1="384" x2="402" y2="384" />
      <line x1="120" y1="470" x2="380" y2="470" />
      <line x1="250" y1="470" x2="250" y2="560" />

      {/* Dimension run — the span being accessed, not owned. */}
      <line x1="120" y1="560" x2="120" y2="596" />
      <line x1="380" y1="560" x2="380" y2="596" />
      <line x1="120" y1="584" x2="380" y2="584" />

      {/* SCALE — the lease path leaving the asset and rising away. */}
      <path d="M380 455 C 512 455, 566 420, 700 420" />

      {/* GROW — three open frames, each taller, none closed at the top. */}
      <path d="M700 560 L700 420 L820 420" />
      <path d="M850 560 L850 330 L970 330" />
      <path d="M1000 560 L1000 220 L1120 220" />

      {/* The rise carried through their corners and out past the last frame. */}
      <polyline points="700,420 850,330 1000,220 1092,152" />

      {/* Nodes at the junctions the ambient drift will later breathe against. */}
      <circle cx="380" cy="455" r="5" />
      <circle cx="700" cy="420" r="5" />
      <circle cx="850" cy="330" r="5" />
      <circle cx="1000" cy="220" r="5" />
    </>
  );
}
