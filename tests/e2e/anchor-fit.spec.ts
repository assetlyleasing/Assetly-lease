import { expect, test, type Page } from "@playwright/test";

import { settleOpening } from "./support/opening";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1440, height: 760 },
  { width: 390, height: 844 },
] as const;

const TARGETS = ["why-us", "sectors", "contact"] as const;

async function measureAnchorFit(page: Page, id: (typeof TARGETS)[number]) {
  await page.evaluate((target) => {
    document.documentElement.style.scrollBehavior = "auto";
    window.location.hash = target;
  }, id);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(`#${id}`);
  await page.waitForTimeout(50);

  return page.locator(`#${id}`).evaluate((section) => {
    const box = section.getBoundingClientRect();
    const header = document.querySelector<HTMLElement>("header");
    return {
      cutAbove: Math.max(0, (header?.getBoundingClientRect().bottom ?? 0) - box.top),
      cutBelow: Math.max(0, box.bottom - window.innerHeight),
      top: box.top,
      height: box.height,
    };
  });
}

/** Only the desktop case runs in the everyday gate. */
const fastTier = (v: (typeof VIEWPORTS)[number]) =>
  v.width === 1440 && v.height === 900 ? "@fast" : [];

test.describe("Anchor targets fit below the fixed navigation", () => {
  for (const viewport of VIEWPORTS) {
    // The desktop case is the everyday gate; the other two ride the full tier.
    test(`${viewport.width}x${viewport.height}`, { tag: fastTier(viewport) }, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await settleOpening(page);

      const results: Array<{
        target: (typeof TARGETS)[number];
        cutAbove: number;
        cutBelow: number;
        top: number;
        height: number;
      }> = [];
      for (const target of TARGETS) {
        const fit = await measureAnchorFit(page, target);
        results.push({ target, ...fit });
      }

      expect(
        results.every(({ cutAbove, cutBelow }) => cutAbove <= 1 && cutBelow <= 1),
        JSON.stringify(results, null, 2),
      ).toBe(true);
    });
  }
});
