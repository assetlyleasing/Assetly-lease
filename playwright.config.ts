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
 * The full regression suite runs in Chromium. Interaction-heavy completed
 * sections also run in WebKit; Phase 10 broadens that second-engine coverage.
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
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit-interactions",
      testMatch: /(hero-loader|why-us|sectors|contact)\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
