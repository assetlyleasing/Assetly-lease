/**
 * The Compare calculator's openness model (SOURCE_OF_TRUTH.md §13).
 *
 * §13 is specific that openness is "a continuous 0–1 value (not boolean),
 * recomputed every scroll frame relative to two measured zones ... with a soft
 * ~40vh easing band at each edge — a physically scrubbed panel, not a snap."
 *
 * Every calculation that model needs lives here as a pure function of numbers,
 * with no DOM and no React, because `MASTER_PLAN.md` Phase 4 requires the zone
 * boundaries, the easing bands and the override behaviour to be unit-tested
 * "independent of DOM". `useDrawerOpenness` supplies the measurements.
 *
 * All positions are viewport-relative, as `getBoundingClientRect()` returns
 * them: `sectionTop` is 0 when the section's first pixel is level with the top
 * of the window, and equal to `viewportHeight` when it is level with the
 * bottom.
 */

/** §13's "soft ~40vh easing band", as a fraction of the viewport height. */
export const OPENNESS_BAND_FRACTION = 0.4;

/** §13: a manual override "tweens to target over ~500ms cubic ease-out". */
export const OVERRIDE_TWEEN_MS = 500;

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Smooth start and finish, so neither edge of the band begins with a jerk. */
export function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function easeOutCubic(value: number): number {
  const t = clamp01(value);
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

export type ZoneMeasurement = {
  /** The Compare section's top edge, relative to the viewport. */
  sectionTop: number;
  /** Its bottom edge — which is also the top of Why Us. */
  sectionBottom: number;
  viewportHeight: number;
  /** Defaults to `OPENNESS_BAND_FRACTION` of the viewport height. */
  band?: number;
};

function bandFor({ viewportHeight, band }: ZoneMeasurement): number {
  const resolved = band ?? viewportHeight * OPENNESS_BAND_FRACTION;
  // A zero-width band would divide by zero and make every ramp instant.
  return resolved > 0 ? resolved : 1;
}

/**
 * The scroll-scrubbed openness, 0–1.
 *
 * The panel is open for exactly as long as the Compare section owns the whole
 * screen, easing in over the last band of scrolling before it does and out over
 * the first band after it stops. So the two ramps are bounded by the section's
 * own edges arriving at the far side of the viewport: the top edge reaching the
 * top of the window, and the bottom edge reaching the bottom of it.
 *
 * That boundary is not a matter of taste. DESIGN_SYSTEM §8 requires the
 * calculator to be invisible during the Hero "no matter what", and §13 has it
 * open "as Slide 01 approaches" — keying the opening band to the section merely
 * entering the viewport instead puts a half-open panel beside the Hero's
 * proposition, which is the one place on the site it must never appear. Keyed
 * this way, the panel finishes opening a few pixels before Slide 01 reaches the
 * centre line, and starts closing a few pixels after Slide 04 leaves it.
 *
 * Cross-checked against the original prototype's `computeAutoOpenness`, in
 * `assests/home-2.html`, which DESIGN_SYSTEM §8 was extracted from. The opening
 * ramp here is the same rule it used — it also completed as the section's top
 * reached the top of the window. The closing ramp is deliberately earlier: the
 * prototype held the panel fully open until Why Us filled the screen, which
 * overlays the section it is handing over to, and §13 asks instead that the
 * calculator slide away "as the visitor approaches Why Us". Where the prototype
 * and the approved spec disagree, the spec wins (DEC-001, DEC-004, DEC-005).
 *
 * Pass `snap` to collapse both bands to a threshold. `prefers-reduced-motion`
 * uses it: `MASTER_PLAN.md` Phase 4 asks for openness to become "a snap to
 * final state" under the preference rather than a scrubbed one.
 */
export function computeOpenness(
  measurement: ZoneMeasurement,
  { snap = false }: { snap?: boolean } = {},
): number {
  const { sectionTop, sectionBottom, viewportHeight } = measurement;
  const band = bandFor(measurement);

  const opening = clamp01((band - sectionTop) / band);
  const closing = clamp01((viewportHeight - sectionBottom) / band);

  if (snap) return opening >= 0.5 && closing < 0.5 ? 1 : 0;

  return clamp01(smoothstep(opening) * (1 - smoothstep(closing)));
}

/**
 * Whether the calculator exists at all.
 *
 * §13 keeps it "hidden before the section", and DESIGN_SYSTEM §8 makes the same
 * point more strongly: invisible and non-interactive during the Hero, "no
 * matter what". This is deliberately not derived from openness, because a
 * visitor who has manually closed the panel sits at openness 0 while still
 * inside the section, and the tab has to stay there for them to reopen it.
 *
 * The window it opens is exactly the one the two ramps above span, so the
 * calculator arrives as the opening band begins and leaves as the closing band
 * ends — at both of which points it is off-screen anyway.
 */
export function computeActive(measurement: ZoneMeasurement): boolean {
  const { sectionTop, sectionBottom, viewportHeight } = measurement;
  const band = bandFor(measurement);

  return sectionTop < band && sectionBottom > viewportHeight - band;
}

/** An in-flight manual override: where the tween started, and where it ends. */
export type OpennessOverride = {
  from: number;
  target: number;
  startedAt: number;
};

/**
 * Reconcile the scroll-derived value with a manual override.
 *
 * §13: "Manual override (clicking the tab) sets an override flag and tweens to
 * target over ~500ms cubic ease-out; auto-sync logic goes silent once
 * overridden." So an override does not expire when its tween finishes — it
 * holds the panel at its target for good, which is what makes "if the visitor
 * manually closes it, it stays closed until reopened" true.
 *
 * `animating` tells the caller to schedule another frame; the tween is the one
 * part of this model that advances on time rather than on scroll.
 */
export function resolveOpenness({
  auto,
  override,
  now,
  duration = OVERRIDE_TWEEN_MS,
}: {
  auto: number;
  override: OpennessOverride | null;
  now: number;
  duration?: number;
}): { value: number; animating: boolean } {
  if (!override) return { value: clamp01(auto), animating: false };

  const elapsed = now - override.startedAt;
  if (elapsed >= duration || duration <= 0) {
    return { value: clamp01(override.target), animating: false };
  }

  const progress = easeOutCubic(elapsed / duration);
  const value = override.from + (override.target - override.from) * progress;

  return { value: clamp01(value), animating: true };
}
