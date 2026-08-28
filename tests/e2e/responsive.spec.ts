import { expect, test } from "./support/opening";

/**
 * FOUND-009: the foundation must render correctly from 320px to 1920px.
 *
 * Phase 0 has no layout to speak of, so this asserts the properties that must
 * hold for every width the site supports and that are easy to regress later:
 * no horizontal overflow (§9/§20 layout stability), the page gutter and heading
 * scale actually responding to viewport width, and the clamp bounds in
 * styles/tokens.css holding at both extremes.
 */

// One representative phone, tablet and wide desktop catches the breakpoint
// classes without repeating the same invariant at nine nearby widths.
const WIDTHS = [320, 768, 1920] as const;

for (const width of WIDTHS) {
  test(`renders without horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("page gutter honours its clamp bounds across the range", async ({
  page,
}) => {
  const gutterAt = async (width: number) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    return page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.width = "var(--gutter)";
      document.body.append(probe);
      const value = probe.getBoundingClientRect().width;
      probe.remove();
      return value;
    });
  };

  // clamp(20px, 5vw, 60px): pinned to the floor on a small phone, to the
  // ceiling on a wide desktop, and fluid in between.
  expect(await gutterAt(320)).toBeCloseTo(20, 0);
  expect(await gutterAt(1920)).toBeCloseTo(60, 0);

  const mid = await gutterAt(800);
  expect(mid).toBeGreaterThan(20);
  expect(mid).toBeLessThan(60);
});

test("base type scale grows with the viewport", async ({ page }) => {
  const bodySizeAt = async (width: number) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    return page.evaluate(() =>
      parseFloat(getComputedStyle(document.body).fontSize),
    );
  };

  const small = await bodySizeAt(320);
  const large = await bodySizeAt(1920);

  expect(small).toBeCloseTo(15, 0);
  expect(large).toBeCloseTo(17, 0);
  expect(large).toBeGreaterThan(small);
});
