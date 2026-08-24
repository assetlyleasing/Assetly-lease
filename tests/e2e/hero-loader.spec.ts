import { expect, test, type Page } from "@playwright/test";

const LOADER = "[data-hero-loader='true']";
const MARK = "[data-hero-mark-target='true'] > span";
const TARGET = "[data-hero-mark-target='true']";

async function waitForPhase(page: Page, phase: string) {
  await expect(page.locator(LOADER)).toHaveAttribute("data-phase", phase, {
    timeout: 7000,
  });
}

test.describe("Hero opening loader", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("uses the approved opening surface, colors, type treatment, and stacking", async ({
    page,
  }) => {
    await page.goto("/");

    const loader = page.locator(LOADER);
    const mark = page.locator(MARK);
    const tagline = loader.getByText("ACCESS · SCALE · GROW");

    await expect(loader).toHaveCSS("background-color", "rgb(33, 36, 26)");
    await expect(mark).toHaveCSS("color", "rgb(231, 227, 212)");
    await expect(tagline).toHaveCSS("color", "rgb(177, 173, 119)");
    await expect(tagline).toHaveCSS("text-transform", "none");

    const stacking = await page.evaluate(() => {
      const overlay = document.querySelector<HTMLElement>(
        "[data-hero-loader='true']",
      );
      const header = document.querySelector<HTMLElement>("header");
      const plateStroke = document.querySelector<SVGElement>(
        "section#hero svg path",
      );
      const openingMark = document.querySelector<HTMLElement>(
        "[data-hero-mark-target='true'] > span",
      );
      const markBox = openingMark?.getBoundingClientRect();
      return {
        overlay: overlay ? Number(getComputedStyle(overlay).zIndex) : 0,
        header: header ? Number(getComputedStyle(header).zIndex) : 0,
        plateDashOffset: plateStroke
          ? getComputedStyle(plateStroke).strokeDashoffset
          : "0px",
        markAboveOverlay:
          openingMark && markBox
            ? document.elementFromPoint(
                markBox.left + markBox.width / 2,
                markBox.top + markBox.height / 2,
              ) === openingMark
            : false,
      };
    });

    expect(stacking.overlay).toBeGreaterThan(stacking.header);
    expect(stacking.plateDashOffset).not.toBe("0px");
    expect(stacking.markAboveOverlay).toBe(true);
    await expect
      .poll(() =>
        page.evaluate(() => getComputedStyle(document.body).overflowY),
      )
      .toBe("hidden");
  });

  test("blinks exactly twice without moving the tagline or fully hiding the mark", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForPhase(page, "signature");

    const blinkDefinition = await page.locator(MARK).evaluate((mark) => {
      const animation = mark.getAnimations()[0];
      const effect = animation?.effect as KeyframeEffect | null;
      const frames = effect?.getKeyframes() ?? [];
      return {
        dimFrames: frames.filter(
          (frame) => Number(frame.opacity) === 0.25,
        ).length,
        iterations: effect?.getTiming().iterations ?? 0,
      };
    });
    expect(blinkDefinition).toEqual({ dimFrames: 2, iterations: 1 });

    const samples = await page.evaluate(async () => {
      const mark = document.querySelector<HTMLElement>(
        "[data-hero-mark-target='true'] > span",
      );
      const tagline = document.querySelector<HTMLElement>(
        "[data-hero-loader='true'] p",
      );
      if (!mark || !tagline) return [];

      const readings: Array<{
        opacity: number;
        taglineOpacity: number;
        taglineX: number;
        taglineY: number;
      }> = [];
      const end = performance.now() + 2350;
      while (
        performance.now() < end &&
        document
          .querySelector("[data-hero-loader='true']")
          ?.getAttribute("data-phase") === "signature"
      ) {
        const box = tagline.getBoundingClientRect();
        readings.push({
          opacity: Number(getComputedStyle(mark).opacity),
          taglineOpacity: Number(getComputedStyle(tagline).opacity),
          taglineX: box.x,
          taglineY: box.y,
        });
        await new Promise((resolve) => setTimeout(resolve, 32));
      }
      return readings;
    });

    expect(samples.length).toBeGreaterThan(10);
    expect(Math.min(...samples.map((sample) => sample.opacity))).toBeGreaterThan(
      0.18,
    );

    expect(
      Math.max(...samples.map((sample) => sample.taglineOpacity)) -
        Math.min(...samples.map((sample) => sample.taglineOpacity)),
    ).toBeLessThan(0.001);
    expect(
      Math.max(...samples.map((sample) => sample.taglineX)) -
        Math.min(...samples.map((sample) => sample.taglineX)),
    ).toBeLessThan(0.5);
    expect(
      Math.max(...samples.map((sample) => sample.taglineY)) -
        Math.min(...samples.map((sample) => sample.taglineY)),
    ).toBeLessThan(0.5);
  });

  test("recedes, moves to the measured Hero destination, then reveals content", async ({
    page,
  }) => {
    await page.goto("/");

    const heroBefore = await page.locator("#hero").boundingBox();
    const openingMark = await page.locator(MARK).boundingBox();

    await waitForPhase(page, "recede");
    await page.waitForTimeout(550);
    const recededMark = await page.locator(MARK).boundingBox();
    expect(recededMark!.width).toBeLessThan(openingMark!.width * 0.82);

    await waitForPhase(page, "settle");
    await page.waitForTimeout(700);
    const nearTarget = await page.locator(MARK).boundingBox();
    const openingCenterY = openingMark!.y + openingMark!.height / 2;
    const settledCenterY = nearTarget!.y + nearTarget!.height / 2;
    expect(Math.abs(settledCenterY - openingCenterY)).toBeGreaterThan(25);

    const lineBeforeReveal = await page
      .locator("h1 span > span")
      .first()
      .evaluate((node) => getComputedStyle(node).transform);
    expect(lineBeforeReveal).not.toMatch(
      /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
    );

    await waitForPhase(page, "hold");
    const holdStart = await page.locator(MARK).boundingBox();
    await page.waitForTimeout(180);
    const holdEnd = await page.locator(MARK).boundingBox();
    expect(Math.abs(holdEnd!.x - holdStart!.x)).toBeLessThan(0.5);
    expect(Math.abs(holdEnd!.y - holdStart!.y)).toBeLessThan(0.5);
    expect(Math.abs(holdEnd!.width - holdStart!.width)).toBeLessThan(0.5);

    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 4000 });
    const destination = await page.locator(TARGET).boundingBox();
    const settled = await page.locator(MARK).boundingBox();
    expect(Math.abs(settled!.x - destination!.x)).toBeLessThan(1.5);
    expect(Math.abs(settled!.y - destination!.y)).toBeLessThan(1.5);
    expect(Math.abs(settled!.width - destination!.width)).toBeLessThan(1.5);
    await expect
      .poll(() =>
        page
          .locator("h1 span > span")
          .first()
          .evaluate((node) => getComputedStyle(node).transform),
      )
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

    const heroAfter = await page.locator("#hero").boundingBox();
    expect(Math.abs(heroAfter!.y - heroBefore!.y)).toBeLessThan(0.5);
    expect(Math.abs(heroAfter!.height - heroBefore!.height)).toBeLessThan(0.5);
  });

  test("replays on reload but not after client-side back navigation", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 10_000 });

    await page.getByRole("link", { name: "About" }).first().click();
    await expect(page).toHaveURL(/\/about$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(LOADER)).toHaveCount(0);

    await page.reload();
    await waitForPhase(page, "signature");
  });

  test("never opens on About and stays skipped on client navigation to Home", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(page.locator(LOADER)).toHaveCount(0);

    await page
      .getByRole("banner")
      .getByRole("link", { name: "assetly leasing", exact: true })
      .click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(LOADER)).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "The lighter balance sheet.",
    );
  });

  test("fits and settles at 320px without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");

    const opening = await page.locator(MARK).boundingBox();
    expect(opening!.x).toBeGreaterThanOrEqual(0);
    expect(opening!.x + opening!.width).toBeLessThanOrEqual(320);

    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 7000 });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});

test.describe("Hero opening under reduced motion", () => {
  test("skips blink and recession and lands on the final still state", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 7000 });
    await expect(page.locator("#hero")).toHaveAttribute(
      "data-opening-phase",
      "done",
    );

    const state = await page.locator(MARK).evaluate((mark) => {
      const style = getComputedStyle(mark);
      return {
        animation: style.animationName,
        color: style.color,
      };
    });
    expect(state.animation).toBe("none");
    expect(state.color).toBe("rgb(64, 64, 45)");

    const mark = await page.locator(MARK).boundingBox();
    const target = await page.locator(TARGET).boundingBox();
    expect(Math.abs(mark!.x - target!.x)).toBeLessThan(1.5);
    expect(Math.abs(mark!.y - target!.y)).toBeLessThan(1.5);
  });
});

test.describe("Hero opening slow-device check", () => {
  test("completes under four-times CPU throttling", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "CDP throttling is Chromium-only");
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    const started = Date.now();
    await page.goto("/");
    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 9000 });
    expect(Date.now() - started).toBeLessThan(9000);

    await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  });
});
