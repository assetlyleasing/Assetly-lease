import { expect, test } from "./support/opening";

const NAV_LINKS = ["Compare", "Sectors", "About", "Contact"];

test("desktop navigation exposes the brand and approved links", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(page.getByRole("banner").getByRole("link", { name: "assetly leasing" })).toBeVisible();
  for (const label of NAV_LINKS) await expect(nav.getByRole("link", { name: label })).toBeVisible();
});

test("desktop section and route links reach the right destination", { tag: "@fast" }, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await nav.getByRole("link", { name: "Sectors" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await nav.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About Assetly");
});

test("navigation changes to the approved dark surface after scrolling", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header).toHaveAttribute("data-solid", "false");
  await page.mouse.wheel(0, 700);
  await expect(header).toHaveAttribute("data-solid", "true");
});

test("mobile menu opens full-width, traps focus, and returns it on Escape", { tag: "@fast" }, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const overlay = page.getByRole("navigation", { name: "Mobile" });
  await expect(overlay).toBeVisible();
  expect((await overlay.boundingBox())?.width).toBeGreaterThan(300);
  await expect(overlay.getByRole("link", { name: "Compare" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("mobile menu locks the page and closes after choosing a section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Contact" }).click();
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});

test("footer exposes brand, contact, navigation, and legal links", { tag: "@fast" }, async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toContainText("assetly leasing");
  await expect(footer.getByRole("link", { name: "finance@assetly.lease" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Terms of Use" })).toBeVisible();
});

test("primary landmarks and keyboard focus remain visible", { tag: "@fast" }, async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  const compare = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Compare" });
  await compare.focus();
  await expect(compare).toBeFocused();
  await expect(compare).toHaveCSS("outline-style", "solid");
});

test("the shell remains usable under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
