"use client";

import { useCallback, useRef, useState, type RefObject } from "react";

import {
  computeActive,
  computeOpenness,
  resolveOpenness,
  type OpennessOverride,
} from "./drawerOpenness";
import { requestScrollTick, useScrollTick } from "./useScrollTick";

/**
 * §13's calculator drawer: a panel scrubbed open by the scroll itself.
 *
 * The continuous 0–1 value is written to the given element as
 * `--compare-openness` on the shared scroll frame. Everything that moves with
 * it — the panel's own translate, the narrowing of the argument column — reads
 * that one property, so the drawer and the content it makes room for cannot
 * fall out of step.
 *
 * React state carries only the two facts a component genuinely re-renders for:
 * whether the calculator exists at this scroll position, and whether it is open
 * (which `aria-expanded` and the tab's chevron both need). The openness value
 * itself never enters state.
 *
 * The write is skipped when the value has not meaningfully changed. That is not
 * micro-optimisation: `--compare-openness` drives a width, so every write costs
 * a layout, and the value is pinned at 1 for most of the section's height.
 */

/** Below this, two openness values are the same picture. */
const WRITE_EPSILON = 0.004;

export function useDrawerOpenness(
  sectionRef: RefObject<HTMLElement | null>,
  { reducedMotion = false }: { reducedMotion?: boolean } = {},
) {
  const measuredRef = useRef({ auto: 0, active: false });
  const overrideRef = useRef<OpennessOverride | null>(null);
  const valueRef = useRef(0);
  const writtenRef = useRef(-1);

  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const read = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;

    const { top, bottom } = node.getBoundingClientRect();
    const measurement = {
      sectionTop: top,
      sectionBottom: bottom,
      viewportHeight: window.innerHeight,
    };

    measuredRef.current = {
      auto: computeOpenness(measurement, { snap: reducedMotion }),
      active: computeActive(measurement),
    };
  }, [sectionRef, reducedMotion]);

  const write = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;

    const { auto, active: nextActive } = measuredRef.current;
    const override = overrideRef.current;

    const { value, animating } = resolveOpenness({
      auto,
      override,
      now: performance.now(),
    });

    valueRef.current = value;

    if (Math.abs(value - writtenRef.current) >= WRITE_EPSILON) {
      writtenRef.current = value;
      node.style.setProperty("--compare-openness", value.toFixed(3));
    }

    /*
     * While a manual tween is running the value is still on its way to the
     * target, so deriving "open" from it would report the panel closed for the
     * first half of an opening tween — and flip `aria-expanded` twice for one
     * click. The override's intent is the honest answer.
     */
    const nextOpen = override ? override.target > 0.5 : value > 0.5;

    setActive((current) => (current === nextActive ? current : nextActive));
    setOpen((current) => (current === nextOpen ? current : nextOpen));

    // The tween advances on time, not on scroll, so it keeps the loop alive
    // itself for as long as it is still moving.
    if (animating) requestScrollTick();
  }, [sectionRef]);

  useScrollTick(read, write);

  /**
   * The tab. §13: clicking it sets an override flag, tweens to the target, and
   * silences auto-sync from then on — which is what makes a panel the visitor
   * closed stay closed until they reopen it.
   */
  const toggle = useCallback(() => {
    overrideRef.current = {
      from: valueRef.current,
      target: valueRef.current > 0.5 ? 0 : 1,
      startedAt: performance.now(),
    };
    requestScrollTick();
  }, []);

  return { active, open, toggle };
}
