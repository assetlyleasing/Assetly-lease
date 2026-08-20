import type { CompareSlide } from "@/content/compare/slides";

import { CALCULATOR_PANEL_ID, CalculatorPanel } from "./CalculatorPanel";
import styles from "./Calculator.module.css";

/**
 * The desktop calculator: a right-side drawer (SOURCE_OF_TRUTH.md §13).
 *
 * Structurally separate from the mobile bottom sheet rather than the same
 * markup under a media query, because §9 requires mobile to be recomposed
 * rather than shrunk and `MASTER_PLAN.md` Phase 4 names the split explicitly.
 * The two share their data and all of their state; only the physical mechanism
 * differs, and the two mechanisms move on different axes.
 *
 * The whole drawer translates by its own width as openness falls, which puts
 * the tab — pinned just outside the drawer's leading edge — flush against the
 * right of the screen when the panel is closed. So the control the visitor
 * needs to reopen it stays exactly where they last saw it (§13: closed stays
 * closed until reopened).
 */
export function CalculatorDrawer({
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
    <div className={styles.drawer}>
      {/*
       * §13: "extremely minimal — small triangle/chevron on the drawer edge
       * (~10–14px), no text, larger invisible hit area." The button is a full
       * 44px target per §20; only the disc inside it is drawn.
       */}
      <button
        type="button"
        className={styles.tab}
        aria-expanded={open}
        aria-controls={CALCULATOR_PANEL_ID}
        onClick={onToggle}
      >
        <span className={styles.tabFace} aria-hidden="true">
          {open ? "‹" : "›"}
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
