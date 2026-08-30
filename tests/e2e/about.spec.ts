import { expect, test } from "./support/opening";

const PARAGRAPHS = [
  "Assetly is a leasing platform built for growing businesses. We purchase office furniture and fit-outs, IT equipment, medical equipment, and plant & machinery, and lease these assets to corporate customers under fixed-term rental contracts – a simple, no-ownership model.",
  "Instead of a large upfront purchase, customers pay a fixed rental for the assets they use – for exactly as long as they need it. This keeps costs predictable, frees up working capital, and gives businesses the flexibility to scale and upgrade as their needs change.",
  "The result: businesses preserve capital, simplify budgeting, and stay agile as their asset needs evolve.",
  "At Assetly Leasing, our strength lies in the depth and diversity of our leadership. Bringing together decades of combined experience in finance, business development, operations and facility management, our leaders drive the strategic vision, operational excellence, and financial discipline that power Assetly's growth as an asset leasing platform.",
] as const;

test.describe("About page", () => {
  test("renders the approved company copy and the leadership photograph", { tag: "@fast" }, async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { level: 1, name: "About Assetly" })).toBeVisible();
    for (const paragraph of PARAGRAPHS) {
      await expect(page.getByText(paragraph)).toBeVisible();
    }
    await expect(page.getByText("Bengaluru", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("region", { name: "About Assetly" }).getByRole("link", {
        name: "finance@assetly.lease",
      }),
    ).toHaveAttribute("href", "mailto:finance@assetly.lease");
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/assetly-leasing/",
    );
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "target",
      "_blank",
    );

    const media = page.locator("main img");
    await expect(media).toHaveCount(1);
    await expect(media).toBeVisible();
    await expect(media).toHaveAttribute(
      "alt",
      "Four members of the Assetly leadership team standing together in business attire against a plain grey backdrop.",
    );
    const srcset = await media.getAttribute("srcset");
    const widths = [...(srcset ?? "").matchAll(/\s(\d+)w/g)].map((match) => Number(match[1]));
    expect(Math.max(...widths)).toBeGreaterThanOrEqual(1600);
    await expect(page.locator("main")).not.toContainText(/founder|timeline|statistics/i);
  });

  test("publishes route-specific title, description and Open Graph metadata", { tag: "@fast" }, async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle("About Assetly | Assetly");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Learn how Assetly structures operating leases to help businesses preserve working capital and maintain financial flexibility.",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "About Assetly | Assetly",
    );
  });

  test("uses the shared shell and returns to homepage sections", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const compare = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Compare" });
    await expect(compare).toHaveAttribute("href", "/#compare");
    await compare.click();
    await expect(page).toHaveURL(/\/#compare$/);
    await expect(page.locator("#compare")).toBeVisible();

    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Company" })
      .getByRole("link", { name: "About Us" })
      .click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("places the photograph beside the copy on desktop, and above it on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/about");
    const heading = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    const media = page.locator("[data-about-media]");
    const desktopMedia = (await media.boundingBox())!;
    const firstParagraph = (await page.getByText(PARAGRAPHS[0]).boundingBox())!;
    // Side by side on desktop: copy on the left, photo to its right.
    expect(desktopMedia.x).toBeGreaterThanOrEqual(heading.x + heading.width);
    expect(desktopMedia.x).toBeGreaterThanOrEqual(firstParagraph.x + firstParagraph.width);

    const navBottom = await page
      .getByRole("banner")
      .evaluate((node) => node.getBoundingClientRect().bottom);
    expect(heading.y).toBeGreaterThanOrEqual(navBottom);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const mobileHeading = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
    const mobileMedia = (await media.boundingBox())!;
    // Stacked on mobile: photo above the heading and copy.
    expect(mobileMedia.y + mobileMedia.height).toBeLessThanOrEqual(mobileHeading.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test(
    "keeps an even cream mat around an uncropped photograph",
    { tag: "@fast" },
    async ({ page }) => {
      /*
       * The frame's height must come from the photograph plus its padding. When
       * the frame carried `aspect-ratio` of its own and the image was sized at
       * `height: 100%`, two separate faults followed: the content box left for
       * the image was flatter than the image's own ratio, so `object-fit: cover`
       * cropped roughly 24px off the picture at every width, and WebKit resolved
       * that percentage height against the border box instead of the content
       * box, so on Safari the image covered the bottom band of cream entirely.
       *
       * Chromium can only see the first of those. The uneven-mat assertion is
       * still worth making here: it is the shape of the bug, and it fails on
       * this engine too if the ratio ever moves back onto the frame.
       */
      for (const [width, height] of [
        [1440, 900],
        [390, 844],
      ] as const) {
        await page.setViewportSize({ width, height });
        await page.goto("/about");
        await page.locator("[data-about-media] img").waitFor({ state: "visible" });

        const frame = await page.locator("[data-about-media]").evaluate((node) => {
          const image = node.querySelector("img")!;
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          const picture = image.getBoundingClientRect();
          return {
            creamAbove: picture.top - box.top - parseFloat(style.borderTopWidth),
            creamBelow:
              box.bottom - parseFloat(style.borderBottomWidth) - picture.bottom,
            drawnHeight: picture.height,
            uncroppedHeight:
              picture.width / (image.naturalWidth / image.naturalHeight),
          };
        });

        expect(frame.creamAbove, `no cream above at ${width}px`).toBeGreaterThan(8);
        expect(
          Math.abs(frame.creamAbove - frame.creamBelow),
          `mat is uneven at ${width}px`,
        ).toBeLessThan(1);
        expect(
          Math.abs(frame.uncroppedHeight - frame.drawnHeight),
          `photograph is cropped at ${width}px`,
        ).toBeLessThan(1.5);
      }
    },
  );

  test("shows the final layout immediately under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about");

    const states = await page.locator("main .rv-u").evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node);
        return {
          opacity: style.opacity,
          transform: style.transform,
          transitionDuration: style.transitionDuration,
        };
      }),
    );
    expect(states.every((state) => state.opacity === "1")).toBe(true);
    expect(states.every((state) => state.transform === "none")).toBe(true);
    expect(
      states.every((state) => Number.parseFloat(state.transitionDuration) <= 0.12),
    ).toBe(true);
  });
});
