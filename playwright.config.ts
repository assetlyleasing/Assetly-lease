import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Some environments ship a preinstalled Chromium instead of the build Playwright
 * downloads. Point PLAYWRIGHT_CHROMIUM_EXECUTABLE at it to use it; leave the
 * variable unset everywhere else and Playwright uses its own browser.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = executablePath ? { executablePath } : undefined;

/**
 * User-flow and interaction tests (SOURCE_OF_TRUTH.md §19).
 *
 * The suite runs in Chromium only (DEC-063) and is tiered by tag, so the whole
 * of it does not have to run on every change:
 *
 *   npm run test:e2e:fast    @fast  - the everyday gate
 *   npm run test:e2e         all    - before a phase commit
 *   npm run test:e2e:motion  @motion - after touching loader or plate timing
 *
 * Tests run in parallel. The `--workers=1` rule this project carried until now
 * existed for false failures on the WebKit mobile sheet, and WebKit was removed
 * in DEC-063 — the reason went with it.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /*
   * Playwright's default is 30s. Since Phase 8.5 every load of `/` plays the
   * ~4.8s opening before a spec can touch the page, and the specs that check
   * one thing across several viewport sizes navigate three or four times, so
   * the default no longer covers a passing test.
   */
  timeout: 75_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "list" : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    launchOptions,
  },
  // One primary browser keeps the suite proportional to this two-page site.
  // Cross-engine behavior is covered by the manual release smoke pass.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
