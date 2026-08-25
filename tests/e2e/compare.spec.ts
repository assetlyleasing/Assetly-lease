import { type Page } from "@playwright/test";

import { expect, test } from "./support/opening";

/**
 * Phase 4 — the Compare experience (§13).
 *
 * Covers `MASTER_PLAN.md` Phase 4's test list: scroll-through sync, manual
 * override and its persistence, desktop reflow, mobile sheet stability, the
 * responsive pass, reduced motion, and the RAF loop's frame rate under scroll.
 */

const CALCULATOR = '[aria-controls="compare-calculator"]';
const PANEL = "#compare-calculator";
const GRAPH = `${PANEL} [data-compare-graph]`;

/** In DEC-053's reading order — `centreSlide` addresses these by index. */
const SLIDES = [
  {
    id: "obsolescence",
    index: "01",
    headline: "Use what you need. Leave the ownership behind.",
    title: "Risk of Obsolescence",
    values: ["Assetly bears it", "You bear it", "You bear it"],
    tiers: ["low", "high", "high"],
  },
  {
    id: "tax-treatment",
    index: "02",
    headline: "A simpler tax treatment.",
    title: "Tax Treatment",
    values: ["Full rental deductible", "Depreciation + interest", "Depreciation only"],
    tiers: ["high", "mid", "low"],
  },
  {
    id: "leverage",
    index: "03",
    headline: "Keep leverage light. Keep capacity available.",
    title: "Leverage Impact",
    values: ["Minimal impact", "Raises Debt/Equity", "Drains cash"],
    tiers: ["low", "high", "high"],
  },
  {
    id: "upfront-cash",
    index: "04",
    headline: "Preserve capital. Keep your business moving.",
    title: "Upfront Cash",
    values: ["Low", "10–25% margin", "100% upfront"],
    tiers: ["minimal", "mid", "high"],
  },
];

/** Scroll so the given argument's midpoint sits on the viewport's centre line. */
async function centreSlide(page: Page, index: number) {
  await page.evaluate((slideIndex) => {
    const section = document.getElementById("compare");
    if (!section) throw new Error("no compare section");
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const slideHeight = rect.height / 4;
    window.scrollTo({
      top:
        sectionTop +
        slideHeight * slideIndex +
        slideHeight / 2 -
        window.innerHeight / 2,
      behavior: "instant",
    });
  }, index);
  await page.waitForTimeout(250);
}

/** The section's live openness, as the scroll loop last wrote it. */
function openness(page: Page) {
  return page.evaluate(() => {
    const section = document.getElementById("compare");
    if (!section) return null;
    const value = getComputedStyle(section)
      .getPropertyValue("--compare-openness")
      .trim();
    return value === "" ? null : Number(value);
  });
}

test.describe("compare — content", () => {
  test("renders all four arguments with their locked copy (§13)", async ({
    page,
  }) => {
    await page.goto("/");

    for (const slide of SLIDES) {
      const article = page.locator(`#compare-slide-${slide.id}`);
      await expect(article).toHaveCount(1);

      const heading = article.getByRole("heading", { level: 2 });
      const text = await heading.evaluate((node) =>
        (node.textContent ?? "").replace(/\s+/g, " ").trim(),
      );
      expect(text).toBe(slide.headline);

      // §7's emphasis device: exactly one italic word, in Moss.
      const emphasis = heading.locator("i");
      await expect(emphasis).toHaveCount(1);
      await expect(emphasis).toHaveCSS("color", "rgb(92, 92, 70)");
    }
  });

  test("plates are decorative and draw fully (§13, §20)", async ({ page }) => {
    await page.goto("/");

    for (const [index, slide] of SLIDES.entries()) {
      await centreSlide(page, index);

      const plate = page.locator(`#compare-slide-${slide.id} svg`);
      await expect(plate).toHaveAttribute("aria-hidden", "true");
      // Never announced as an image, and never named.
      await expect(page.locator(`#compare-slide-${slide.id} svg[role]`)).toHaveCount(0);

      await expect
        .poll(
          () =>
            page.evaluate((slideId) => {
              const stroke = document.querySelector(
                `#compare-slide-${slideId} svg path`,
              );
              return stroke
                ? getComputedStyle(stroke).strokeDashoffset
                : null;
            }, slide.id),
          { timeout: 6000 },
        )
        .toBe("0px");
    }
  });
});

