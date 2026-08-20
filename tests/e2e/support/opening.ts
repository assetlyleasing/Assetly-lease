import { test as base, expect, type Page } from "@playwright/test";

/**
 * Navigation that waits out the opening signature (§11a, Phase 8.5).
 *
 * Every spec in this directory was written before the opening existed, and
 * every one of them scrolls, hovers or clicks as its first act after loading
 * the page. The opening is a fixed full-screen overlay above the whole
 * document, with body scroll locked, for about 4.8 seconds — so those first
 * acts land on the overlay instead of the page: a hover never reaches the card
 * under it, and a panel opened while the overlay still holds the scroll lock
 * captures `overflow: hidden` as the value to restore when it closes.
 *
 * Rather than teach seventy-odd call sites to wait, navigation itself waits.
 * Specs opt in by importing `test` and `expect` from here instead of from
 * `@playwright/test`. `hero-loader.spec.ts` is the one file that must not: it
 * exists to watch the opening happen.
 */
export async function settleOpening(page: Page) {
  /*
   * `detached` is already satisfied when nothing matches, so this costs a tick
   * on `/about` and on any page that never mounts the loader.
   */
  await page.locator("[data-hero-loader='true']").waitFor({
    state: "detached",
    timeout: 20_000,
  });
}

export const test = base.extend({
  /*
   * Playwright's docs call this second argument `use`; renamed here only
   * because that name makes the React hooks lint rule read it as a hook call.
   */
  page: async ({ page }, runTest) => {
    const goto = page.goto.bind(page);

    page.goto = async (url: string, options?: Parameters<Page["goto"]>[1]) => {
      const response = await goto(url, options);
      await settleOpening(page);
      return response;
    };

    await runTest(page);
  },
});

export { expect };
