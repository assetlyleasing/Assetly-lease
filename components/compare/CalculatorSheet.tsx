import type { CompareSlide } from "@/content/compare/slides";

import { CALCULATOR_PANEL_ID, CalculatorPanel } from "./CalculatorPanel";
import styles from "./Calculator.module.css";

/**
 * The mobile calculator: a bottom sheet (SOURCE_OF_TRUTH.md §13).
 *
 * §13's mobile requirement is stability above all: "calculator height stays
 * stable (do not repeatedly push content up/down)". So the sheet's height is
 * fixed by CSS at a single value for all four arguments and never derived from
 * its contents; a reading too tall for it scrolls inside instead. The argument
 * slides reserve that height as padding, so the sheet covers nothing.
 *
 * §13's control here is a tiny centred triangle at the sheet's top edge, not
 * the desktop chevron — pointing down when the sheet is up, and up when it is
 * down, so the arrow always points the way the sheet will travel.
 */
export function CalculatorSheet({
  slide,
  focusIndex,
  open,
  onToggle,
  onSelectSlide,
}: {
  slide: CompareSlide;
  focusIndex: number;
  open: boolean;
  onToggle: () => void;
  onSelectSlide: (index: number) => void;
}) {
  return (
    <div className={styles.sheet}>
      <button
        type="button"
        className={styles.handle}
        aria-expanded={open}
        aria-controls={CALCULATOR_PANEL_ID}
        onClick={onToggle}
      >
        <span className={styles.handleFace} aria-hidden="true">
          {open ? "▼" : "▲"}
        </span>
        <span className="sr-only">
          {open ? "Close the comparison panel" : "Open the comparison panel"}
        </span>
      </button>

      <CalculatorPanel
        slide={slide}
        focusIndex={focusIndex}
        onSelectSlide={onSelectSlide}
      />
    </div>
  );
}
