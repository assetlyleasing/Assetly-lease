/**
 * The Compare argument-focus effect (SOURCE_OF_TRUTH.md §13).
 *
 * §13: "active argument = fully opaque, sharp, aligned at rest; previous/next =
 * slightly faded, subtly blurred, slightly displaced. One argument in focus per
 * screen, driven by a single RAF loop computing distance-from-viewport-center."
 *
 * The mapping from distance to appearance is pure, and kept separate from the
 * hook that measures it, so the curve can be reasoned about and tested on its
 * own rather than only through a scrolling browser.
 */

import { clamp01 } from "./drawerOpenness";

/** How much opacity a slide loses once it is a full screen off-centre. */
const MAX_FADE = 0.72;

/** §13 asks for "subtly blurred" — enough to defocus text, not to smear it. */
const MAX_BLUR_PX = 3;

/** "Slightly displaced": signed, so neighbours drift the way they are headed. */
const MAX_SHIFT_PX = 22;

export type FocusAppearance = {
  opacity: number;
  blurPx: number;
  shiftPx: number;
};

/**
 * A slide's distance from the centre of the screen, in viewport heights.
 *
 * Signed: negative above the centre line, positive below it. Zero means the
 * slide's midpoint sits exactly on it, which is the one slide in focus.
 */
export function focusDistance({
  top,
  height,
  viewportHeight,
}: {
  top: number;
  height: number;
  viewportHeight: number;
}): number {
  if (viewportHeight <= 0) return 0;
  const slideCentre = top + height / 2;
  return (slideCentre - viewportHeight / 2) / viewportHeight;
}

/**
 * How a slide at that distance should look.
 *
 * The falloff is linear and clamped at one viewport height: past that the
 * slide is off-screen and there is nothing to be gained by fading it further.
 */
export function focusAppearance(distance: number): FocusAppearance {
  const magnitude = clamp01(Math.abs(distance));
  const direction = distance < 0 ? -1 : 1;

  return {
    opacity: 1 - MAX_FADE * magnitude,
    blurPx: MAX_BLUR_PX * magnitude,
    shiftPx: MAX_SHIFT_PX * magnitude * direction,
  };
}

/**
 * The index of the slide nearest the centre line — the one in focus, and so
 * the one the calculator syncs to (§13's mode auto-sync). Ties go to the
 * earlier slide, so scrolling cannot flicker between two equidistant slides.
 */
export function nearestFocusIndex(distances: readonly number[]): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  distances.forEach((distance, index) => {
    const magnitude = Math.abs(distance);
    if (magnitude < bestDistance) {
      bestDistance = magnitude;
      best = index;
    }
  });

  return best;
}
