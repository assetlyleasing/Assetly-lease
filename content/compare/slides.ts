import type { ComponentType } from "react";

import {
  LeverageImpactPlate,
  ObsolescencePlate,
  TaxTreatmentPlate,
  UpfrontCashPlate,
} from "@/content/plates/compare-plates";

/**
 * Compare content — "Lease vs. Loan vs. Purchase" (SOURCE_OF_TRUTH.md §13).
 *
 * Every headline, every sentence of supporting copy, and all twelve calculator
 * values below are **locked** by §13, which gives them verbatim.
 * `MASTER_PLAN.md`'s Phase 4 task 1 is explicit: do not paraphrase them. The
 * only liberty taken is capitalising the first letter of each copy line, since
 * §13 writes them as a continuation of the words "Copy:".
 *
 * Two of these are load-bearing claims about Indian tax and finance — the
 * 180-day usage restriction, the depreciation block rates, the GST input
 * credit — and they are reproduced exactly as approved rather than restated.
 * If any of it needs to change, that is a decision for §13 and a `DECISIONS.md`
 * entry, not an edit here.
 *
 * `tests/unit/compareCopy.test.ts` reassembles the headline segments and
 * asserts the locked wording, so a careless edit fails rather than quietly
 * shipping different copy — the same guard the Hero uses.
 */

/**
 * A run of headline text. `emphasis` renders as `<i>`, which globals.css
 * colours Moss inside a heading (§7). Declared here rather than shared with
 * `content/site/hero.ts` so the two content modules stay independent of each
 * other; they describe different sections and should be free to diverge.
 */
export type HeadlineSegment = {
  text: string;
  emphasis?: boolean;
};

/**
 * One column of the calculator's three-way comparison. `lead` marks the Lease
 * column, which §13 reserves the Bottle accent for — editorial emphasis on the
 * option being argued for, not a claim about magnitude.
 */
export type CalculatorColumn = {
  /** LEASE / LOAN / PURCHASE — Inter Tight UI chrome (§13 typography). */
  label: string;
  /** The outcome, set in DM Serif Display as a "key calculator outcome". */
  value: string;
  lead?: boolean;
};

export type CompareSlide = {
  id: string;
  /** Tabular index, DM Serif Display (§7). */
  index: string;
  /** The calculator's mode name when this slide has focus. */
  title: string;
  headline: readonly HeadlineSegment[];
  copy: string;
  plate: ComponentType;
  columns: readonly CalculatorColumn[];
};

export const COMPARE_SLIDES: readonly CompareSlide[] = [
  {
    id: "upfront-cash",
    index: "01",
    title: "Upfront Cash",
    headline: [
      { text: "Preserve " },
      { text: "capital", emphasis: true },
      { text: ". Keep your business moving." },
    ],
    copy: "Access needed assets without a large upfront outlay; operating lease preserves working capital; loan may require 10–25% margin; outright purchase requires 100% upfront.",
    plate: UpfrontCashPlate,
    columns: [
      { label: "Lease", value: "Low", lead: true },
      { label: "Loan", value: "10–25% margin" },
      { label: "Purchase", value: "100% upfront" },
    ],
  },
  {
    id: "obsolescence",
    index: "02",
    title: "Risk of Obsolescence",
    headline: [
      { text: "Use the " },
      { text: "asset", emphasis: true },
      { text: ". Not the ownership risk." },
    ],
    copy: "Operating lease means Assetly bears resale/obsolescence risk; loan/purchase means the customer bears it.",
    plate: ObsolescencePlate,
    columns: [
      { label: "Lease", value: "Assetly bears it", lead: true },
      { label: "Loan", value: "You bear it" },
      { label: "Purchase", value: "You bear it" },
    ],
  },
  {
    id: "tax-treatment",
    index: "03",
    title: "Tax Treatment",
    headline: [
      { text: "A " },
      { text: "simpler", emphasis: true },
      { text: " path to deduction." },
    ],
    copy: "Full rentals deductible without depreciation block-rate limits or the 180-day usage restriction; GST input credit continues to apply.",
    plate: TaxTreatmentPlate,
    columns: [
      { label: "Lease", value: "Full rental deductible", lead: true },
      { label: "Loan", value: "Depreciation + interest" },
      { label: "Purchase", value: "Depreciation only" },
    ],
  },
  {
    id: "leverage",
    index: "04",
    title: "Leverage Impact",
    headline: [
      { text: "Keep leverage " },
      { text: "light", emphasis: true },
      { text: ". Keep capacity available." },
    ],
    copy: "Preserves bank credit lines and collateral capacity, lighter impact on Debt/Equity and Debt/EBITDA vs. loan-funded acquisition.",
    plate: LeverageImpactPlate,
    columns: [
      { label: "Lease", value: "Minimal", lead: true },
      { label: "Loan", value: "Raises Debt/Equity" },
      { label: "Purchase", value: "Drains cash" },
    ],
  },
] as const;

/** The eyebrow above the calculator — §3's own name for this section. */
export const COMPARE_CALCULATOR_EYEBROW = "Lease vs. Loan vs. Purchase";

/** A slide's locked headline, reassembled. Used by the copy-integrity test. */
export function compareHeadlineText(slide: CompareSlide): string {
  return slide.headline.map((segment) => segment.text).join("");
}
