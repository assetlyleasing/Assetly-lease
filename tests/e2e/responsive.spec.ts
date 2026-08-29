import { expect, test } from "./support/opening";

/**
 * FOUND-009: the foundation must render correctly from 320px to 1920px.
 *
 * Horizontal overflow across that range is asserted by hero.spec.ts's own
 * 320-1920px sweep, which covers a superset of the widths this file used to
 * check. Repeating it here bought nothing and cost three extra page loads, each
 * of which sits through the opening sequence.
 *
 * What remains is the part only this file covers: that the token clamps in
 * styles/tokens.css actually respond to viewport width, and hold at both ends
 * of the range. Both probes read computed values, so resizing is enough — a
 * fresh document per width would only re-pay the opening.
 */
test("the gutter and base type clamps track the viewport across the range", async ({
  page,
}) => {
  await page.goto("/");

  const measureAt = async (width: number) => {
    await page.setViewportSize({ width, height: 900 });
    return page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.width = "var(--gutter)";
      document.body.append(probe);
      const gutter = probe.getBoundingClientRect().width;
      probe.remove();
      return {
        gutter,
        bodySize: parseFloat(getComputedStyle(document.body).fontSize),
      };
    });
  };

  const small = await measureAt(320);
  const mid = await measureAt(800);
  const large = await measureAt(1920);

  // clamp(20px, 5vw, 60px): pinned to the floor on a small phone, to the
  // ceiling on a wide desktop, and fluid in between.
  expect(small.gutter).toBeCloseTo(20, 0);
  expect(large.gutter).toBeCloseTo(60, 0);
  expect(mid.gutter).toBeGreaterThan(20);
  expect(mid.gutter).toBeLessThan(60);

  // clamp(15px, 1.15vw, 17px) on the body.
  expect(small.bodySize).toBeCloseTo(15, 0);
  expect(large.bodySize).toBeCloseTo(17, 0);
  expect(large.bodySize).toBeGreaterThan(small.bodySize);
});
