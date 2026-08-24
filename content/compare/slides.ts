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
 * What remains here of Indian tax and finance — the GST input credit, the
 * 10–25% loan margin — is load-bearing, and is reproduced exactly as approved
 * rather than restated. §13 originally carried two further tax claims on the
 * Tax Treatment slide, the depreciation block-rate limits and the 180-day
 * usage restriction; the owner withdrew both (DEC-046). If any of this needs
 * to change, that is a decision for §13 and a `DECISIONS.md` entry, not an
 * edit here.
 *
 * The reading order is DEC-045's, not §13's original one, and the indices are
 * sequential in that order — the numbering a visitor sees is the order they
 * meet the arguments in.
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
 * Qualitative presentation tiers only; never financial magnitudes.
 *
 * `minimal` is a fourth step below `low` (DEC-047), used where a reading is
 * not merely the lightest of the three but close to nothing at all.
 */
export type CalculatorTier = "minimal" | "low" | "mid" | "high";

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
  /** Drives the graph's relative visual tier without asserting a number. */
  tier: CalculatorTier;
  lead?: boolean;
};

export type CompareSlide = {
  id: string;
  /** Tabular index, DM Serif Display (§7). */
  index: string;
  /** The calculator's mode name when this slide has focus. */
  title: string;
  /** Names the qualitative comparison and makes its direction explicit. */
  metricLabel: string;
  headline: readonly HeadlineSegment[];
  copy: string;
  plate: ComponentType;
  columns: readonly CalculatorColumn[];
};

export const COMPARE_SLIDES: readonly CompareSlide[] = [
  {
    id: "obsolescence",
    index: "01",
    title: "Ownership Risk",
    metricLabel: "Risk of obsolescence — lower is lighter",
    headline: [
      { text: "Use the " },
      { text: "asset", emphasis: true },
      { text: ". Not the ownership risk." },
    ],
    copy: "Operating lease means Assetly bears resale/obsolescence risk; loan/purchase means the customer bears it.",
    plate: ObsolescencePlate,
    columns: [
      { label: "Lease", value: "Assetly bears it", tier: "low", lead: true },
      { label: "Loan", value: "You bear it", tier: "high" },
      { label: "Purchase", value: "You bear it", tier: "high" },
    ],
  },
  {
    id: "tax-treatment",
    index: "02",
    title: "Tax Treatment",
    metricLabel: "Deduction breadth — higher is broader",
    headline: [
      { text: "A " },
      { text: "simpler", emphasis: true },
      { text: " path to deduction." },
    ],
    copy: "Full rentals allowable as deduction; GST input credit continues to apply.",
    plate: TaxTreatmentPlate,
    columns: [
      { label: "Lease", value: "Full rental deductible", tier: "high", lead: true },
      { label: "Loan", value: "Depreciation + interest", tier: "mid" },
      { label: "Purchase", value: "Depreciation only", tier: "low" },
    ],
  },
  {
    id: "leverage",
    index: "03",
    title: "Leverage Impact",
    metricLabel: "Capacity pressure — lower is lighter",
    headline: [
      { text: "Keep leverage " },
      { text: "light", emphasis: true },
      { text: ". Keep capacity available." },
    ],
    copy: "Preserves bank credit lines and collateral capacity, lighter impact on Debt/Equity and Debt/EBITDA vs. loan-funded acquisition.",
    plate: LeverageImpactPlate,
    columns: [
      { label: "Lease", value: "Minimal", tier: "low", lead: true },
      { label: "Loan", value: "Raises Debt/Equity", tier: "high" },
      { label: "Purchase", value: "Drains cash", tier: "high" },
    ],
  },
  {
    id: "upfront-cash",
    index: "04",
    title: "Upfront Cash",
    metricLabel: "Upfront requirement — lower is lighter",
    headline: [
      { text: "Preserve " },
      { text: "capital", emphasis: true },
      { text: ". Keep your business moving." },
    ],
    copy: "Access needed assets without a large upfront outlay; operating lease preserves working capital; loan may require 10–25% margin; outright purchase requires 100% upfront.",
    plate: UpfrontCashPlate,
    columns: [
      { label: "Lease", value: "Low", tier: "minimal", lead: true },
      { label: "Loan", value: "10–25% margin", tier: "mid" },
      { label: "Purchase", value: "100% upfront", tier: "high" },
    ],
  },
] as const;

/** The eyebrow above the calculator — §3's own name for this section. */
export const COMPARE_CALCULATOR_EYEBROW = "Lease vs. Loan vs. Purchase";

/** A slide's locked headline, reassembled. Used by the copy-integrity test. */
export function compareHeadlineText(slide: CompareSlide): string {
  return slide.headline.map((segment) => segment.text).join("");
}
