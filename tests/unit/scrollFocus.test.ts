import { describe, expect, it } from "vitest";

import {
  FOCUS_LOCK_DESKTOP,
  FOCUS_LOCK_MOBILE,
  FOCUS_SWITCH_MARGIN,
  focusAppearance,
  focusDistance,
  focusProgress,
  nearestFocusIndex,
} from "@/lib/motion/scrollFocus";

/**
 * §13's focus effect, and the slide-to-calculator-mode mapping that rides on
 * it — `MASTER_PLAN.md` Phase 4 lists both as unit-testable logic.
 */

const VH = 900;

describe("focusDistance", () => {
  it("is zero for a slide centred on the viewport", () => {
    expect(
      focusDistance({ top: 0, height: VH, viewportHeight: VH }),
    ).toBeCloseTo(0, 6);
  });

  it("is negative above the centre line and positive below it", () => {
    expect(
      focusDistance({ top: -VH, height: VH, viewportHeight: VH }),
    ).toBeLessThan(0);
    expect(
      focusDistance({ top: VH, height: VH, viewportHeight: VH }),
    ).toBeGreaterThan(0);
  });

  it("is measured in viewport heights, so it is resolution-independent", () => {
    const small = focusDistance({ top: 450, height: 900, viewportHeight: 900 });
    const large = focusDistance({
      top: 900,
      height: 1800,
      viewportHeight: 1800,
    });
    expect(small).toBeCloseTo(large, 6);
  });

  it("returns zero rather than NaN for a zero-height viewport", () => {
    expect(focusDistance({ top: 0, height: 0, viewportHeight: 0 })).toBe(0);
  });
});

describe("focusAppearance", () => {
  it("leaves the centred slide fully opaque, sharp and at rest (§13)", () => {
    expect(focusAppearance(0)).toEqual({
      opacity: 1,
      blurPx: 0,
      shiftPx: 0,
    });
  });

  it("fades, blurs and displaces neighbours as they leave the centre", () => {
    const near = focusAppearance(0.6);
    const far = focusAppearance(0.8);

    expect(near.opacity).toBeLessThan(1);
    expect(far.opacity).toBeLessThan(near.opacity);
    expect(far.blurPx).toBeGreaterThan(near.blurPx);
    expect(Math.abs(far.shiftPx)).toBeGreaterThan(Math.abs(near.shiftPx));
  });

  it("displaces in the direction the slide sits, not always downward", () => {
    expect(focusAppearance(-0.7).shiftPx).toBeLessThan(0);
    expect(focusAppearance(0.7).shiftPx).toBeGreaterThan(0);
  });

  it("keeps off-centre slides legible rather than blanking them", () => {
    // §13 says "slightly faded", so even a slide a full screen away is still
    // visibly present — this is a focus effect, not a hide.
    expect(focusAppearance(1).opacity).toBeGreaterThan(0.2);
  });

  it("stops falling off past one viewport height", () => {
    expect(focusAppearance(1)).toEqual(focusAppearance(4));
    expect(focusAppearance(-1).opacity).toEqual(focusAppearance(-9).opacity);
  });

  it("keeps the blur subtle enough to read as defocus, not smear", () => {
    expect(focusAppearance(1).blurPx).toBeLessThanOrEqual(4);
  });
});

describe("the locked focus band", () => {
  it("holds the resting appearance across the whole band, not just at its centre", () => {
    for (const distance of [0, 0.08, 0.17, FOCUS_LOCK_DESKTOP]) {
      expect(focusAppearance(distance)).toEqual({
        opacity: 1,
        blurPx: 0,
        shiftPx: 0,
      });
    }
  });

  it("locks in both directions", () => {
    expect(focusAppearance(-FOCUS_LOCK_DESKTOP)).toEqual(focusAppearance(FOCUS_LOCK_DESKTOP));
  });

  it("begins the transition only past the band", () => {
    expect(focusProgress(FOCUS_LOCK_DESKTOP)).toBe(0);
    expect(focusProgress(FOCUS_LOCK_DESKTOP + 0.02)).toBeGreaterThan(0);
  });

  it("still reaches the full effect by the time the slide is a screen away", () => {
    expect(focusProgress(1)).toBe(1);
    expect(focusAppearance(1).blurPx).toBe(focusAppearance(2).blurPx);
  });

  /*
   * The band's whole job. Slides are one screen tall, so the two nearest a
   * reader always sit at distances summing to 1 and the nearer is never further
   * than 0.5 — which means a band of 0.5 leaves *some* argument settled at
   * every scroll position that exists. A reader stops where they stop; there
   * must be something to read there.
   */
  it("leaves an argument settled at every position a reader can stop at", () => {
    for (const lock of [FOCUS_LOCK_DESKTOP, FOCUS_LOCK_MOBILE]) {
      for (let step = 0; step <= 1000; step += 1) {
        const position = step / 1000;
        const nearer = Math.min(position, 1 - position);
        expect(focusAppearance(nearer, lock)).toEqual({
          opacity: 1,
          blurPx: 0,
          shiftPx: 0,
        });
      }
    }
  });

  it("gives a phone the same guarantee as a laptop, not a better one", () => {
    // 0.5 is the widest band that means anything, so both platforms sit at it.
    expect(FOCUS_LOCK_MOBILE).toBe(FOCUS_LOCK_DESKTOP);
    expect(FOCUS_LOCK_DESKTOP).toBeGreaterThanOrEqual(0.5);
  });

  it("still fades the argument being left behind", () => {
    // The effect §13 asks for is intact: settle on one and its neighbour, a
    // full screen away, is faded and blurred.
    expect(focusAppearance(1).opacity).toBeLessThan(0.4);
    expect(focusAppearance(1).blurPx).toBeGreaterThan(2);
  });

  it("rises without a step at the edge of the band, so the lock is felt and not seen", () => {
    const justOutside = focusAppearance(FOCUS_LOCK_DESKTOP + 0.01);
    expect(justOutside.opacity).toBeGreaterThan(0.97);
    expect(justOutside.blurPx).toBeLessThan(0.15);
  });
});

describe("nearestFocusIndex", () => {
  it("picks the slide closest to the centre line", () => {
    expect(nearestFocusIndex([-1.8, -0.9, 0.05, 1.1])).toBe(2);
  });

  it("ignores the sign of the distance", () => {
    expect(nearestFocusIndex([0.6, -0.2, 1.4])).toBe(1);
  });

  it("breaks ties toward the earlier slide, so scrolling cannot flicker", () => {
    expect(nearestFocusIndex([0.5, -0.5])).toBe(0);
  });

  it("holds the current slide until a rival is clearly closer", () => {
    // Two slides all but equidistant: the one already in focus keeps it, so the
    // calculator's mode cannot flicker across the boundary between them.
    expect(nearestFocusIndex([0.5, 0.48], 0)).toBe(0);
    expect(nearestFocusIndex([0.5, 0.48], 1)).toBe(1);
  });

  it("does switch once the rival has genuinely taken over", () => {
    const clear = 0.5 - FOCUS_SWITCH_MARGIN - 0.02;
    expect(nearestFocusIndex([0.5, clear], 0)).toBe(1);
  });

  it("ignores a held index that is no longer measurable", () => {
    expect(nearestFocusIndex([Number.POSITIVE_INFINITY, 0.4], 0)).toBe(1);
  });

  it("falls back to the first slide when nothing has been measured", () => {
    expect(nearestFocusIndex([])).toBe(0);
    expect(
      nearestFocusIndex([Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]),
    ).toBe(0);
  });
});
