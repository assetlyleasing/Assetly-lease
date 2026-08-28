import { expect, test } from "@playwright/test";

test("the opening signature appears once and hands off to the Hero", async ({ page }) => {
  await page.goto("/");
  const loader = page.locator('[data-hero-loader="true"]');
  await expect(loader).toBeVisible();
  await expect(loader).toContainText("ACCESS · SCALE · GROW");
  await expect(loader).toHaveCount(0, { timeout: 12_000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the opening skips motion and fits on a reduced-motion phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('[data-hero-loader="true"]')).toHaveCount(0, { timeout: 4_000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
