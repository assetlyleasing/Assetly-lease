import { type Page } from "@playwright/test";

import { expect, test } from "./support/opening";

const SECTION = "#why-us";
const CARDS = `${SECTION} button[aria-pressed]`;

async function showWhyUs(page: Page) {
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
}

test("Why Assetly renders the four approved values", async ({ page }) => {
  await showWhyUs(page);
  await expect(page.getByRole("heading", { level: 2, name: "Why Assetly" })).toBeVisible();
  await expect(page.locator(CARDS)).toHaveCount(4);
  for (const name of [
    "Tailored Structuring",
    "Fast Turnaround",
    "Multi-Sector Expertise",
    "Strong Funding Partners",
  ]) {
    await expect(page.getByRole("button", { name })).toBeVisible();
  }
});

test("Why Assetly cards work by pointer and keyboard without changing layout", async ({ page }) => {
  await showWhyUs(page);
  const card = page.locator(CARDS).first();
  const before = await card.boundingBox();

  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await card.focus();
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("aria-pressed", "false");
  await expect(card).toBeFocused();

  const after = await card.boundingBox();
  expect(after?.width).toBeCloseTo(before?.width ?? 0, 0);
  expect(after?.height).toBeCloseTo(before?.height ?? 0, 0);
});

test("Why Assetly fits and stays readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await showWhyUs(page);
  const cards = page.locator(CARDS);
  await cards.nth(3).click();
  await expect(cards.nth(3)).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
