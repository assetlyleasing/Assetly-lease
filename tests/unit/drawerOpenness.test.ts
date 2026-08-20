import { describe, expect, it } from "vitest";

import {
  OPENNESS_BAND_FRACTION,
  OVERRIDE_TWEEN_MS,
  computeActive,
  computeOpenness,
  easeOutCubic,
  resolveOpenness,
  smoothstep,
} from "@/lib/motion/drawerOpenness";

/**
 * `MASTER_PLAN.md` Phase 4 requires the drawer's zone boundaries, easing bands
 * and override behaviour to be tested "independent of DOM" — this file is that
 * test. Everything below is arithmetic on measurements a browser would supply.
 */

/** A representative desktop viewport, and the section geometry §13 produces. */
const VH = 900;
const BAND = VH * OPENNESS_BAND_FRACTION; // 360
const SLIDE_HEIGHT = VH * 1.04; // §13's near-full-screen argument slide
const SECTION_HEIGHT = SLIDE_HEIGHT * 4;

/** Openness for a section whose top edge is at `sectionTop`. */
function opennessAt(sectionTop: number, options?: { snap?: boolean }) {
  return computeOpenness(
    {
      sectionTop,
      sectionBottom: sectionTop + SECTION_HEIGHT,
      viewportHeight: VH,
    },
    options,
  );
}

