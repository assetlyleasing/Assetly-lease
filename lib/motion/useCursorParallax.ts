"use client";

import { useEffect, type RefObject } from "react";

/**
 * The desktop cursor parallax from §11's Stage 2 "living plate".
 *
 * Writes `--hero-parallax-x/y` onto the given element from the pointer's
 * distance from the viewport centre; the stylesheet decides what moves and how
 * softly. Values are written straight to the node rather than held in state,
 * because pointermove fires far too often to re-render on, and reads are
 * coalesced to one per frame — §8's stated reason for reaching for rAF at all.
 *
 * Deliberately inert in three cases: under `prefers-reduced-motion`, on devices
 * without a fine pointer (a touch screen has no cursor to follow), and until
 * `enabled` turns true, which the Hero uses to hold it back until the plate has
 * finished drawing.
 */
export function useCursorParallax(
  ref: RefObject<HTMLElement | null>,
  {
    enabled = true,
    /** Maximum travel in pixels at the edge of the viewport. */
    strength = 14,
  }: { enabled?: boolean; strength?: number } = {},
) {
  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reduced.matches || !finePointer.matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const write = () => {
      frame = 0;
      const offsetX = (pointerX / window.innerWidth - 0.5) * 2 * strength;
      const offsetY = (pointerY / window.innerHeight - 0.5) * 2 * strength;
      node.style.setProperty("--hero-parallax-x", `${offsetX.toFixed(2)}px`);
      node.style.setProperty("--hero-parallax-y", `${offsetY.toFixed(2)}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(write);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
      node.style.removeProperty("--hero-parallax-x");
      node.style.removeProperty("--hero-parallax-y");
    };
  }, [ref, enabled, strength]);
}
