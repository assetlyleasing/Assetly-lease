import { type Page } from "@playwright/test";

import { expect, test } from "./support/opening";

/**
 * Phase 1 — shared site shell (Nav + Footer).
 *
 * Covers MASTER_PLAN Phase 1's test list: the desktop nav renders all four
 * links and scroll-transitions, the mobile hamburger opens/closes the overlay
 * and traps focus, footer links navigate and scroll, a keyboard-only pass runs
 * nav → footer, and both transitions collapse under reduced motion.
 */

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const NAV_LINKS = ["Compare", "Sectors", "About", "Contact"];

/** The nav's own background, which is the thing §10 transitions on scroll. */
async function navBackground(page: Page) {
  return page.evaluate(() => {
    const bar = document.querySelector("header > div");
    return bar ? getComputedStyle(bar).backgroundColor : null;
  });
}

test.describe("desktop navigation", () => {
  test.use({ viewport: DESKTOP });

  test("renders the brand and all four §10 links", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of NAV_LINKS) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }

    // The mark is decorative; the wordmark carries the accessible name (§20).
    // Exact, because "assetly leasing" is also a substring of the © line.
    await expect(
      page
        .getByRole("banner")
        .getByRole("link", { name: "assetly leasing", exact: true }),
    ).toBeVisible();
  });

  test("is transparent over the hero and goes Pitch once scrolled (§10)", async ({
    page,
  }) => {
    await page.goto("/");

    const header = page.getByRole("banner");
    await expect(header).toHaveAttribute("data-solid", "false");

    const atTop = await navBackground(page);
    expect(atTop).toBe("rgba(0, 0, 0, 0)");

    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-solid", "true");

    // --pitch is #21241A.
    await expect
      .poll(() => navBackground(page))
      .toBe("rgb(33, 36, 26)");
  });

  test("section links scroll rather than navigate", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Sectors" })
      .click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    // A scroll, not a navigation: the URL must not have gained a fragment.
    expect(new URL(page.url()).hash).toBe("");
  });

  test("the fixed nav never covers the top of a scrolled-to section", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Compare" })
      .click();

    await expect
      .poll(async () => {
        const top = await page
          .locator("#compare")
          .evaluate((node) => node.getBoundingClientRect().top);
        const navHeight = await page
          .getByRole("banner")
          .evaluate((node) => node.getBoundingClientRect().height);
        return top >= navHeight - 2;
      })
      .toBe(true);
  });

  test("About is a route, and section links from it point back home", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About" })
      .click();

    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "About Assetly",
    );

    const compare = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Compare" });
    await expect(compare).toHaveAttribute("href", "/#compare");

    await compare.click();
    await expect(page).toHaveURL(/\/#compare$/);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: MOBILE });

  test("hamburger opens and closes the full-width overlay (DEC-004)", async ({
    page,
  }) => {
    await page.goto("/");

    // Matches both labels: the button renames itself to "Close menu" when open.
    const toggle = page.getByRole("button", { name: /menu$/i });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    // The desktop link row is gone below the breakpoint.
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAccessibleName("Close menu");

    const overlay = page.getByRole("navigation", { name: "Mobile" });
    await expect(overlay).toBeVisible();
    for (const label of NAV_LINKS) {
      await expect(overlay.getByRole("link", { name: label })).toBeVisible();
    }

    // Full width, not a side drawer. Measured on the panel itself rather than
    // the nav inside it, which sits within the page gutter.
    const panelId = await toggle.getAttribute("aria-controls");
    const box = await page.locator(`[id="${panelId}"]`).boundingBox();
    expect(box?.width).toBe(MOBILE.width);
    expect(box?.x).toBe(0);

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("aria-controls points at the overlay it actually controls", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Open menu" });
    const controls = await toggle.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    await expect(page.locator(`[id="${controls}"]`)).toHaveCount(1);
  });

  test("the closed overlay is unreachable by keyboard", async ({ page }) => {
    await page.goto("/");

    // `inert` while closed, so its links must not be focusable.
    const overlayLinkFocusable = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>("[inert] a[href]");
      if (!link) return false;
      link.focus();
      return document.activeElement === link;
    });

    expect(overlayLinkFocusable).toBe(false);
  });

  test("focus moves into the overlay, is trapped, and returns on Escape", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();

    // Focus lands on the first link.
    await expect(
      page.getByRole("navigation", { name: "Mobile" }).getByRole("link", {
        name: "Compare",
      }),
    ).toBeFocused();

    // Tabbing past the last link wraps to the toggle rather than escaping
    // into the page behind the overlay.
    for (let i = 0; i < NAV_LINKS.length; i += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    // Focus returns to the control that opened it (§20).
    await expect(toggle).toBeFocused();
  });

  test("choosing a link closes the overlay", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: "Contact" })
      .click();

    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  test("the page behind an open overlay does not scroll", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => getComputedStyle(document.body).overflow),
      )
      .toBe("hidden");
  });
});