test.describe("compare — the calculator", () => {
  test("is absent for the whole of the Hero (§13, DESIGN_SYSTEM §8)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(CALCULATOR)).toHaveCount(0);
    await expect(page.locator(PANEL)).toHaveCount(0);

    // Still absent with the Hero merely half scrolled past.
    await page.evaluate(() =>
      window.scrollTo({ top: window.innerHeight * 0.5, behavior: "instant" }),
    );
    await page.waitForTimeout(250);
    await expect(page.locator(CALCULATOR)).toHaveCount(0);
  });

  test("arrives open by the time the first argument is read", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    await expect(page.locator(PANEL)).toBeVisible();
    expect(await openness(page)).toBeGreaterThan(0.98);
    await expect(page.locator(CALCULATOR)).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  test("syncs its reading to whichever argument is in focus", async ({
    page,
  }) => {
    await page.goto("/");

    for (const [index, slide] of SLIDES.entries()) {
      await centreSlide(page, index);

      await expect(page.locator(`${PANEL} h2`)).toHaveText(slide.title);

      const values = page.locator(`${PANEL} dd`);
      await expect(values).toHaveCount(3);
      for (const [column, value] of slide.values.entries()) {
        await expect(values.nth(column)).toHaveText(value);
      }

      const fills = page.locator(`${GRAPH} [data-tier]`);
      await expect(fills).toHaveCount(3);
      for (const [column, tier] of slide.tiers.entries()) {
        await expect(fills.nth(column)).toHaveAttribute("data-tier", tier);
      }

      // The mode row reports the same argument.
      await expect(
        page.locator(`${PANEL} button[aria-pressed="true"]`),
      ).toHaveCount(1);
      await expect(
        page.locator(`${PANEL} button[aria-pressed="true"]`),
      ).toContainText(slide.title);
    }
  });

  test("keeps one graph mounted while its qualitative tiers transition", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    await page.locator(GRAPH).evaluate((node) => {
      (window as typeof window & { compareGraphNode?: Element }).compareGraphNode =
        node;
    });

    await centreSlide(page, 1);
    expect(
      await page.evaluate(
        () =>
          (window as typeof window & { compareGraphNode?: Element })
            .compareGraphNode === document.querySelector("[data-compare-graph]"),
      ),
    ).toBe(true);

    const fills = page.locator(`${GRAPH} [data-tier]`);
    for (const [column, tier] of SLIDES[1].tiers.entries()) {
      await expect(fills.nth(column)).toHaveAttribute("data-tier", tier);
    }
  });

  test("renders a tall, weighted, fully visible graph", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const fill = (await page.locator(`${GRAPH} [data-tier]`).first().boundingBox())!;
    const track = (await page
      .locator(`${GRAPH} [data-tier]`)
      .first()
      .locator("xpath=..")
      .boundingBox())!;

    expect(track.height).toBeGreaterThanOrEqual(189);
    expect(track.height).toBeLessThanOrEqual(271);
    /*
     * The bar carries the reading, so it is drawn with weight rather than as a
     * hairline. The upper bound and the proportion are the same guard as
     * before: three columns that never meet, at any drawer width.
     */
    expect(fill.width).toBeGreaterThanOrEqual(56);
    expect(fill.width).toBeLessThanOrEqual(76);
    expect(fill.width).toBeLessThan(track.width * 0.65);
  });

  test("syncs backwards too, not only on the way down", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 3);
    await expect(page.locator(`${PANEL} h2`)).toHaveText(SLIDES[3].title);

    await centreSlide(page, 1);
    await expect(page.locator(`${PANEL} h2`)).toHaveText(SLIDES[1].title);
  });

  test("announces the mode politely, and only the mode (§20)", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 2);

    const live = page.locator(`${PANEL} [aria-live="polite"]`);
    await expect(live).toHaveCount(1);
    await expect(live).toHaveText(SLIDES[2].title);
  });

  test("slides away before Why Us is properly on screen", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const whyUs = document.getElementById("why-us");
      if (!whyUs) throw new Error("no why-us section");
      whyUs.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await page.waitForTimeout(300);

    await expect(page.locator(CALCULATOR)).toHaveCount(0);
  });
});

