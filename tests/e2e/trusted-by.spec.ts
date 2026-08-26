import { expect, test } from "./support/opening";

/**
 * Phase 3 public Trusted By strip (§12). The Firestore project has no admin
 * data yet as of this cycle, so the meaningful thing to verify here is the
 * empty-state contract itself: no toggle document / no active logos must
 * degrade to "section absent," never to a visible error or a blocked Hero.
 * The admin-populated marquee (TRUST-008/009) needs a follow-up visual pass
 * once the owner has uploaded real logos — see PROGRESS.md.
 */
test("the homepage renders with Trusted By absent when disabled or empty, and Hero is not blocked", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#trusted-by")).toHaveCount(0);
  expect(errors).toEqual([]);
});
