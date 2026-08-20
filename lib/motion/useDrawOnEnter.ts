"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Triggers a plate's draw when it scrolls into view (§8).
 *
 * Returns a ref to attach to the element that should be watched — usually the
 * plate's wrapper rather than the SVG itself, since the SVG may sit at low
 * opacity — and a boolean to pass to `Plate`'s `drawn` prop.
 *
 *     const { ref, drawn } = useDrawOnEnter();
 *     <div ref={ref}><Plate drawn={drawn} …/></div>
 *
 * Draws once and stops observing: §8 is explicit that the plate "draws once on
 * activation" and stays visible, with no re-drawing loop.
 */
export function useDrawOnEnter<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.25,
  rootMargin = "0px",
  /** Skip the observer and draw immediately — for a plate already on screen. */
  immediate = false,
}: {
  threshold?: number;
  rootMargin?: string;
  immediate?: boolean;
} = {}) {
  const ref = useRef<T | null>(null);
  const [drawn, setDrawn] = useState(immediate);

  useEffect(() => {
    if (drawn) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [drawn, threshold, rootMargin]);

  return { ref, drawn };
}