test.describe("footer", () => {
  test.use({ viewport: DESKTOP });

  test("renders all three §17 zones and the legal bar", async ({ page }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    // Exact, because "assetly leasing" is also a substring of the © line.
    await expect(
      footer.getByRole("link", { name: "assetly leasing", exact: true }),
    ).toBeVisible();
    await expect(footer.getByText("Access . Scale . Grow")).toBeVisible();

    await expect(footer.getByRole("navigation", { name: "Explore" })).toBeVisible();
    await expect(footer.getByRole("navigation", { name: "Company" })).toBeVisible();

    await expect(
      footer.getByRole("link", { name: "finance@assetly.lease" }),
    ).toHaveAttribute("href", "mailto:finance@assetly.lease");
    await expect(
      footer.getByRole("link", { name: "+91 81231 96924" }),
    ).toHaveAttribute("href", "tel:+918123196924");

    await expect(footer.getByText(/Raheja Chancery/)).toBeVisible();
    await expect(
      footer.getByText(`© ${new Date().getFullYear()} Assetly Leasing`),
    ).toBeVisible();
  });

  test("the full postal address appears only in the footer (§16)", async ({
    page,
  }) => {
    await page.goto("/");

    const occurrences = await page
      .getByText(/Raheja Chancery/)
      .count();
    expect(occurrences).toBe(1);

    const insideFooter = await page
      .getByRole("contentinfo")
      .getByText(/Raheja Chancery/)
      .count();
    expect(insideFooter).toBe(1);
  });

  test("footer content is revealed, not left invisible", async ({ page }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const brand = document.querySelector("footer .rv .rv-u");
          return brand ? getComputedStyle(brand).opacity : null;
        }),
      )
      .toBe("1");
  });

  test("footer section links scroll on the homepage", async ({ page }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();

    await footer
      .getByRole("navigation", { name: "Explore" })
      .getByRole("link", { name: "Why Us" })
      .click();

    await expect
      .poll(async () => {
        const top = await page
          .locator("#why-us")
          .evaluate((node) => Math.abs(node.getBoundingClientRect().top));
        return top < 200;
      })
      .toBe(true);
  });

  test("legal labels are present but not yet linked (Phase 9)", async ({
    page,
  }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByText("Privacy Policy")).toBeVisible();
    await expect(footer.getByText("Terms of Use")).toBeVisible();

    // No dead anchors to routes that do not exist yet.
    await expect(
      footer.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "Terms of Use" })).toHaveCount(
      0,
    );
  });
});

test.describe("keyboard and landmarks", () => {
  test.use({ viewport: DESKTOP });

  test("nav and footer expose landmarks", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
  });

  test("a keyboard-only pass reaches nav links and then footer links", async ({
    page,
  }) => {
    await page.goto("/");

    const reached: string[] = [];
    for (let i = 0; i < 22; i += 1) {
      await page.keyboard.press("Tab");
      reached.push(
        await page.evaluate(
          () => document.activeElement?.textContent?.trim() ?? "",
        ),
      );
    }

    for (const label of NAV_LINKS) {
      expect(reached).toContain(label);
    }
    expect(reached).toContain("Why Us");
    expect(reached).toContain("finance@assetly.lease");
  });

  test("focus is visible on nav links (§20)", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Compare" })
      .focus();

    const outline = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return null;
      const style = getComputedStyle(active);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });

    expect(outline?.style).not.toBe("none");
    expect(parseFloat(outline?.width ?? "0")).toBeGreaterThan(0);
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: DESKTOP });

  test("nav and footer transitions collapse (§8)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const barDuration = await page.evaluate(() => {
      const bar = document.querySelector("header > div");
      return bar ? getComputedStyle(bar).transitionDuration : null;
    });

    // --dur-reduced is 0.12s; every listed property collapses to it.
    expect(barDuration).toBeTruthy();
    for (const value of (barDuration ?? "").split(",")) {
      expect(value.trim()).toBe("0.12s");
    }
  });

  test("revealed content is shown outright, never left at opacity 0", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Checked before scrolling anywhere near the footer: under reduced motion
    // the reveal must not depend on the observer having fired.
    const opacity = await page.evaluate(() => {
      const brand = document.querySelector("footer .rv .rv-u");
      return brand ? getComputedStyle(brand).opacity : null;
    });

    expect(opacity).toBe("1");
  });

  test("the mobile overlay still opens and closes", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(MOBILE);
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
