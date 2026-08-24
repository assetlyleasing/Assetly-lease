import { expect, test } from "./support/opening";

const PARAGRAPHS = [
  "Assetly is a leasing platform built for growing businesses. We purchase office furniture and fit-outs, IT equipment, medical equipment, and plant & machinery, and lease these assets to corporate customers under fixed-term rental contracts – a simple, no-ownership model.",
  "Instead of a large upfront purchase, customers pay a fixed rental for the assets they use – for exactly as long as they need it. This keeps costs predictable, frees up working capital, and gives businesses the flexibility to scale and upgrade as their needs change.",
  "The result: businesses preserve capital, simplify budgeting, and stay agile as their asset needs evolve.",
  "At Assetly Leasing, our strength lies in the depth and diversity of our leadership. Bringing together decades of combined experience in finance, business development, operations and facility management, our leaders drive the strategic vision, operational excellence, and financial discipline that power Assetly's growth as an asset leasing platform.",
] as const;

test.describe("About page", () => {
  test("renders only the approved company copy and temporary media slot", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { level: 1, name: "About Assetly" })).toBeVisible();
    for (const paragraph of PARAGRAPHS) {
      await expect(page.getByText(paragraph)).toBeVisible();
    }
    await expect(page.getByText("Bengaluru", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("region", { name: "About Assetly" }).getByRole("link", {
        name: "finance@assetly.lease",
      }),
    ).toHaveAttribute("href", "mailto:finance@assetly.lease");
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/assetly-leasing/",
    );
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "target",
      "_blank",
    );

    const placeholder = page.locator("[data-about-media-placeholder]");
    await expect(placeholder).toBeVisible();
    await expect(placeholder).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("main img")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/founder|timeline|statistics/i);
  });

  test("publishes route-specific title, description and Open Graph metadata", async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle("About Assetly | Assetly");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Learn how Assetly structures operating leases to help businesses preserve working capital and maintain financial flexibility.",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "About Assetly | Assetly",
    );
  });

  test("uses the shared shell and returns to homepage sections", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const compare = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Compare" });
    await expect(compare).toHaveAttribute("href", "/#compare");
    await compare.click();
    await expect(page).toHaveURL(/\/#compare$/);
    await expect(page.locator("#compare")).toBeVisible();

    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Company" })
      .getByRole("link", { name: "About Us" })
      .click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("gives the longer copy more room on desktop and moves media above it on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about");
    const layout = page.locator("main section > div > div");
    const media = page.locator("[data-about-media-placeholder]");
    const desktopLayout = (await layout.boundingBox())!;
    const desktopMedia = (await media.boundingBox())!;
    expect(desktopMedia.width / desktopLayout.width).toBeGreaterThan(0.32);
    expect(desktopMedia.width / desktopLayout.width).toBeLessThan(0.43);

    const navBottom = await page
      .getByRole("banner")
      .evaluate((node) => node.getBoundingClientRect().bottom);
    expect(desktopMedia.y).toBeGreaterThanOrEqual(navBottom);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileMedia = (await media.boundingBox())!;
    const heading = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    expect(mobileMedia.y + mobileMedia.height).toBeLessThan(heading.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test("shows the final layout immediately under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about");

    const states = await page.locator("main .rv-u").evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node);
        return {
          opacity: style.opacity,
          transform: style.transform,
          transitionDuration: style.transitionDuration,
        };
      }),
    );
    expect(states.every((state) => state.opacity === "1")).toBe(true);
    expect(states.every((state) => state.transform === "none")).toBe(true);
    expect(
      states.every((state) => Number.parseFloat(state.transitionDuration) <= 0.12),
    ).toBe(true);
  });
});