test.describe("compare — manual override (§13)", () => {
  test("closes on click, stays closed while scrolling, and reopens", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const tab = page.locator(CALCULATOR);
    await expect(tab).toHaveAttribute("aria-expanded", "true");

    await tab.click();
    await expect(tab).toHaveAttribute("aria-expanded", "false");
    await expect.poll(() => openness(page), { timeout: 3000 }).toBeLessThan(0.02);

    // Auto-sync has gone silent: scrolling through the rest of the section
    // must not reopen it.
    for (const index of [1, 2, 3]) {
      await centreSlide(page, index);
      expect(await openness(page)).toBeLessThan(0.02);
    }

    // The reading still follows the reader while the panel is closed.
    await expect(page.locator(`${PANEL} h2`)).toHaveText(SLIDES[3].title);

    await tab.click();
    await expect(tab).toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => openness(page), { timeout: 3000 }).toBeGreaterThan(0.98);
  });

  test("is operable by keyboard, with a visible focus ring (§20)", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const tab = page.locator(CALCULATOR);
    await tab.focus();
    await expect(tab).toBeFocused();
    await expect(tab).toHaveCSS("outline-style", "solid");

    await page.keyboard.press("Enter");
    await expect(tab).toHaveAttribute("aria-expanded", "false");
  });

  test("meets the 44px touch-target minimum (§20)", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const box = await page.locator(CALCULATOR).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("the mode row jumps to the argument it names", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    await page.locator(`${PANEL} button`).nth(1).click();

    await expect(page.locator(`${PANEL} h2`)).toHaveText(SLIDES[1].title);
    await expect(
      page.locator(`${PANEL} button[aria-pressed="true"]`),
    ).toContainText(SLIDES[1].title);
  });
});

test.describe("compare — desktop drawer", () => {
  test("narrows the argument column rather than covering it (§13)", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const article = page.locator("#compare-slide-obsolescence");
    const narrowed = (await article.boundingBox())!;
    const panel = (await page.locator(PANEL).boundingBox())!;

    // The column ends before the panel begins — no overlap at all.
    expect(narrowed.x + narrowed.width).toBeLessThanOrEqual(panel.x + 1);

    await page.locator(CALCULATOR).click();
    await expect.poll(() => openness(page), { timeout: 3000 }).toBeLessThan(0.02);

    const full = (await article.boundingBox())!;
    expect(full.width).toBeGreaterThan(narrowed.width + 100);
  });

  test("uses the chevron tab, and only one calculator exists", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    await expect(page.locator(CALCULATOR)).toHaveCount(1);
    await expect(page.locator(PANEL)).toHaveCount(1);
    await expect(page.locator(CALCULATOR)).toContainText("‹");
  });

  test("dims and blurs the arguments either side of the one in focus", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 1);

    const read = (id: string) =>
      page.evaluate((slideId) => {
        const body = document.querySelector(`#compare-slide-${slideId} > * > *`);
        if (!body) return null;
        const style = getComputedStyle(body);
        return { opacity: Number(style.opacity), filter: style.filter };
      }, id);

    const focused = await read(SLIDES[1].id);
    const neighbour = await read(SLIDES[2].id);

    expect(focused!.opacity).toBeGreaterThan(0.95);
    expect(focused!.filter === "none" || focused!.filter.includes("blur(0")).toBe(
      true,
    );

    expect(neighbour!.opacity).toBeLessThan(focused!.opacity);
    expect(neighbour!.filter).toContain("blur");
  });
});

