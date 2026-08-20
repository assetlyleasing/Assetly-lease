import { describe, expect, it } from "vitest";

import {
  focusAppearance,
  focusDistance,
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
    const near = focusAppearance(0.3);
    const far = focusAppearance(0.8);

    expect(near.opacity).toBeLessThan(1);
    expect(far.opacity).toBeLessThan(near.opacity);
    expect(far.blurPx).toBeGreaterThan(near.blurPx);
    expect(Math.abs(far.shiftPx)).toBeGreaterThan(Math.abs(near.shiftPx));
  });

  it("displaces in the direction the slide sits, not always downward", () => {
    expect(focusAppearance(-0.5).shiftPx).toBeLessThan(0);
    expect(focusAppearance(0.5).shiftPx).toBeGreaterThan(0);
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

  it("falls back to the first slide when nothing has been measured", () => {
    expect(nearestFocusIndex([])).toBe(0);
    expect(
      nearestFocusIndex([Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]),
    ).toBe(0);
  });
});
