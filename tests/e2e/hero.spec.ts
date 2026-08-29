import { expect, test } from "./support/opening";

/**
 * Phase 2 — Hero and plate system (§11).
 *
 * Covers MASTER_PLAN Phase 2's test list: the entry sequence completes, the
 * reduced-motion variant shows the final state immediately, the Hero renders
 * across the viewport range, and nothing blocks its paint.
 */

const HEADLINE = "The lighter balance sheet.";

test.describe("hero", () => {
  test("renders the locked DEC-018 copy as the page h1", { tag: "@fast" }, async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveCount(1);

    // Normalised, because the sentence is split across two mask lines.
    const text = await heading.evaluate((node) =>
      (node.textContent ?? "").replace(/\s+/g, " ").trim(),
    );
    expect(text).toBe(HEADLINE);

    // Scoped: the Footer carries the same tagline (§17).
    await expect(
      page.locator("section#hero").getByText("Access . Scale . Grow"),
    ).toBeVisible();
  });

  test("emphasises one word in Moss (§7)", async ({ page }) => {
    await page.goto("/");

    const emphasis = page.getByRole("heading", { level: 1 }).locator("i");
    await expect(emphasis).toHaveCount(1);
    await expect(emphasis).toHaveText("lighter");

    // --moss is #5C5C46.
    await expect(emphasis).toHaveCSS("color", "rgb(92, 92, 70)");
  });

  test("the entry sequence completes and leaves content visible", { tag: "@fast" }, async ({
    page,
  }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // The mask lines settle at translateY(0) once the sequence has run.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const line = document.querySelector("h1 span > span");
            if (!line) return null;
            return getComputedStyle(line).transform;
          }),
        { timeout: 9000 },
      )
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

    await expect
      .poll(() =>
        page.evaluate(() => {
          const subline = document.querySelector("h1 + p");
          return subline ? getComputedStyle(subline).opacity : null;
        }),
      )
      .toBe("1");
  });

  test("the plate is decorative and draws itself", { tag: "@motion" }, async ({ page }) => {
    await page.goto("/");

    const plate = page.locator("section#hero svg");
    await expect(plate).toHaveCount(1);
    await expect(plate).toHaveAttribute("aria-hidden", "true");

    // Hidden from the accessibility tree, so the Hero exposes no image role.
    await expect(page.locator("section#hero").getByRole("img")).toHaveCount(0);

    // Strokes end fully drawn.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const stroke = document.querySelector("section#hero svg path");
            if (!stroke) return null;
            return getComputedStyle(stroke).strokeDashoffset;
          }),
        { timeout: 9000 },
      )
      .toBe("0px");
  });

  test("the plate fades as the visitor leaves the hero (§11 stage 3)", { tag: "@motion" }, async ({
    page,
  }) => {
    await page.goto("/");

    const readFade = () =>
      page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>("section#hero");
        return hero
          ? parseFloat(
              getComputedStyle(hero).getPropertyValue("--hero-plate-fade"),
            )
          : null;
      });

    await expect.poll(readFade).toBe(1);

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.75));
    await expect.poll(readFade).toBeLessThan(1);
  });

  test("the plate comes alive after it draws (§11 stage 2)", { tag: "@motion" }, async ({
    page,
  }) => {
    await page.goto("/");

    // Ambient drift starts only once the entrance has run.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const svg = document.querySelector("section#hero svg");
            if (!svg) return null;
            const style = getComputedStyle(svg);
            return {
              name: style.animationName,
              duration: parseFloat(style.animationDuration),
              iteration: style.animationIterationCount,
              direction: style.animationDirection,
            };
          }),
        { timeout: 6000 },
      )
      .toMatchObject({
        iteration: "infinite",
        direction: "alternate",
      });

    const drift = await page.evaluate(() => {
      const svg = document.querySelector("section#hero svg");
      return svg ? parseFloat(getComputedStyle(svg).animationDuration) : 0;
    });

    // §11 asks for a slow 8–12s cycle.
    expect(drift).toBeGreaterThanOrEqual(8);
    expect(drift).toBeLessThanOrEqual(12);
  });

  test("fills the viewport without horizontal overflow, 320px to 1920px", async ({
    page,
  }) => {
    // Layout reflows on resize, so one document serves the whole sweep. A
    // fresh navigation per width only re-pays the opening sequence for a
    // measurement that reads the same either way.
    await page.goto("/");

    for (const width of [320, 390, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBe(false);

      const heroHeight = await page
        .locator("section#hero")
        .evaluate((node) => node.getBoundingClientRect().height);
      expect(heroHeight, `hero too short at ${width}px`).toBeGreaterThan(600);

      // Kept from responsive.spec.ts, whose narrower copy of this sweep this
      // one replaces.
      await expect(
        page.getByRole("heading", { level: 1 }),
        `h1 not visible at ${width}px`,
      ).toBeVisible();
    }
  });

  test("paints without waiting on any network fetch (§21)", async ({ page }) => {
    // §21: the Hero must never depend on a request. Phase 3 gave Trusted By a
    // real Firestore subscription that starts as soon as the homepage mounts
    // client-side (§12 deliberately fetches early, to avoid a later layout
    // shift), and it can complete its handshake within a couple of seconds —
    // too fast for a client-side "is the heading visible yet" race to reliably
    // isolate the Hero from it. Proven structurally instead: the Hero headline
    // is already present in the raw, server-rendered HTML, before any client
    // script — Firestore's included — has had a chance to run at all.
    const response = await page.goto("/");
    const html = await response!.text();

    expect(html).toContain("<h1");
    expect(html).toContain("lighter");
    expect(html).toContain("balance sheet.");
  });
});

test.describe("hero under reduced motion", { tag: "@motion" }, () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("shows the final state immediately (§8)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const state = await page.evaluate(() => {
      const line = document.querySelector("h1 span > span");
      const subline = document.querySelector("h1 + p");
      const stroke = document.querySelector("section#hero svg path");
      const svg = document.querySelector("section#hero svg");
      return {
        lineTransform: line ? getComputedStyle(line).transform : null,
        sublineOpacity: subline ? getComputedStyle(subline).opacity : null,
        dashOffset: stroke ? getComputedStyle(stroke).strokeDashoffset : null,
        dashArray: stroke ? getComputedStyle(stroke).strokeDasharray : null,
        plateVisible: svg ? parseFloat(getComputedStyle(svg).opacity) > 0 : null,
      };
    });

    expect(state.lineTransform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    expect(state.sublineOpacity).toBe("1");
    // The plate's meaningful end state is "drawn", so it is drawn, not hidden.
    expect(state.dashOffset).toBe("0px");
    expect(state.dashArray).toBe("none");
    expect(state.plateVisible).toBe(true);
  });

  test("the living plate stops moving entirely", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Every assertion below reads a computed style that reduced motion pins
    // from first paint; this only lets the entrance transition finish so the
    // layer transform has resolved to its identity value.
    await page.waitForTimeout(300);

    const motion = await page.evaluate(() => {
      const svg = document.querySelector("section#hero svg");
      const layer = document.querySelector<HTMLElement>("section#hero > div");
      const node = document.querySelector("section#hero svg circle");
      return {
        plateAnimation: svg ? getComputedStyle(svg).animationName : null,
        nodeAnimation: node ? getComputedStyle(node).animationName : null,
        layerTransform: layer ? getComputedStyle(layer).transform : null,
      };
    });

    expect(motion.plateAnimation).toBe("none");
    expect(motion.nodeAnimation).toBe("none");
    expect(motion.layerTransform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });
});
