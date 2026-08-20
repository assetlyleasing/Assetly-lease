import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const PLATE_LAYER = "#hero [data-mobile-plate-mode]";
const CONTENT = "#hero > div:last-child";

async function openSettledHero(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-hero-loader='true']")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test.describe("Hero plate responsive composition", () => {
  test("keeps the remote spacing exactly between mark, heading and tagline", async ({
    page,
  }) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      await openSettledHero(page);

      const spacing = await page.evaluate(() => {
        const content = document.querySelector<HTMLElement>(
          "#hero > div:last-child",
        )!;
        const mark = document
          .querySelector<HTMLElement>("[data-hero-mark-target='true']")!
          .getBoundingClientRect();
        const heading = document
          .querySelector<HTMLElement>("#hero h1")!
          .getBoundingClientRect();
        const tagline = document
          .querySelector<HTMLElement>("#hero h1 + p")!
          .getBoundingClientRect();
        return {
          contract: Number.parseFloat(getComputedStyle(content).rowGap),
          markToHeading: heading.top - mark.bottom,
          headingToTagline: tagline.top - heading.bottom,
        };
      });

      expect(spacing.markToHeading, `a-to-heading gap at ${width}px`).toBeCloseTo(
        spacing.contract,
        1,
      );
      expect(
        spacing.headingToTagline,
        `heading-to-tagline gap at ${width}px`,
      ).toBeCloseTo(spacing.contract, 1);
    }
  });

  test("frames rather than intersects the copy above the phone breakpoint", async ({
    page,
  }) => {
    for (const width of [641, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await openSettledHero(page);

      const result = await page.evaluate(
        ({ layerSelector, contentSelector }) => {
          const layer = document.querySelector<HTMLElement>(layerSelector);
          const content = document.querySelector<HTMLElement>(contentSelector);
          if (!layer || !content) return null;

          const copy = content.getBoundingClientRect();
          const intersectsCopy = (region: SVGGElement) =>
            Array.from(
              region.querySelectorAll<SVGGeometryElement>(
                "path, line, polyline, circle",
              ),
            ).some((shape) => {
              const matrix = shape.getScreenCTM();
              if (!matrix || getComputedStyle(shape).display === "none") {
                return false;
              }
              const length = shape.getTotalLength();
              const step = Math.max(2, length / 240);
              for (let distance = 0; distance <= length; distance += step) {
                const local = shape.getPointAtLength(distance);
                const point = new DOMPoint(local.x, local.y).matrixTransform(
                  matrix,
                );
                if (
                  point.x >= copy.left - 4 &&
                  point.x <= copy.right + 4 &&
                  point.y >= copy.top - 4 &&
                  point.y <= copy.bottom + 4
                ) {
                  return true;
                }
              }
              return false;
            });
          const regions = Array.from(
            layer.querySelectorAll<SVGGElement>("[data-hero-plate-region]"),
          ).map((region) => {
            return {
              name: region.dataset.heroPlateRegion,
              intersects: intersectsCopy(region),
            };
          });

          return {
            display: getComputedStyle(layer).display,
            regions,
            overflow:
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth,
          };
        },
        { layerSelector: PLATE_LAYER, contentSelector: CONTENT },
      );

      expect(result, `missing composition at ${width}px`).not.toBeNull();
      expect(result!.display, `plate hidden at ${width}px`).not.toBe("none");
      expect(result!.overflow, `horizontal overflow at ${width}px`).toBe(false);
      expect(
        result!.regions.filter((region) => region.intersects),
        `plate crossed the copy at ${width}px`,
      ).toEqual([]);
    }
  });

  test("ships the combined plate on portrait phones and hides short landscapes", async ({
    page,
  }) => {
    for (const [width, height] of [
      [320, 700],
      [390, 844],
      [640, 900],
    ] as const) {
      await page.setViewportSize({ width, height });
      await openSettledHero(page);
      const layer = page.locator(PLATE_LAYER);
      await expect(layer).toHaveAttribute(
        "data-mobile-plate-mode",
        "both",
      );
      await expect(layer).toBeVisible();

      const state = await page.evaluate(() => {
        const regions = Array.from(
          document.querySelectorAll<SVGGElement>(
            "#hero [data-hero-plate-region]",
          ),
        )
          .filter((region) => getComputedStyle(region).display !== "none")
          .map((region) => region.dataset.heroPlateRegion);
        const datum = document.querySelector<SVGLineElement>(
          "#hero [data-hero-plate-region='datum'] line",
        )!;
        const datumBounds = datum.getBoundingClientRect();
        const growth = document.querySelector<SVGGElement>(
          "#hero [data-hero-plate-region='growth']",
        )!;
        const matrix = growth.getScreenCTM()!;
        const growthBases = [820, 940, 1060].map((x) =>
          new DOMPoint(x, 600).matrixTransform(matrix),
        );

        return {
          regions,
          datumLeft: datumBounds.left,
          datumRight: datumBounds.right,
          clientWidth: document.documentElement.clientWidth,
          datumY: datumBounds.top,
          growthBaseYs: growthBases.map((point) => point.y),
        };
      });

      expect(state.regions).toEqual(["access", "growth", "datum"]);
      expect(state.datumLeft).toBeLessThanOrEqual(0.5);
      expect(state.datumRight).toBeGreaterThanOrEqual(state.clientWidth - 0.5);
      for (const baseY of state.growthBaseYs) {
        expect(Math.abs(baseY - state.datumY)).toBeLessThanOrEqual(0.5);
      }
    }

    await page.setViewportSize({ width: 844, height: 390 });
    await openSettledHero(page);
    await expect(page.locator(PLATE_LAYER)).toHaveAttribute(
      "data-mobile-plate-mode",
      "both",
    );
    await expect(page.locator(PLATE_LAYER)).toBeHidden();
  });

  test("keeps the prepared Access and Growth alternatives collision-free", async ({
    page,
  }) => {
    for (const width of [320, 390, 640]) {
      await page.setViewportSize({ width, height: width === 320 ? 700 : 900 });
      await openSettledHero(page);

      for (const mode of ["access", "growth"] as const) {
        const layer = page.locator(PLATE_LAYER);
        await layer.evaluate((node, nextMode) => {
          (node as HTMLElement).dataset.mobilePlateMode = nextMode;
        }, mode);
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            ),
        );
        // The global reduced-motion cap still gives changed CSS properties a
        // maximum 120ms transition. This mutation is test-only; production
        // chooses the mode at build time and never switches it in the page.
        await page.waitForTimeout(140);
        await expect(layer).toBeVisible();

        const state = await page.evaluate(
          ({ layerSelector, contentSelector }) => {
            const root = document.querySelector<HTMLElement>(layerSelector)!;
            const copy = document
              .querySelector<HTMLElement>(contentSelector)!
              .getBoundingClientRect();
            const intersectsCopy = (region: SVGGElement) =>
              Array.from(
                region.querySelectorAll<SVGGeometryElement>(
                  "path, line, polyline, circle",
                ),
              ).some((shape) => {
                const matrix = shape.getScreenCTM();
                if (!matrix || getComputedStyle(shape).display === "none") {
                  return false;
                }
                const length = shape.getTotalLength();
                const step = Math.max(2, length / 240);
                for (
                  let distance = 0;
                  distance <= length;
                  distance += step
                ) {
                  const local = shape.getPointAtLength(distance);
                  const point = new DOMPoint(local.x, local.y).matrixTransform(
                    matrix,
                  );
                  if (
                    point.x >= copy.left - 4 &&
                    point.x <= copy.right + 4 &&
                    point.y >= copy.top - 4 &&
                    point.y <= copy.bottom + 4
                  ) {
                    return true;
                  }
                }
                return false;
              });
            const visible = Array.from(
              root.querySelectorAll<SVGGElement>("[data-hero-plate-region]"),
            )
              .filter((region) => getComputedStyle(region).display !== "none")
              .map((region) => {
                return {
                  name: region.dataset.heroPlateRegion,
                  intersects: intersectsCopy(region),
                };
              });
            return {
              visible,
              overflow:
                document.documentElement.scrollWidth >
                document.documentElement.clientWidth,
            };
          },
          { layerSelector: PLATE_LAYER, contentSelector: CONTENT },
        );

        expect(state.overflow, `${mode} overflow at ${width}px`).toBe(false);
        expect(
          state.visible.filter((region) => region.intersects),
          `${mode} crossed the copy at ${width}px`,
        ).toEqual([]);
        expect(state.visible.map((region) => region.name)).toEqual(
          mode === "access" ? ["access", "datum"] : ["growth"],
        );
      }
    }
  });

  test("settles at twenty percent and is static under reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openSettledHero(page);

    const state = await page.locator("#hero svg").evaluate((plate) => {
      const frame = plate.parentElement;
      return {
        opacity: Number.parseFloat(getComputedStyle(plate).opacity),
        plateAnimation: getComputedStyle(plate).animationName,
        frameAnimation: frame ? getComputedStyle(frame).animationName : null,
      };
    });

    expect(state.opacity).toBeCloseTo(0.2, 2);
    expect(state.plateAnimation).toBe("none");
    expect(state.frameAnimation).toBe("none");
  });

  test("draws in the darker tone before resolving to the final Olive", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero svg")).toHaveCSS(
      "animation-name",
      /plateDrift/,
      { timeout: 7000 },
    );

    const tones = await page.locator("#hero svg").evaluate((plate) => {
      const frame = plate.parentElement!;
      const tone = frame
        .getAnimations()
        .find(
          (animation) =>
            "animationName" in animation &&
            String(animation.animationName).includes("plateDrawTone"),
        );
      if (!tone) return null;

      tone.pause();
      tone.currentTime = 500;
      const drawing = getComputedStyle(frame).color;
      tone.currentTime = 2600;
      const settled = getComputedStyle(frame).color;

      return {
        drawing,
        settled,
      };
    });

    expect(tones).not.toBeNull();
    expect(tones!.drawing).not.toBe(tones!.settled);
  });
});
