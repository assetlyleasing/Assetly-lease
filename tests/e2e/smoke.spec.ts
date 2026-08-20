import { expect, test } from "@playwright/test";

/**
 * Phase 0 smoke test (MASTER_PLAN.md Phase 0, "Tests"): the root route responds
 * 200 with the expected title, and the design foundation actually reaches the
 * browser. Section-level flows are covered from Phase 1 onward.
 */
test("root route responds 200 with the expected title", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Assetly");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Assetly");
});

test("design tokens and base typography are applied", async ({ page }) => {
  await page.goto("/");

  const paper = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--paper").trim(),
  );
  expect(paper).toBe("#f6f4ec");

  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(246, 244, 236)");

  const headingFont = await page.evaluate(() => {
    const heading = document.querySelector("h1");
    return heading ? getComputedStyle(heading).fontFamily : "";
  });
  expect(headingFont).toContain("DM Serif Display");
});

test("placeholder routes render", async ({ page }) => {
  const about = await page.goto("/about");
  expect(about?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "About Assetly",
  );

  const admin = await page.goto("/admin");
  expect(admin?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Admin");
});
