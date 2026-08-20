import { type Page } from "@playwright/test";

import { expect, test } from "./support/opening";

const SECTION = "#why-us";
const CARDS = `${SECTION} button[aria-pressed]`;

async function showWhyUs(page: Page) {
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
}

test.describe("Why Assetly — content and entrance", () => {
  test("renders the approved heading and four values", async ({ page }) => {
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

    for (const cell of await page.locator(`${SECTION} [role="listitem"]`).all()) {
      await expect(cell).toHaveCSS("opacity", "1");
      await expect(cell).toHaveCSS("transform", "none");
    }
  });
});

test.describe("Why Assetly — activation", () => {
  test("click flips only the target and multiple cards stay open", async ({ page }) => {
    await showWhyUs(page);
    const cards = page.locator(CARDS);

    await cards.nth(0).click();
    await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "false");

    await cards.nth(1).click();
    await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "true");

    await cards.nth(0).click();
    await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "false");
    await expect(cards.nth(1)).toHaveAttribute("aria-pressed", "true");
  });

  test("hover gives feedback but never flips", async ({ page }) => {
    await showWhyUs(page);
    const card = page.locator(CARDS).first();

    await card.hover();
    await page.waitForTimeout(800);
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await expect(card).toHaveAttribute("data-flipped", "false");
  });

  test("native Enter and Space operation preserve focus", async ({ page }) => {
    await showWhyUs(page);
    const card = page.locator(CARDS).nth(2);

    await card.focus();
    await expect(card).toBeFocused();
    await expect(card).toHaveCSS("outline-style", "solid");

    await page.keyboard.press("Enter");
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await expect(card).toBeFocused();

    await page.keyboard.press("Space");
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await expect(card).toBeFocused();
  });

  test("exposes only the active face to assistive technology", async ({ page }) => {
    await showWhyUs(page);
    const card = page.getByRole("button", { name: "Tailored Structuring" });

    await expect(card.locator('[aria-hidden="true"]')).toHaveCount(1);
    await expect(card.locator("[data-a11y-description]")).toHaveCount(0);
    const frontDescription = await card.getAttribute("aria-describedby");
    expect(frontDescription).toBeTruthy();

    await card.click();
    const activeDescription = card.locator("[data-a11y-description]");
    await expect(activeDescription).toHaveCount(1);
    await expect(activeDescription).toContainText(
      "Lease structures shaped around asset, tenure, cash-flow needs, and business context rather than a standard template.",
    );
    const activeDescriptionId = await activeDescription.getAttribute("id");
    expect(activeDescriptionId).toBeTruthy();
    await expect(card).toHaveAttribute("aria-describedby", activeDescriptionId!);

    await card.click();
    await expect(card.locator("[data-a11y-description]")).toHaveCount(0);
    await expect(card).toHaveAttribute("aria-describedby", frontDescription!);
  });

  test("shows every back face in full — the card is shorter than the copy is not", async ({
    page,
  }) => {
    await showWhyUs(page);

    /*
     * `.face` is `overflow: hidden`, so a card too short for its explanation
     * truncates the copy silently rather than scrolling it — nothing fails, the
     * words are simply gone. S is the longest of the four; it names six
     * sectors. Measured on all four so a future type change cannot creep past.
     */
    const overflow = await page.locator('[data-face="back"]').evaluateAll((faces) =>
      faces.map((face) => face.scrollHeight - face.clientHeight),
    );

    expect(overflow).toHaveLength(4);
    for (const overflowing of overflow) expect(overflowing).toBeLessThanOrEqual(1);
  });

  test("keeps the card and section boxes locked while flipping", async ({ page }) => {
    await showWhyUs(page);
    const section = page.locator(SECTION);
    const card = page.locator(CARDS).nth(3);
    const sectionBefore = (await section.boundingBox())!;
    const cardBefore = (await card.boundingBox())!;
    const cardDocumentYBefore = await card.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );

    await card.click();
    await page.waitForTimeout(1000);

    const sectionAfter = (await section.boundingBox())!;
    const cardAfter = (await card.boundingBox())!;
    const cardDocumentYAfter = await card.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
    expect(Math.round(sectionAfter.height)).toBe(Math.round(sectionBefore.height));
    expect(Math.round(cardAfter.height)).toBe(Math.round(cardBefore.height));
    expect(Math.abs(cardDocumentYAfter - cardDocumentYBefore)).toBeLessThanOrEqual(2);
  });
});

test.describe("Why Assetly — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("shows every back face in full at 390px too", async ({ page }) => {
    await showWhyUs(page);
    const overflow = await page.locator('[data-face="back"]').evaluateAll((faces) =>
      faces.map((face) => face.scrollHeight - face.clientHeight),
    );

    expect(overflow).toHaveLength(4);
    for (const overflowing of overflow) expect(overflowing).toBeLessThanOrEqual(1);
  });

  test("recomposes to one column and tap flips without layout jump", async ({ page }) => {
    await showWhyUs(page);
    const cards = page.locator(CARDS);
    const boxes = await cards.evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }),
    );

    expect(new Set(boxes.map((box) => Math.round(box.x))).size).toBe(1);
    expect(boxes[1].y).toBeGreaterThan(boxes[0].y + boxes[0].height - 1);

    const before = (await cards.nth(0).boundingBox())!;
    await cards.nth(0).tap();
    await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
    await page.waitForTimeout(1000);
    const after = (await cards.nth(0).boundingBox())!;
    expect(Math.round(after.height)).toBe(Math.round(before.height));

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Why Assetly — reduced motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("shows all content and swaps faces without 3D motion", async ({ page }) => {
    await showWhyUs(page);
    const card = page.locator(CARDS).first();
    const stage = card.locator('[aria-hidden="true"]');
    const faces = stage.locator(":scope > span");

    await card.click();
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await expect(stage).toHaveCSS("transform", "none");
    await expect(faces.nth(0)).toHaveCSS("opacity", "0");
    await expect(faces.nth(1)).toHaveCSS("opacity", "1");

    const duration = await faces.nth(1).evaluate((node) =>
      Number.parseFloat(getComputedStyle(node).transitionDuration) || 0,
    );
    expect(duration).toBeLessThanOrEqual(0.12);
  });
});
