import { expect, test } from "./support/opening";

/**
 * Phase 3 admin auth gate (TRUST-002, DEC-057). This covers what can be
 * verified without the real admin credentials, which only the project owner
 * holds: the unauthenticated redirect, the login form itself, and a genuine
 * round trip to Firebase Auth with a wrong password. The authenticated
 * upload/manage flow (TRUST-005/006/007) needs a manual pass with the real
 * account — see PROGRESS.md.
 */
test.describe("Admin auth gate", () => {
  test("an unauthenticated visitor is redirected from /admin to /admin/login", { tag: "@fast" }, async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Admin sign-in");
  });

  test("the login form exposes labeled email and password fields", { tag: "@fast" }, async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("the branded login keeps a logical keyboard order and visible focus", async ({ page }) => {
    await page.goto("/admin/login");

    const brandLink = page.getByRole("link", { name: "Assetly homepage" });
    await brandLink.focus();
    await expect(brandLink).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Email")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Password")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Sign in securely" })).toBeFocused();

    const outline = await page.getByRole("button", { name: "Sign in securely" }).evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    );
    expect(outline).not.toBe("none");
  });

  test("the login recomposes without overflow and preserves touch targets on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/login");

    await expect(page.getByText("Private workspace")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Admin sign-in");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);

    for (const control of [
      page.getByLabel("Email"),
      page.getByLabel("Password"),
      page.getByRole("button", { name: "Sign in securely" }),
    ]) {
      const box = await control.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test("an incorrect password is rejected with a clear error and no navigation", { tag: "@fast" }, async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("no-such-admin@assetly.lease");
    await page.getByLabel("Password").fill("definitely-wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Incorrect email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
