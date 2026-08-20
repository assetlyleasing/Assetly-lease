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
 *
 * The curve has a locked zone at its centre. Read literally, "at rest" is a
 * single point — the frame where a slide's midpoint crosses the centre line —
 * and a slide the reader has settled on then loses sharpness to any movement at
 * all. On a phone that is most of the time: ordinary thumb scrolling never
 * parks a slide on one exact pixel, so the copy the reader is actually reading
 * spends its life a little blurred. So each slide holds its resting appearance
 * across a band around the centre line and only starts its transition beyond
 * it, which is also what gives the section its sense of four settled states
 * rather than one continuous smear.
 */

import { clamp01 } from "./drawerOpenness";

/** How much opacity a slide loses once it is a full screen off-centre. */
const MAX_FADE = 0.72;

/** §13 asks for "subtly blurred" — enough to defocus text, not to smear it. */
const MAX_BLUR_PX = 3;

/** "Slightly displaced": signed, so neighbours drift the way they are headed. */
const MAX_SHIFT_PX = 22;

/**
 * The locked band, as a fraction of the viewport height either side of the
 * centre line. A slide inside it is exactly at rest: opaque, sharp, unmoved.
 *
 * On a 900px window that is ~230px of scroll — far more than the few pixels a
 * trackpad or a settling smooth-scroll moves, and enough that leaving the state
 * reads as a decision rather than a twitch.
 */
export const FOCUS_LOCK_DESKTOP = 0.26;

/**
 * Mobile locks harder. The slide is a full `100svh` there and the copy sits
 * directly under the reader's thumb, so §13's "content clarity first" needs a
 * band that survives a normal flick — ~0.34 of an 844px screen is ~287px.
 */
export const FOCUS_LOCK_MOBILE = 0.34;

/**
 * Where the transition finishes, as a fraction of the viewport height. Short of
 * 1 on purpose: by the time the next slide is close to its own locked band the
 * outgoing one should already be fully faded, not still resolving.
 */
const FOCUS_FULL = 0.86;

/**
 * How much closer a rival slide must be before it takes over as the focused one
 * (in viewport heights). Without it the calculator's mode can flip back and
 * forth on a single jittery frame at the midpoint between two slides.
 */
export const FOCUS_SWITCH_MARGIN = 0.08;

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
 * How far through its transition a slide at this distance is: 0 anywhere inside
 * the locked band, then rising to 1 by `FOCUS_FULL`.
 *
 * Exported for the tests, which assert the lock rather than infer it from three
 * separate appearance values.
 */
export function focusProgress(distance: number, lock = FOCUS_LOCK_DESKTOP): number {
  const magnitude = Math.abs(distance);
  const locked = Math.min(Math.max(lock, 0), FOCUS_FULL - 0.05);
  if (magnitude <= locked) return 0;
  return clamp01((magnitude - locked) / (FOCUS_FULL - locked));
}

/**
 * How a slide at that distance should look.
 *
 * Flat through the locked band, then a linear falloff to the maximum, so the
 * moment the transition begins is felt but never snaps.
 */
export function focusAppearance(
  distance: number,
  lock = FOCUS_LOCK_DESKTOP,
): FocusAppearance {
  const progress = focusProgress(distance, lock);
  const direction = distance < 0 ? -1 : 1;
  const shiftPx = MAX_SHIFT_PX * progress * direction;

  return {
    opacity: 1 - MAX_FADE * progress,
    blurPx: MAX_BLUR_PX * progress,
    // Inside the band the direction still applies, and above the centre line it
    // turns a zero shift into -0. Harmless in CSS, but it makes two identical
    // resting states compare unequal.
    shiftPx: shiftPx === 0 ? 0 : shiftPx,
  };
}

/**
 * The index of the slide nearest the centre line — the one in focus, and so
 * the one the calculator syncs to (§13's mode auto-sync). Ties go to the
 * earlier slide, so scrolling cannot flicker between two equidistant slides.
 *
 * Given the currently focused index, the answer is sticky: a rival has to be
 * closer by `FOCUS_SWITCH_MARGIN` to take over, so the mode changes once per
 * boundary crossing instead of oscillating across it.
 */
export function nearestFocusIndex(
  distances: readonly number[],
  current?: number,
): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  distances.forEach((distance, index) => {
    const magnitude = Math.abs(distance);
    if (magnitude < bestDistance) {
      bestDistance = magnitude;
      best = index;
    }
  });

  if (current === undefined || current === best) return best;

  const held = distances[current];
  if (held === undefined || !Number.isFinite(held)) return best;

  return Math.abs(held) - bestDistance > FOCUS_SWITCH_MARGIN ? best : current;
}
