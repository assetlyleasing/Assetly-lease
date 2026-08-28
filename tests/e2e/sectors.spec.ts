import { type Page } from "@playwright/test";

import { expect, test } from "./support/opening";

const SECTION = "#sectors";
const GRID = `${SECTION} [data-sectors-grid]`;
const CARDS = `${GRID} [data-sector-card]`;

async function showSectors(page: Page) {
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
}

test("Sectors shows four entries from the approved six-sector set", async ({ page }) => {
  await showSectors(page);
  await expect(page.getByRole("heading", { level: 2, name: "Sectors We Serve" })).toBeVisible();
  await expect(page.locator(CARDS)).toHaveCount(4);
  const approved = new Set([
    "commercial-interiors",
    "manufacturing",
    "construction",
    "hospitality",
    "healthcare",
    "it-infrastructure",
  ]);
  const ids = await page.locator(CARDS).evaluateAll((cards) =>
    cards.map((card) => card.getAttribute("data-sector-id")),
  );
  expect(ids.every((id) => id !== null && approved.has(id))).toBe(true);
});

test("Sectors uses one contained column on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await showSectors(page);
  const xPositions = await page.locator(`${GRID} > [role="listitem"]`).evaluateAll((items) =>
    items.map((item) => Math.round(item.getBoundingClientRect().x)),
  );
  expect(new Set(xPositions).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("Sectors becomes static under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await showSectors(page);
  const before = await page.locator(CARDS).evaluateAll((cards) =>
    cards.map((card) => card.getAttribute("data-sector-id")),
  );
  await expect(page.locator(GRID)).toHaveAttribute("data-reduced-motion", "true");
  await page.waitForTimeout(1600);
  const after = await page.locator(CARDS).evaluateAll((cards) =>
    cards.map((card) => card.getAttribute("data-sector-id")),
  );
  expect(after).toEqual(before);
});
