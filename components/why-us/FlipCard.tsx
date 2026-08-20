"use client";

import { useId, useState } from "react";

import type { WhyUsValue } from "@/content/why-us/values";

import styles from "./WhyUs.module.css";

/**
 * One independently controlled Why Assetly card (SOURCE_OF_TRUTH.md §14).
 *
 * A native button provides click, tap, Enter, and Space activation without a
 * custom keyboard handler. The 3D faces are visual only; the button name and
 * conditional description expose exactly the active face to assistive tech.
 */
export function FlipCard({ value }: { value: WhyUsValue }) {
  const [flipped, setFlipped] = useState(false);
  const hintId = useId();
  const explanationId = useId();

  return (
    <button
      type="button"
      className={styles.card}
      data-flipped={flipped ? "true" : "false"}
      aria-label={value.name}
      aria-pressed={flipped}
      aria-describedby={flipped ? explanationId : hintId}
      onClick={() => setFlipped((current) => !current)}
    >
      <span id={hintId} className="sr-only">
        Activate to show details.
      </span>

      {flipped && (
        <span
          id={explanationId}
          className="sr-only"
          aria-live="polite"
          data-a11y-description
        >
          {value.explanation} Activate again to return.
        </span>
      )}

      <span className={styles.stage} aria-hidden="true">
        <span className={`${styles.face} ${styles.front}`}>
          <span className={styles.letter}>{value.letter}</span>
          <span className={styles.frontFooter}>
            <span className={styles.valueName}>{value.name}</span>
            <span className={styles.cue}>
              Select to explore <span className={styles.cueMark}>↻</span>
            </span>
          </span>
        </span>

        <span className={`${styles.face} ${styles.back}`}>
          <span className={styles.backMarker}>{value.letter}</span>
          <span className={styles.backContent}>
            <span className={styles.backName}>{value.name}</span>
            <span className={styles.explanation}>{value.explanation}</span>
          </span>
          <span className={styles.cue}>
            Select to return <span className={styles.cueMark}>↺</span>
          </span>
        </span>
      </span>
    </button>
  );
}
