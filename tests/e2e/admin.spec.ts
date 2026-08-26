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
  test("an unauthenticated visitor is redirected from /admin to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Admin sign-in");
  });

  test("the login form exposes labeled email and password fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("an incorrect password is rejected with a clear error and no navigation", async ({
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
