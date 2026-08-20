import { expect, test, type Page } from "@playwright/test";

const SECTION = "#sectors";
const GRID = `${SECTION} [data-sectors-grid]`;
const CARDS = `${GRID} [data-sector-card]`;

async function showSectors(page: Page) {
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
}

async function sectorIds(page: Page) {
  return page.locator(CARDS).evaluateAll((cards) =>
    cards.map((card) => card.getAttribute("data-sector-id")),
  );
}

test.describe("Sectors — content and rotation", () => {
  test("renders four of the locked six sectors in a quiet list", async ({ page }) => {
    await showSectors(page);

    await expect(page.getByRole("heading", { level: 2, name: "Sectors We Serve" })).toBeVisible();
    await expect(page.locator(CARDS)).toHaveCount(4);
    await expect(page.locator(GRID)).toHaveAttribute("aria-live", "off");
    await expect(page.locator(GRID)).toHaveAttribute("tabindex", "0");
    expect(await sectorIds(page)).toEqual([
      "commercial-interiors",
      "manufacturing",
      "construction",
      "hospitality",
    ]);
  });

  test("replaces only one slot at a time and advances forward", async ({ page }) => {
    await showSectors(page);

    /*
     * Sampled rather than snapshotted at a fixed delay. §15's guarantee is that
     * the grid never refreshes together, and at a 1.2s interval a single
     * before/after pair taken around one swap is a race — a slow frame lands
     * two changes inside the window and the test fails for the wrong reason.
     * Watching consecutive samples asserts the actual invariant.
     */
    const samples: (string | null)[][] = [];
    for (let sample = 0; sample < 26; sample += 1) {
      samples.push(await sectorIds(page));
      await page.waitForTimeout(200);
    }

    let changes = 0;
    for (let index = 1; index < samples.length; index += 1) {
      const previous = samples[index - 1];
      const current = samples[index];
      const differing = current.filter((id, slot) => id !== previous[slot]).length;
      expect(differing).toBeLessThanOrEqual(1);
      changes += differing;
    }

    expect(changes).toBeGreaterThan(0);
    await expect(page.locator(`${CARDS}[data-sector-id="healthcare"]`)).toHaveCount(1);
    await expect(page.locator(`${CARDS}[data-sector-id="it-infrastructure"]`)).toHaveCount(1);
  });

  test("new artwork mounts and draws when a sector enters", async ({ page }) => {
    await showSectors(page);
    await page.waitForTimeout(2700);

    const plate = page.locator('[data-sector-plate="healthcare"] svg');
    await expect(plate).toBeVisible();
    const firstPath = plate.locator("path").first();
    await expect
      .poll(async () => Number.parseFloat(await firstPath.evaluate((node) => getComputedStyle(node).strokeDashoffset)))
      .toBeLessThan(2200);
  });

  test("hovering one card holds that card and only that card", async ({ page }) => {
    await showSectors(page);

    await page.locator(`${GRID} [data-sector-slot="1"]`).hover();
    const held = await sectorIds(page);
    await page.waitForTimeout(4200);
    const after = await sectorIds(page);

    expect(after[1]).toBe(held[1]);
    const moved = [0, 2, 3].filter((slot) => after[slot] !== held[slot]);
    expect(moved.length).toBeGreaterThan(0);
  });

  test("keyboard focus pauses the whole grid", async ({ page }) => {
    await showSectors(page);
    const grid = page.locator(GRID);

    await page.mouse.move(0, 0);
    await grid.focus();
    const onFocus = await sectorIds(page);
    await page.waitForTimeout(3200);
    expect(await sectorIds(page)).toEqual(onFocus);
    await expect(grid).toBeFocused();
  });
});

test.describe("Sectors — responsive and motion preferences", () => {
  test("uses a two by two desktop ledger without overflow", async ({ page }) => {
    await showSectors(page);
    const boxes = await page.locator(`${GRID} > [role="listitem"]`).evaluateAll((cells) =>
      cells.map((cell) => {
        const element = cell as HTMLElement;
        return { x: element.offsetLeft, y: element.offsetTop, height: element.offsetHeight };
      }),
    );

    expect(new Set(boxes.map((box) => box.x)).size).toBe(2);
    expect(new Set(boxes.map((box) => box.y)).size).toBe(2);
    expect(new Set(boxes.map((box) => box.height)).size).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
  });

  test("keeps all four cards on one screen so the rotation is visible", async ({ page }) => {
    await showSectors(page);

    const { gridHeight, viewport, navBlock } = await page.evaluate(() => {
      const grid = document.querySelector("[data-sectors-grid]") as HTMLElement;
      const header = document.querySelector("header") as HTMLElement;
      return {
        gridHeight: grid.getBoundingClientRect().height,
        viewport: window.innerHeight,
        // Measured, not read from --nav-block: an unregistered custom property
        // resolves to its literal `clamp(...)` text, which parses as NaN.
        navBlock: header.getBoundingClientRect().height,
      };
    });

    // Four sectors change one at a time; that only reads if four are in view.
    expect(gridHeight).toBeLessThanOrEqual(viewport - navBlock);
  });

  test("uses one compact column on mobile and hides descriptors", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await showSectors(page);
    const cells = page.locator(`${GRID} > [role="listitem"]`);
    const xPositions = await cells.evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().x)),
    );

    expect(new Set(xPositions).size).toBe(1);
    await expect(page.locator(`${CARDS} p`).first()).toBeHidden();

    // §15 keeps four sectors visible at once on mobile too.
    const stackHeight = await page
      .locator(GRID)
      .evaluate((grid) => grid.getBoundingClientRect().height);
    expect(stackHeight).toBeLessThanOrEqual(844 - 94);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test("stops rotation and shows completed plates under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await showSectors(page);
    const before = await sectorIds(page);
    await expect(page.locator(GRID)).toHaveAttribute("data-reduced-motion", "true");
    await page.waitForTimeout(3500);
    expect(await sectorIds(page)).toEqual(before);

    const styles = await page.locator(`${CARDS} svg path`).first().evaluate((path) => {
      const style = getComputedStyle(path);
      return { dash: style.strokeDasharray, offset: style.strokeDashoffset };
    });
    expect(styles.dash === "none" || styles.offset === "0px").toBe(true);
  });
});
