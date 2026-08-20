/**
 * Hero copy (SOURCE_OF_TRUTH.md §11).
 *
 * This copy is **locked** by `DECISIONS.md` DEC-018, which supersedes DEC-001's
 * main line. It must not be reworded, shortened, or "improved". The main line
 * reads, in full:
 *
 *   "The lighter balance sheet."
 *
 * It is stored split across the two mask lines §11 allows, and in segments so
 * that one word can carry the §7 italic-in-Moss emphasis. `tests/unit` asserts
 * that the segments still reassemble into exactly the locked sentence, so a
 * careless edit here fails rather than quietly shipping different copy.
 *
 * §11 is also explicit that there is no additional paragraph beyond the
 * subline. Do not add one.
 */

export type HeadlineSegment = {
  text: string;
  /** Renders as <i>, which globals.css colours Moss inside a heading (§7). */
  emphasis?: boolean;
};

export const HERO = {
  /** Max two lines (§11). The break is deliberate, per DEC-018. */
  headlineLines: [
    [{ text: "The " }, { text: "lighter", emphasis: true }],
    [{ text: "balance sheet." }],
  ] as readonly (readonly HeadlineSegment[])[],

  /** The tagline from the visiting card (§5). */
  subline: "Access . Scale . Grow",
} as const;

/** The locked DEC-018 sentence, reassembled. Used by the copy-integrity test. */
export function heroHeadlineText(): string {
  return HERO.headlineLines
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(" ");
}
