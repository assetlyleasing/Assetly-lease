"use client";

import { useCallback, useRef } from "react";

import { COMPARE_SLIDES } from "@/content/compare/slides";
import { useDrawerOpenness } from "@/lib/motion/useDrawerOpenness";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/motion/useMediaQuery";
import { useScrollFocus } from "@/lib/motion/useScrollFocus";

import { ArgumentSlide } from "./ArgumentSlide";
import { CalculatorDrawer } from "./CalculatorDrawer";
import { compareSlideDomId } from "./CalculatorPanel";
import { CalculatorSheet } from "./CalculatorSheet";
import styles from "./Compare.module.css";

/**
 * Compare — "Lease vs. Loan vs. Purchase" (SOURCE_OF_TRUTH.md §13).
 *
 * §13's closing principle is the brief for this whole component: "editorial
 * financial storytelling on the left + a live analytical instrument on the
 * right" — never "text beside a dashboard". So the four arguments are ordinary
 * page content that happens to be lit one at a time, and the calculator is a
 * single instrument that changes perspective as they pass.
 *
 * Both scroll-linked effects here run on one shared animation frame (§8, §13);
 * see `useScrollTick`. Neither hook owns a listener of its own.
 */

/** §13's mobile threshold for drawers and sheets, per §9's breakpoint reference. */
const SHEET_QUERY = "(max-width: 700px)";

export function CompareSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isSheet = useMediaQuery(SHEET_QUERY);

  const { setSlideRef, focusIndex } = useScrollFocus(COMPARE_SLIDES.length, {
    reducedMotion,
  });
  const { active, open, toggle } = useDrawerOpenness(sectionRef, {
    reducedMotion,
  });

  const slide = COMPARE_SLIDES[focusIndex];

  /*
   * The mode row jumps rather than switching modes directly. §13 makes scroll
   * position the calculator's only input — "automatic and context-aware, tied
   * to scroll position" — so a control that set the mode itself would create a
   * second source of truth that the next scroll frame would immediately
   * overrule. Moving the reader instead keeps one.
   */
  const selectSlide = useCallback(
    (index: number) => {
      const target = document.getElementById(
        compareSlideDomId(COMPARE_SLIDES[index].id),
      );
      if (!target) return;

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    },
    [reducedMotion],
  );

  const calculatorProps = {
    slide,
    focusIndex,
    open,
    onToggle: toggle,
    onSelectSlide: selectSlide,
  };

  return (
    <section ref={sectionRef} id="compare" className={styles.compare}>
      <div className={styles.slides}>
        {COMPARE_SLIDES.map((entry, index) => (
          <ArgumentSlide key={entry.id} slide={entry} ref={setSlideRef[index]} />
        ))}
      </div>

      {/*
       * Mounted only inside its own zone. §13 keeps the calculator hidden
       * before the section and slides it away after it, and by the time
       * `active` turns over in either direction the panel is already off-screen
       * — so unmounting costs nothing visually and keeps a panel about
       * arguments the visitor is nowhere near out of the accessibility tree
       * entirely.
       *
       * `isSheet` is null until the client knows the viewport, which is why
       * neither variant renders during hydration: rendering the wrong one and
       * swapping would put two different mechanisms on screen in one frame.
       */}
      {active && isSheet === true && <CalculatorSheet {...calculatorProps} />}
      {active && isSheet === false && <CalculatorDrawer {...calculatorProps} />}
    </section>
  );
}
