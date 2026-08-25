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

/** The four locked headlines, in DEC-052's reading order. */
const HEADLINES = [
  "Use what you need. Leave the ownership behind.",
  "A simpler tax treatment.",
  "Keep leverage light. Keep capacity available.",
  "Preserve capital. Keep your business moving.",
];

/**
 * The four locked copy lines. The tax line carries only the two claims DEC-046
 * left standing — the depreciation block-rate and 180-day usage claims §13 first
 * had are withdrawn and must not come back without a further decision.
 */
const COPY = [
  "With an operating lease, Assetly carries the resale and obsolescence exposure. With a loan or outright purchase, that risk remains with the customer.",
  "Full rentals are allowable as a deduction. GST input credit continues to apply.",
  "Preserve bank credit lines and collateral capacity while maintaining a lighter impact on Debt/Equity and Debt/EBITDA compared with loan-funded acquisition.",
  "Access the assets you need without a large upfront outlay.",
];

/** The twelve locked calculator readings, in Lease/Loan/Purchase order. */
const COLUMNS = [
  ["Assetly bears it", "You bear it", "You bear it"],
  ["Full rental deductible", "Depreciation + interest", "Depreciation only"],
  ["Minimal impact", "Raises Debt/Equity", "Drains cash"],
  ["Low", "10–25% margin", "100% upfront"],
];

const TITLES = [
  "Risk of Obsolescence",
  "Tax Treatment",
  "Leverage Impact",
  "Upfront Cash",
];

/**
 * Sequential in reading order (DEC-053): the section reads 01, 02, 03, 04 top to
 * bottom. The owner's notes address these slides by §13's original numbers, which
 * no longer match — check `DECISIONS.md` before assuming a note's "01" is this one.
 */
const INDICES = ["01", "02", "03", "04"];

const METRICS = [
  "Customer ownership risk — lower is lighter",
  "Deduction breadth — higher is broader",
  "Capacity pressure — lower is lighter",
  "Upfront requirement — lower is lighter",
];

const TIERS = [
  ["low", "high", "high"],
  ["high", "mid", "low"],
  ["low", "high", "high"],
  ["minimal", "mid", "high"],
];

describe("Compare content (§13)", () => {
  it("has exactly the four arguments §13 defines, in DEC-053's order", () => {
    expect(COMPARE_SLIDES).toHaveLength(4);
    expect(COMPARE_SLIDES.map((slide) => slide.title)).toEqual(TITLES);
    expect(COMPARE_SLIDES.map((slide) => slide.index)).toEqual(INDICES);
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

  it("maps the approved outcomes to qualitative tiers only", () => {
    expect(COMPARE_SLIDES.map((slide) => slide.metricLabel)).toEqual(METRICS);
    expect(
      COMPARE_SLIDES.map((slide) => slide.columns.map((column) => column.tier)),
    ).toEqual(TIERS);

    COMPARE_SLIDES.forEach((slide) => {
      slide.columns.forEach((column) => {
        expect(Object.values(column).some((value) => typeof value === "number")).toBe(
          false,
        );
      });
    });
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
    const slide = COMPARE_SLIDES[0];
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