describe("easing helpers", () => {
  it("smoothstep is flat at both ends and half-way at the middle", () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5, 6);
    // Flat start: a small step in produces a much smaller step out.
    expect(smoothstep(0.1)).toBeLessThan(0.1);
    expect(smoothstep(0.9)).toBeGreaterThan(0.9);
  });

  it("clamps out-of-range input rather than extrapolating", () => {
    expect(smoothstep(-4)).toBe(0);
    expect(smoothstep(9)).toBe(1);
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(2)).toBe(1);
  });

  it("easeOutCubic front-loads its travel", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe("computeOpenness", () => {
  it("is shut for the whole of the Hero, not merely most of it", () => {
    // DESIGN_SYSTEM §8: invisible during the Hero "no matter what". The Hero
    // still fills the top of the screen anywhere above this.
    expect(opennessAt(VH)).toBe(0);
    expect(opennessAt(VH * 0.8)).toBe(0);
    expect(opennessAt(VH * 0.5)).toBe(0);
    expect(opennessAt(BAND)).toBe(0);
  });

  it("opens across the band before the section fills the screen", () => {
    const quarter = opennessAt(BAND * 0.75);
    const half = opennessAt(BAND * 0.5);
    const threeQuarters = opennessAt(BAND * 0.25);

    expect(quarter).toBeGreaterThan(0);
    expect(quarter).toBeLessThan(half);
    expect(half).toBeCloseTo(0.5, 2);
    expect(half).toBeLessThan(threeQuarters);
    expect(threeQuarters).toBeLessThan(1);
  });

  it("is fully open by the time the section owns the whole screen", () => {
    expect(opennessAt(0)).toBeCloseTo(1, 6);
  });

  it("finishes opening before the first argument reaches the centre", () => {
    // Slide 01's midpoint on the centre line.
    const top = VH / 2 - SLIDE_HEIGHT / 2;
    expect(opennessAt(top)).toBeCloseTo(1, 6);
  });

  it("stays fully open across the whole reading of all four arguments", () => {
    for (let top = 0; top > -SECTION_HEIGHT + VH; top -= 50) {
      expect(opennessAt(top)).toBeCloseTo(1, 6);
    }
  });

  it("is still fully open when the last argument is centred", () => {
    // Slide 04's midpoint on the centre line.
    const top = VH / 2 - (SECTION_HEIGHT - SLIDE_HEIGHT / 2);
    expect(opennessAt(top)).toBeCloseTo(1, 3);
  });

  it("closes over the band that follows Why Us reaching the fold", () => {
    // Section bottom level with the fold — closing has not started.
    expect(opennessAt(VH - SECTION_HEIGHT)).toBeCloseTo(1, 6);
    // Half a band later.
    expect(opennessAt(VH - SECTION_HEIGHT - BAND * 0.5)).toBeCloseTo(0.5, 2);
    // A full band later it is shut, well before Why Us fills the screen.
    expect(opennessAt(VH - SECTION_HEIGHT - BAND)).toBeCloseTo(0, 6);
  });

  it("stays shut once the section is behind the reader", () => {
    expect(opennessAt(-SECTION_HEIGHT * 2)).toBe(0);
  });

  it("never leaves the 0–1 range, at any scroll position", () => {
    for (let top = VH + 400; top > -SECTION_HEIGHT - 400; top -= 25) {
      const value = opennessAt(top);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("survives a section shorter than the easing bands", () => {
    // Both ramps overlap here; the value must still be bounded and finite.
    const value = computeOpenness({
      sectionTop: 200,
      sectionBottom: 300,
      viewportHeight: VH,
    });
    expect(Number.isFinite(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  });

  it("survives a zero-height viewport without dividing by zero", () => {
    const value = computeOpenness({
      sectionTop: 0,
      sectionBottom: 0,
      viewportHeight: 0,
    });
    expect(Number.isFinite(value)).toBe(true);
  });

  describe("snap (prefers-reduced-motion)", () => {
    it("only ever reports 0 or 1", () => {
      for (let top = VH + 400; top > -SECTION_HEIGHT - 400; top -= 25) {
        expect([0, 1]).toContain(opennessAt(top, { snap: true }));
      }
    });

    it("is open across the same zone the scrubbed value is", () => {
      expect(opennessAt(VH, { snap: true })).toBe(0);
      expect(opennessAt(BAND, { snap: true })).toBe(0);
      expect(opennessAt(0, { snap: true })).toBe(1);
      expect(opennessAt(-SECTION_HEIGHT, { snap: true })).toBe(0);
    });
  });
});

describe("computeActive", () => {
  const activeAt = (sectionTop: number) =>
    computeActive({
      sectionTop,
      sectionBottom: sectionTop + SECTION_HEIGHT,
      viewportHeight: VH,
    });

  it("is false throughout the Hero — §13's hidden-before-the-section rule", () => {
    expect(activeAt(VH + 2000)).toBe(false);
    expect(activeAt(VH)).toBe(false);
    expect(activeAt(VH * 0.8)).toBe(false);
    expect(activeAt(BAND)).toBe(false);
  });

  it("turns on exactly as the opening band begins", () => {
    expect(activeAt(BAND - 1)).toBe(true);
  });

  it("stays on through the whole section, including once manually closed", () => {
    expect(activeAt(0)).toBe(true);
    expect(activeAt(-SECTION_HEIGHT + VH)).toBe(true);
  });

  it("turns off only once the closing band has finished", () => {
    expect(activeAt(VH - SECTION_HEIGHT - BAND + 1)).toBe(true);
    expect(activeAt(VH - SECTION_HEIGHT - BAND)).toBe(false);
  });

  it("is false once the section is behind the reader", () => {
    expect(activeAt(-SECTION_HEIGHT * 2)).toBe(false);
  });
});

describe("resolveOpenness", () => {
  it("passes the scroll value straight through when nothing is overridden", () => {
    expect(resolveOpenness({ auto: 0.42, override: null, now: 0 })).toEqual({
      value: 0.42,
      animating: false,
    });
  });

  it("tweens from where the panel was to where it was asked to go", () => {
    const override = { from: 1, target: 0, startedAt: 1000 };

    const start = resolveOpenness({ auto: 1, override, now: 1000 });
    expect(start.value).toBeCloseTo(1, 6);
    expect(start.animating).toBe(true);

    const middle = resolveOpenness({ auto: 1, override, now: 1250 });
    expect(middle.value).toBeLessThan(1);
    expect(middle.value).toBeGreaterThan(0);
    expect(middle.animating).toBe(true);

    // Ease-out: more than half the travel is done at the half-way mark.
    expect(middle.value).toBeLessThan(0.5);
  });

  it("settles on the target and stops asking for frames", () => {
    const override = { from: 1, target: 0, startedAt: 0 };
    const settled = resolveOpenness({
      auto: 1,
      override,
      now: OVERRIDE_TWEEN_MS,
    });

    expect(settled.value).toBe(0);
    expect(settled.animating).toBe(false);
  });

  it("keeps a closed panel closed no matter what the scroll says (§13)", () => {
    const override = { from: 1, target: 0, startedAt: 0 };

    // Long after the tween, deep inside the section, auto-sync wants it open.
    const later = resolveOpenness({ auto: 1, override, now: 60_000 });
    expect(later.value).toBe(0);
    expect(later.animating).toBe(false);
  });

  it("reopens from wherever the previous tween had reached", () => {
    // Mid-close, the visitor changes their mind: the reopen starts from there.
    const closing = { from: 1, target: 0, startedAt: 0 };
    const midway = resolveOpenness({ auto: 1, override: closing, now: 200 });

    const reopening = { from: midway.value, target: 1, startedAt: 200 };
    const resumed = resolveOpenness({ auto: 1, override: reopening, now: 200 });

    expect(resumed.value).toBeCloseTo(midway.value, 6);
    expect(resumed.animating).toBe(true);
  });

  it("does not divide by a zero duration", () => {
    const result = resolveOpenness({
      auto: 0,
      override: { from: 0, target: 1, startedAt: 0 },
      now: 0,
      duration: 0,
    });
    expect(result).toEqual({ value: 1, animating: false });
  });
});
