import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  HOME_SECTION_IDS,
  isHomeSectionId,
  scrollToSection,
  sectionHref,
  sectionIdFromHash,
} from "@/lib/scroll";

describe("section ids", () => {
  it("lists the addressable sections in the fixed §3 order", () => {
    expect(HOME_SECTION_IDS).toEqual([
      "hero",
      "trusted-by",
      "compare",
      "why-us",
      "sectors",
      "contact",
    ]);
  });

  it("recognises only known section ids", () => {
    expect(isHomeSectionId("compare")).toBe(true);
    expect(isHomeSectionId("Compare")).toBe(false);
    expect(isHomeSectionId("close")).toBe(false);
    expect(isHomeSectionId("")).toBe(false);
  });
});

describe("sectionHref", () => {
  it("stays a bare fragment on the homepage", () => {
    expect(sectionHref("compare", "/")).toBe("#compare");
  });

  it("becomes a route link back to the homepage from anywhere else", () => {
    expect(sectionHref("compare", "/about")).toBe("/#compare");
    expect(sectionHref("contact", "/privacy")).toBe("/#contact");
  });

  it("does not treat a nested path as the homepage", () => {
    // "/about" must not match a naive startsWith("/") check.
    expect(sectionHref("sectors", "/about")).not.toBe("#sectors");
  });
});

describe("sectionIdFromHash", () => {
  it("accepts a hash with or without its leading marker", () => {
    expect(sectionIdFromHash("#sectors")).toBe("sectors");
    expect(sectionIdFromHash("sectors")).toBe("sectors");
  });

  it("rejects anything that is not a known section", () => {
    expect(sectionIdFromHash("")).toBeNull();
    expect(sectionIdFromHash("#")).toBeNull();
    expect(sectionIdFromHash("#unknown")).toBeNull();
  });

  it("survives a malformed escape sequence instead of throwing", () => {
    expect(sectionIdFromHash("#%E0%A4%A")).toBeNull();
  });
});

describe("scrollToSection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("reports false when the section is not in the document", () => {
    expect(scrollToSection("compare")).toBe(false);
  });

  it("scrolls the section into view and reports true", () => {
    const section = document.createElement("section");
    section.id = "compare";
    const scrollIntoView = vi.fn();
    section.scrollIntoView = scrollIntoView;
    document.body.append(section);

    expect(scrollToSection("compare")).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("jumps instead of animating under prefers-reduced-motion (§8)", () => {
    const section = document.createElement("section");
    section.id = "contact";
    const scrollIntoView = vi.fn();
    section.scrollIntoView = scrollIntoView;
    document.body.append(section);

    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("prefers-reduced-motion"),
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );

    expect(scrollToSection("contact")).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
  });
});
