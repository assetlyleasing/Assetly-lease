"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * The shared scroll-triggered reveal, §8.
 *
 * Wraps content in the `.rv` container and adds `.in` when it enters the
 * viewport. Children opt in per element with `rv-u`, and stagger with
 * `rv-d1`/`rv-d2`/`rv-d3`:
 *
 *     <RevealOnScroll>
 *       <Eyebrow className="rv-u">Why Us</Eyebrow>
 *       <SerifHeading className="rv-u rv-d1">…</SerifHeading>
 *     </RevealOnScroll>
 *
 * Those class names are global (see globals.css) because §8 defines one reveal
 * primitive shared by every section, not a per-component animation.
 *
 * The `in` class is written straight to the node instead of being held in
 * React state. Revealing is a one-way visual change with no bearing on what the
 * component renders, so routing it through state would re-render every section
 * on scroll to no effect. Reveals once, then stops observing: this is an
 * entrance, and content that re-hides when scrolled past reads as a glitch.
 */
export function RevealOnScroll({
  children,
  as: Tag = "div",
  className,
  /** Fraction of the element that must be visible before revealing. */
  threshold = 0.15,
  /** Shrinks the viewport for the check, so a reveal can fire slightly early. */
  rootMargin = "0px 0px -10% 0px",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /*
     * Without IntersectionObserver there is no way to know when the element
     * arrives, so show the content rather than leave it invisible forever.
     */
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add("in");
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const classes = ["rv", className].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
