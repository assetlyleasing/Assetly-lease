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

  test("replaces only one slot and advances forward", async ({ page }) => {
    await showSectors(page);
    const before = await sectorIds(page);

    await page.waitForTimeout(2600);
    await expect(page.locator(`${CARDS}[data-sector-id="healthcare"]`)).toHaveCount(1);
    const after = await sectorIds(page);
    expect(after.filter((id, index) => id !== before[index])).toHaveLength(1);

    await page.waitForTimeout(2500);
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

  test("hover and keyboard focus pause before another swap", async ({ page }) => {
    await showSectors(page);
    const grid = page.locator(GRID);

    await grid.hover();
    const onHover = await sectorIds(page);
    await page.waitForTimeout(3200);
    expect(await sectorIds(page)).toEqual(onHover);

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

  test("uses one compact column on mobile and hides descriptors", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await showSectors(page);
    const cells = page.locator(`${GRID} > [role="listitem"]`);
    const xPositions = await cells.evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().x)),
    );

    expect(new Set(xPositions).size).toBe(1);
    await expect(page.locator(`${CARDS} p`).first()).toBeHidden();
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
