import { expect, test } from "./support/opening";

/**
 * Phase 0 smoke test (MASTER_PLAN.md Phase 0, "Tests"): the root route responds
 * 200 with the expected title, and the design foundation actually reaches the
 * browser. Section-level flows are covered from Phase 1 onward.
 */
test("root route responds 200 with the expected title", { tag: "@fast" }, async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Assetly | Access. Scale. Grow.");
  // The page's single h1 is the Hero proposition; hero.spec.ts asserts its
  // exact locked wording.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("design tokens and base typography are applied", { tag: "@fast" }, async ({ page }) => {
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

test("public and internal routes render", { tag: "@fast" }, async ({ page }) => {
  const about = await page.goto("/about");
  expect(about?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "About Assetly",
  );

  // Phase 3: /admin is auth-gated (TRUST-002) and redirects an unauthenticated
  // visitor to /admin/login rather than rendering the panel directly.
  const admin = await page.goto("/admin");
  expect(admin?.status()).toBe(200);
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Admin sign-in");
});
