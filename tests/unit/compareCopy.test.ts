import { describe, expect, it } from "vitest";

import {
  COMPARE_SLIDES,
  compareHeadlineText,
  type CompareSlide,
} from "@/content/compare/slides";

/**
 * Copy integrity for Compare, following the pattern `tests/unit/heroCopy.test.ts`
 * set: because the headlines are stored as segments so one word can be
 * emphasised, it is easy to change the rendered sentence while every other test
 * still passes. §13 locks all of this, and `MASTER_PLAN.md` Phase 4 task 1 says
 * not to paraphrase it — so the exact wording is asserted here rather than
 * trusted to review.
 *
 * If a change to this file is deliberate, it needs §13 updated and a
 * `DECISIONS.md` entry first. Do not "fix" the test.
 */

/** The four locked headlines from §13, verbatim. */
const HEADLINES = [
  "Preserve capital. Keep your business moving.",
  "Use the asset. Not the ownership risk.",
  "A simpler path to deduction.",
  "Keep leverage light. Keep capacity available.",
];

/**
 * The four locked copy lines from §13, verbatim apart from the capital letter
 * each one starts with — §13 writes them as a continuation of "Copy:".
 */
const COPY = [
  "Access needed assets without a large upfront outlay; operating lease preserves working capital; loan may require 10–25% margin; outright purchase requires 100% upfront.",
  "Operating lease means Assetly bears resale/obsolescence risk; loan/purchase means the customer bears it.",
  "Full rentals deductible without depreciation block-rate limits or the 180-day usage restriction; GST input credit continues to apply.",
  "Preserves bank credit lines and collateral capacity, lighter impact on Debt/Equity and Debt/EBITDA vs. loan-funded acquisition.",
];

/** The twelve locked calculator readings from §13, in Lease/Loan/Purchase order. */
const COLUMNS = [
  ["Low", "10–25% margin", "100% upfront"],
  ["Assetly bears it", "You bear it", "You bear it"],
  ["Full rental deductible", "Depreciation + interest", "Depreciation only"],
  ["Minimal", "Raises Debt/Equity", "Drains cash"],
];

const TITLES = [
  "Upfront Cash",
  "Risk of Obsolescence",
  "Tax Treatment",
  "Leverage Impact",
];

describe("Compare content (§13)", () => {
  it("has exactly the four arguments §13 defines, in order", () => {
    expect(COMPARE_SLIDES).toHaveLength(4);
    expect(COMPARE_SLIDES.map((slide) => slide.title)).toEqual(TITLES);
    expect(COMPARE_SLIDES.map((slide) => slide.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
  });

  it("reassembles into exactly the locked headlines", () => {
    expect(COMPARE_SLIDES.map(compareHeadlineText)).toEqual(HEADLINES);
  });

  it("carries the locked supporting copy without paraphrase", () => {
    expect(COMPARE_SLIDES.map((slide) => slide.copy)).toEqual(COPY);
  });

  it("carries the locked calculator readings", () => {
    expect(
      COMPARE_SLIDES.map((slide) => slide.columns.map((column) => column.value)),
    ).toEqual(COLUMNS);
  });

  it("labels every reading Lease, Loan and Purchase in that order", () => {
    COMPARE_SLIDES.forEach((slide) => {
      expect(slide.columns.map((column) => column.label)).toEqual([
        "Lease",
        "Loan",
        "Purchase",
      ]);
    });
  });

  it("leads on Lease, and on nothing else", () => {
    COMPARE_SLIDES.forEach((slide) => {
      const lead = slide.columns.filter((column) => column.lead);
      expect(lead).toHaveLength(1);
      expect(lead[0].label).toBe("Lease");
    });
  });

  it("emphasises exactly one single word per headline (§7)", () => {
    COMPARE_SLIDES.forEach((slide: CompareSlide) => {
      const emphasised = slide.headline.filter((segment) => segment.emphasis);
      expect(emphasised).toHaveLength(1);
      expect(emphasised[0].text.trim().split(/\s+/)).toHaveLength(1);
    });
  });

  it("states no percentage on the obsolescence argument", () => {
    // §13 is explicit: "No artificial percentage here." Guarded because a
    // plausible-looking figure is exactly the kind of thing that gets added
    // later to make a comparison row feel more concrete.
    const slide = COMPARE_SLIDES[1];
    const text = [slide.copy, ...slide.columns.map((c) => c.value)].join(" ");
    expect(text).not.toMatch(/\d\s*%/);
  });

  it("gives every slide its own plate and a unique id", () => {
    const ids = COMPARE_SLIDES.map((slide) => slide.id);
    expect(new Set(ids).size).toBe(ids.length);

    const plates = COMPARE_SLIDES.map((slide) => slide.plate);
    expect(new Set(plates).size).toBe(plates.length);
    plates.forEach((plate) => expect(typeof plate).toBe("function"));
  });
});
