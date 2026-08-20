"use client";

import { useCallback, useMemo, useRef, useState, type RefCallback } from "react";

import { focusAppearance, focusDistance, nearestFocusIndex } from "./scrollFocus";
import { useScrollTick } from "./useScrollTick";

/**
 * §13's left-content focus effect: one argument in focus per screen.
 *
 * Measures every registered slide's distance from the centre of the viewport on
 * the shared scroll frame (`useScrollTick`) and writes the resulting appearance
 * straight to each node as custom properties. The stylesheet decides what those
 * properties do, which keeps the visual language in CSS where the rest of the
 * site's is.
 *
 * Only the focused index goes through React state. It changes four times over
 * the whole section, whereas the appearance values change every frame — putting
 * those in state would re-render the section on every pixel of scroll to
 * produce a value only CSS ever reads.
 *
 * Under `prefers-reduced-motion` no appearance is written at all. The component
 * stylesheet neutralises the properties in the same breath, so the slides sit
 * at their resting state — present, sharp, unmoved — while the calculator still
 * follows the reader, because knowing which argument is on screen is
 * information, not decoration.
 */
export function useScrollFocus(
  count: number,
  { reducedMotion = false }: { reducedMotion?: boolean } = {},
) {
  const nodesRef = useRef<(HTMLElement | null)[]>([]);
  const distancesRef = useRef<number[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);

  /**
   * One stable callback ref per slide. Regenerated only when the number of
   * slides changes, so React is not detaching and reattaching refs on renders
   * that changed nothing.
   */
  const setSlideRef = useMemo(
    () =>
      Array.from(
        { length: count },
        (_, index): RefCallback<HTMLElement> =>
          (node) => {
            nodesRef.current[index] = node;
          },
      ),
    [count],
  );

  const read = useCallback(() => {
    const viewportHeight = window.innerHeight;
    distancesRef.current = nodesRef.current.map((node) => {
      if (!node) return Number.POSITIVE_INFINITY;
      const { top, height } = node.getBoundingClientRect();
      return focusDistance({ top, height, viewportHeight });
    });
  }, []);

  const write = useCallback(() => {
    const distances = distancesRef.current;

    if (!reducedMotion) {
      distances.forEach((distance, index) => {
        const node = nodesRef.current[index];
        if (!node || !Number.isFinite(distance)) return;

        const { opacity, blurPx, shiftPx } = focusAppearance(distance);
        node.style.setProperty("--focus-opacity", opacity.toFixed(3));
        node.style.setProperty("--focus-blur", `${blurPx.toFixed(2)}px`);
        node.style.setProperty("--focus-shift", `${shiftPx.toFixed(2)}px`);
      });
    }

    const next = nearestFocusIndex(distances);
    setFocusIndex((current) => (current === next ? current : next));
  }, [reducedMotion]);

  useScrollTick(read, write);

  return { setSlideRef, focusIndex };
}
