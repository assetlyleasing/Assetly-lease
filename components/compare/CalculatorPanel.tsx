import { Eyebrow } from "@/components/primitives/Eyebrow";
import {
  COMPARE_CALCULATOR_EYEBROW,
  COMPARE_SLIDES,
  type CompareSlide,
} from "@/content/compare/slides";

import styles from "./Calculator.module.css";

/** The panel the drawer tab and the sheet handle both point `aria-controls` at. */
export const CALCULATOR_PANEL_ID = "compare-calculator";

const CALCULATOR_TITLE_ID = "compare-calculator-title";

/** The scroll target for a slide, shared by the mode row and the slide itself. */
export function compareSlideDomId(slideId: string): string {
  return `compare-slide-${slideId}`;
}

/**
 * The calculator's contents (SOURCE_OF_TRUTH.md §13).
 *
 * §13's principle is that this is "one analytical instrument changing
 * perspective", not four calculators — so the panel is a single stable frame
 * whose readings change, and only the readings animate on a context change.
 *
 * The three bars use approved qualitative tiers only. They are one persistent
 * graph whose fills move as the focused slide changes; there are no prototype
 * coefficients, computed figures, value inputs, or hidden numeric claims.
 */
export function CalculatorPanel({
  slide,
  focusIndex,
  onSelectSlide,
}: {
  slide: CompareSlide;
  focusIndex: number;
  onSelectSlide: (index: number) => void;
}) {
  return (
    <div
      className={styles.panel}
      id={CALCULATOR_PANEL_ID}
      role="region"
      aria-labelledby={CALCULATOR_TITLE_ID}
    >
      {/*
       * §20 asks for the calculator's mode to be announced as it changes, "used
       * sparingly to avoid noise". One short region, outside the keyed subtree
       * below so it is never torn down mid-announcement, carrying the mode name
       * and nothing else — not the three readings, which would turn every
       * scroll past a slide boundary into a paragraph of speech.
       */}
      <p className="sr-only" aria-live="polite">
        {slide.title}
      </p>

      <header className={styles.head}>
        <Eyebrow>{COMPARE_CALCULATOR_EYEBROW}</Eyebrow>

        <div className={styles.modes} role="group" aria-label="Jump to an argument">
          {COMPARE_SLIDES.map((option, index) => (
            <button
              key={option.id}
              type="button"
              className={styles.mode}
              aria-pressed={index === focusIndex}
              onClick={() => onSelectSlide(index)}
            >
              <span aria-hidden="true">{option.index}</span>
              <span className="sr-only">{option.title}</span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.reading}>
        <div className={styles.readingHeading} key={slide.id}>
          <h2 id={CALCULATOR_TITLE_ID} className={styles.title}>
            {slide.title}
          </h2>
          <p className={styles.metric}>{slide.metricLabel}</p>
        </div>

        <dl className={styles.graph} data-compare-graph>
          {slide.columns.map((column) => (
            <div
              key={column.label}
              className={styles.bar}
              data-lead={column.lead ? "true" : "false"}
            >
              <div className={styles.track} aria-hidden="true">
                <span className={styles.fill} data-tier={column.tier} />
              </div>
              <dt className={styles.columnLabel}>{column.label}</dt>
              <dd className={styles.columnValue}>
                <span className={styles.valueSwap} key={`${slide.id}-${column.label}`}>
                  {column.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