test.describe("compare — mobile bottom sheet", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("uses a sheet with a triangle handle, not the desktop drawer", async ({
    page,
  }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const handle = page.locator(CALCULATOR);
    await expect(handle).toHaveCount(1);
    await expect(handle).toContainText("▼");

    const box = (await handle.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("keeps a stable height across all four arguments (§13, §20)", async ({
    page,
  }) => {
    await page.goto("/");

    const heights: number[] = [];
    const slideHeights: number[] = [];

    for (const [index, slide] of SLIDES.entries()) {
      await centreSlide(page, index);
      await expect(page.locator(`${PANEL} h2`)).toHaveText(slide.title);

      heights.push((await page.locator(PANEL).boundingBox())!.height);
      slideHeights.push(
        (await page.locator(`#compare-slide-${slide.id}`).boundingBox())!.height,
      );
    }

    // Not "roughly stable" — the sheet's height is fixed by CSS and must not
    // move by a pixel as the reading changes underneath it.
    expect(new Set(heights.map((h) => Math.round(h))).size).toBe(1);
    expect(new Set(slideHeights.map((h) => Math.round(h))).size).toBe(1);
  });

  test("stays within the §13 height band", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const height = (await page.locator(PANEL).boundingBox())!.height;
    const viewport = page.viewportSize()!.height;

    expect(height / viewport).toBeGreaterThanOrEqual(0.34);
    expect(height / viewport).toBeLessThanOrEqual(0.42);
  });

  test("never covers the argument copy", async ({ page }) => {
    await page.goto("/");

    for (const [index, slide] of SLIDES.entries()) {
      await centreSlide(page, index);

      const copy = page.locator(`#compare-slide-${slide.id} p`).last();
      const copyBox = (await copy.boundingBox())!;
      const sheetBox = (await page.locator(PANEL).boundingBox())!;

      expect(copyBox.y + copyBox.height).toBeLessThanOrEqual(sheetBox.y + 1);
    }
  });
});

test.describe("compare — reduced motion (§8)", () => {
  /*
   * Emulated per page rather than through `test.use`, matching
   * tests/e2e/hero.spec.ts — the fixture form does not reach the page in this
   * setup, and a reduced-motion test that silently runs without the preference
   * asserts nothing.
   */
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("shows the arguments present, sharp and unmoved", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 1);

    for (const slide of SLIDES) {
      const state = await page.evaluate((slideId) => {
        const body = document.querySelector(`#compare-slide-${slideId} > * > *`);
        if (!body) return null;
        const style = getComputedStyle(body);
        return {
          opacity: Number(style.opacity),
          filter: style.filter,
          transform: style.transform,
        };
      }, slide.id);

      expect(state!.opacity).toBe(1);
      expect(state!.filter).toBe("none");
      expect(state!.transform === "none" || state!.transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    }
  });

  test("snaps the drawer open instead of scrubbing it", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 1);

    expect(await openness(page)).toBe(1);
    await expect(page.locator(PANEL)).toBeVisible();

    // Part-way through what would be the opening band, it is still all or
    // nothing — never a fractional value.
    await page.evaluate(() => {
      const section = document.getElementById("compare");
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - window.innerHeight * 0.2,
        behavior: "instant",
      });
    });
    await page.waitForTimeout(250);

    const value = await openness(page);
    expect([0, 1]).toContain(value);
  });

  test("leaves the plates drawn and the calculator usable", async ({ page }) => {
    await page.goto("/");
    await centreSlide(page, 0);

    const dash = await page.evaluate(() => {
      const stroke = document.querySelector("#compare-slide-obsolescence svg path");
      return stroke ? getComputedStyle(stroke).strokeDasharray : null;
    });
    expect(dash).toBe("none");

    const tab = page.locator(CALCULATOR);
    await tab.click();
    await expect(tab).toHaveAttribute("aria-expanded", "false");

    await expect(page.locator(`${GRAPH} [data-tier]`).first()).toHaveCSS(
      "transition-duration",
      "0s",
    );
  });
});

test.describe("compare — responsive", () => {
  const widths = [320, 390, 700, 768, 1024, 1440, 1920];

  for (const width of widths) {
    test(`fits at ${width}px without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await centreSlide(page, 1);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      await expect(page.locator(PANEL)).toBeVisible();
      await expect(page.locator(CALCULATOR)).toHaveCount(1);
    });
  }
});

test.describe("compare — performance", () => {
  test("the scroll loop holds its frame rate through the section", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    const frames = await page.evaluate(async () => {
      const section = document.getElementById("compare");
      if (!section) throw new Error("no compare section");

      const rect = section.getBoundingClientRect();
      const start = rect.top + window.scrollY - 600;
      const distance = rect.height + 1200;

      window.scrollTo({ top: start, behavior: "instant" });
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const durations: number[] = [];
      let last = performance.now();
      let travelled = 0;

      await new Promise<void>((resolve) => {
        const step = () => {
          const now = performance.now();
          durations.push(now - last);
          last = now;
          travelled += 26;
          window.scrollTo({ top: start + travelled, behavior: "instant" });
          if (travelled >= distance) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      durations.shift();
      const sorted = [...durations].sort((a, b) => a - b);
      return {
        count: durations.length,
        p95: sorted[Math.floor(sorted.length * 0.95)],
        worst: Math.max(...durations),
      };
    });

    // Generous, because this runs against `next dev` in React's development
    // build. It is still a real guard: a loop that thrashed layout — reads
    // interleaved with writes, or a width recomputed every frame regardless of
    // whether it changed — blows straight past these.
    expect(frames.count).toBeGreaterThan(50);
    expect(frames.p95).toBeLessThan(60);
    expect(frames.worst).toBeLessThan(200);
  });
});
