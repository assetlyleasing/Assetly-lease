import { type Page } from "@playwright/test";

import { expect, test } from "./support/opening";

const PANEL = "#compare-calculator";
const CONTROL = '[aria-controls="compare-calculator"]';
const SLIDES = [
  ["obsolescence", "Use what you need. Leave the ownership behind.", "Risk of Obsolescence"],
  ["tax-treatment", "A simpler tax treatment.", "Tax Treatment"],
  ["leverage", "Keep leverage light. Keep capacity available.", "Leverage Impact"],
  ["upfront-cash", "Preserve capital. Keep your business moving.", "Upfront Cash"],
] as const;

async function centreSlide(page: Page, index: number) {
  await page.evaluate((slideIndex) => {
    const section = document.getElementById("compare");
    if (!section) throw new Error("Compare section missing");
    const rect = section.getBoundingClientRect();
    const slideHeight = rect.height / 4;
    window.scrollTo({
      top:
        rect.top + window.scrollY + slideHeight * slideIndex + slideHeight / 2 -
        window.innerHeight / 2,
      behavior: "instant",
    });
  }, index);
  await page.waitForTimeout(300);
}

test("Compare renders the four approved arguments", { tag: "@fast" }, async ({ page }) => {
  await page.goto("/");

  for (const [id, headline] of SLIDES) {
    const article = page.locator(`#compare-slide-${id}`);
    await expect(article).toHaveCount(1);
    await expect(article.getByRole("heading", { level: 2 })).toContainText(headline);
  }
});

test("Compare calculator follows the argument in focus", async ({ page }) => {
  await page.goto("/");

  for (const index of [0, 3]) {
    await centreSlide(page, index);
    await expect(page.locator(`${PANEL} h2`)).toHaveText(SLIDES[index][2]);
  }
});

test("Compare control is keyboard-operable and meets the touch minimum", async ({ page }) => {
  await page.goto("/");
  await centreSlide(page, 0);

  const control = page.locator(CONTROL);
  const box = await control.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  await control.focus();
  await page.keyboard.press("Enter");
  await expect(control).toHaveAttribute("aria-expanded", "false");
  await expect(control).toBeFocused();
});

test("Compare stays contained and usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await centreSlide(page, 0);

  await expect(page.locator(PANEL)).toBeVisible();
  await expect(page.locator(CONTROL)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("Compare remains complete and usable under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await centreSlide(page, 1);

  await expect(page.locator(PANEL)).toBeVisible();
  await expect(page.locator("#compare-slide-tax-treatment")).toHaveCSS("opacity", "1");
  const offset = await page
    .locator("#compare-slide-tax-treatment svg path")
    .first()
    .evaluate((path) => getComputedStyle(path).strokeDashoffset);
  expect(offset === "0px" || offset === "0").toBe(true);
});
