import { describe, expect, it } from "vitest";

import { HERO, heroHeadlineText } from "@/content/site/hero";

/**
 * Copy integrity for the Hero.
 *
 * The main line is locked by `DECISIONS.md` DEC-018 and the subline by DEC-001.
 * Because the headline is stored split across mask lines and emphasis segments,
 * it is easy to change the rendered sentence while every other test still
 * passes — these assertions are what make that fail loudly.
 */
describe("hero copy (DEC-018, DEC-001)", () => {
  it("reassembles into exactly the locked main line", () => {
    expect(heroHeadlineText()).toBe("The lighter balance sheet.");
  });

  it("keeps the DEC-001 tagline as the subline", () => {
    expect(HERO.subline).toBe("Access . Scale . Grow");
  });

  it("stays within the two lines §11 allows", () => {
    expect(HERO.headlineLines.length).toBeLessThanOrEqual(2);
  });

  it("emphasises exactly one word, per §11", () => {
    const emphasised = HERO.headlineLines
      .flat()
      .filter((segment) => segment.emphasis);

    expect(emphasised).toHaveLength(1);
    expect(emphasised[0].text.trim().split(/\s+/)).toHaveLength(1);
  });
});
