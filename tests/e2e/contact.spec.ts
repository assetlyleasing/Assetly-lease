import { expect, test, type Page } from "@playwright/test";

const SECTION = "#contact";
const PANEL = "#contact-panel";
const TRIGGER = `${SECTION} [data-contact-trigger]`;

async function showContact(page: Page, mobile = false) {
  if (mobile) await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
}

async function openContact(page: Page) {
  await page.locator(TRIGGER).click();
  await expect(page.locator(PANEL)).toHaveAttribute("data-open", "true").catch(async () => {
    await expect(page.locator('[data-contact-panel-layer]')).toHaveAttribute("data-open", "true");
  });
  await expect(page.getByRole("button", { name: /Operating Lease/ })).toBeFocused();
}

async function choose(page: Page, name: string) {
  await page.getByRole("button", { name: new RegExp(name) }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.locator("#contact-name")).toBeFocused();
}

async function fillBase(page: Page) {
  await page.locator("#contact-name").fill("Rahul Sharma");
  await page.locator("#contact-company").fill("ABC Manufacturing");
  await page.locator("#contact-email").fill("rahul+assetly@example.com");
  await page.locator("#contact-phone").fill("+91 90000 00000");
}

test.describe("Contact — section and panels", () => {
  test("renders only the approved public contact information and illustrative map", async ({ page }) => {
    await showContact(page);
    const section = page.locator(SECTION);

    await expect(page.getByRole("heading", { level: 2, name: "Let's talk." })).toBeVisible();
    await expect(section.getByRole("link", { name: "sankar@assetly.lease" })).toHaveAttribute(
      "href",
      "mailto:sankar@assetly.lease",
    );
    await expect(section.getByRole("link", { name: "+91 96204 71985" })).toHaveAttribute(
      "href",
      "tel:+919620471985",
    );
    await expect(section).toContainText("Bengaluru");
    await expect(section).not.toContainText("Unit 101");
    await expect(section.locator("[data-contact-map] svg")).toHaveAttribute("aria-hidden", "true");
  });

  test("keeps the Assetly label on its pin at every map aspect ratio", async ({ page }) => {
    /*
     * The map is drawn `xMidYMid slice`, so the artwork is cropped differently
     * as the container's proportions change. Only the viewBox's centre maps to
     * the same place at every ratio, which is why the pin and its label are
     * both anchored there — anywhere else the drawn pin moves under a label
     * whose percentage offsets do not, and the two drift apart. That drift was
     * previously papered over with a hard-coded mobile offset.
     */
    for (const size of [
      { width: 1440, height: 900 },
      { width: 1100, height: 760 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(size);
      await showContact(page);

      const geometry = await page.evaluate(() => {
        const map = document.querySelector("[data-contact-map]")!;
        const pin = map.querySelector("svg circle")!.getBoundingClientRect();
        const label = map.querySelector("[data-contact-map-label]")!.getBoundingClientRect();
        return {
          pinCentreY: pin.top + pin.height / 2,
          pinCentreX: pin.left + pin.width / 2,
          labelCentreY: label.top + label.height / 2,
          labelLeft: label.left,
        };
      });

      expect(Math.abs(geometry.labelCentreY - geometry.pinCentreY)).toBeLessThanOrEqual(4);
      // Beside the pin, clear of the ring, and not adrift across the map.
      expect(geometry.labelLeft).toBeGreaterThan(geometry.pinCentreX);
      expect(geometry.labelLeft - geometry.pinCentreX).toBeLessThanOrEqual(60);
    }
  });

  test("opens the desktop map-edge drawer and restores focus on Escape", async ({ page }) => {
    await showContact(page);
    await expect(page.locator('[data-contact-panel="sheet"]')).toHaveCount(0);
    await openContact(page);
    await expect(page.locator('[data-contact-panel="drawer"]')).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(page.locator(TRIGGER)).toBeFocused();
    await expect(page.locator(PANEL)).toHaveAttribute("data-open", "false");
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("traps keyboard focus inside an open panel", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    const close = page.locator(`${PANEL} [data-contact-close]`);
    await close.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(`${PANEL} button`).last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
  });

  test("preserves the selected type and entered data across close and reopen", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    await choose(page, "Existing Requirement");
    await page.locator("#contact-name").fill("Preserved Name");
    await page.locator(`${PANEL} [data-contact-close]`).click();
    await page.locator(TRIGGER).click();

    await expect(page.locator('[data-contact-step="details"]')).toBeVisible();
    await expect(page.locator("#contact-name")).toHaveValue("Preserved Name");
  });
});

test.describe("Contact — enquiry branches and drafts", () => {
  test("Operating Lease creates matching protected Gmail and mailto drafts", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    await choose(page, "Operating Lease");
    await fillBase(page);
    await page.locator("#contact-assetEquipment").fill("CNC machinery");
    await page.locator("#contact-approximateValue").fill("₹80 lakh");

    const gmail = page.locator("[data-gmail-action]");
    const mailto = page.locator("[data-mailto-action]");
    await expect(gmail).toHaveAttribute("target", "_blank");
    await expect(gmail).toHaveAttribute("rel", "noopener noreferrer");
    const gmailUrl = new URL((await gmail.getAttribute("href"))!);
    const mailtoUrl = (await mailto.getAttribute("href"))!;
    const mailtoParams = new URLSearchParams(mailtoUrl.split("?")[1]);

    expect(gmailUrl.searchParams.get("to")).toBe("sankar@assetly.lease");
    expect(gmailUrl.searchParams.get("su")).toBe("Operating Lease Enquiry — ABC Manufacturing");
    expect(gmailUrl.searchParams.get("body")).toContain("Asset / equipment: CNC machinery");
    expect(mailtoParams.get("subject")).toBe(gmailUrl.searchParams.get("su"));
    expect(mailtoParams.get("body")).toBe(gmailUrl.searchParams.get("body"));
  });

  test("Asset Requirement asks for asset fields", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    await choose(page, "Asset Requirement");
    await expect(page.locator("#contact-assetEquipment")).toBeVisible();
    await expect(page.locator("#contact-approximateValue")).toBeVisible();
    await expect(page.locator("#contact-message")).toHaveCount(0);
  });

  test("Existing Requirement exposes only its optional reference", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    await choose(page, "Existing Requirement");
    await expect(page.locator("#contact-reference")).toBeVisible();
    await expect(page.locator("#contact-assetEquipment")).toHaveCount(0);
    await expect(page.locator("#contact-message")).toHaveCount(0);
  });

  test("General and custom enquiries require their approved message fields", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    await choose(page, "General Enquiry");
    await expect(page.locator("#contact-message")).toBeVisible();

    await page.getByRole("button", { name: /Back/ }).click();
    await page.getByRole("button", { name: /Something else/ }).click();
    await page.locator("#contact-customType").fill("Vendor enquiry");
    await page.getByRole("button", { name: /Continue/ }).click();
    await expect(page.locator("#contact-message")).toBeVisible();
  });

  test("invalid details show associated errors and focus the first field", async ({ page }) => {
    await showContact(page);
    await openContact(page);
    await choose(page, "General Enquiry");
    await page.locator("[data-gmail-action]").click();

    await expect(page.locator("#contact-name")).toBeFocused();
    await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-name-error")).toBeVisible();
  });
});

test.describe("Contact — mobile and reduced motion", () => {
  test("uses a scrollable mobile sheet with explicit close control", async ({ page }) => {
    await showContact(page, true);
    await expect(page.locator('[data-contact-panel="drawer"]')).toHaveCount(0);
    await openContact(page);
    const sheet = page.locator('[data-contact-panel="sheet"]');
    await expect(sheet).toBeVisible();
    const box = (await sheet.boundingBox())!;
    expect(box.height).toBeLessThanOrEqual(844 * 0.89);
    await sheet.locator("[data-contact-close]").click();
    await expect(page.locator(TRIGGER)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test("opens without spatial animation and shows a completed map under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await showContact(page);
    await openContact(page);

    const transition = await page.locator(PANEL).evaluate((panel) => getComputedStyle(panel).transitionDuration);
    expect(transition === "0s" || transition === "0ms").toBe(true);
    const path = page.locator(`${SECTION} [data-contact-map] path`).first();
    const pathStyle = await path.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        strokeDasharray: style.strokeDasharray,
        strokeDashoffset: style.strokeDashoffset,
      };
    });
    expect(
      pathStyle.strokeDasharray === "none" || Number.parseFloat(pathStyle.strokeDashoffset) === 0,
    ).toBe(true);
  });
});
