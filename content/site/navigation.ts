/**
 * Navigation and footer content.
 *
 * Static by decision, not by omission: DEC-011 scopes Firestore to the Trusted
 * By section only, so every other piece of site copy is a typed constant here
 * and versioned with the code.
 *
 * Contact details are transcribed from the Assetly visiting card via
 * SOURCE_OF_TRUTH.md §16 and §17. Do not add a business fact to this file that
 * is not already in SOURCE_OF_TRUTH.md.
 */

import type { HomeSectionId } from "@/lib/scroll";

/** A link to a section of the homepage, wherever the visitor currently is. */
export type SectionLink = {
  kind: "section";
  label: string;
  sectionId: HomeSectionId;
};

/** A link to a distinct route. */
export type RouteLink = {
  kind: "route";
  label: string;
  href: string;
};

export type SiteLink = SectionLink | RouteLink;

/** Primary navigation, §10: Compare · Sectors · About · Contact. */
export const NAV_LINKS: readonly SiteLink[] = [
  { kind: "section", label: "Compare", sectionId: "compare" },
  { kind: "section", label: "Sectors", sectionId: "sectors" },
  { kind: "route", label: "About", href: "/about" },
  { kind: "section", label: "Contact", sectionId: "contact" },
] as const;

/** The two footer navigation groups, §17. */
export const FOOTER_GROUPS: readonly {
  heading: string;
  links: readonly SiteLink[];
}[] = [
  {
    heading: "Explore",
    links: [
      { kind: "section", label: "Compare", sectionId: "compare" },
      { kind: "section", label: "Why Us", sectionId: "why-us" },
      { kind: "section", label: "Sectors", sectionId: "sectors" },
    ],
  },
  {
    heading: "Company",
    links: [
      { kind: "section", label: "Contact", sectionId: "contact" },
      { kind: "route", label: "About Us", href: "/about" },
    ],
  },
] as const;

export const BRAND = {
  /**
   * Nav wordmark. The full lockup, matching the Footer's — DEC-044 restores
   * the "leasing" suffix DEC-017 had dropped, so the home button names the
   * company rather than abbreviating it.
   */
  navWordmark: "assetly leasing",
  /** Footer wordmark is set lower-case in §17. */
  footerWordmark: "assetly leasing",
  /** §5 — sourced from the visiting card. */
  tagline: "Access . Scale . Grow",
} as const;

export const CONTACT = {
  email: "sankar@assetly.lease",
  /** Display form; `telHref` is the dialable one. */
  phone: "+91 96204 71985",
  telHref: "+919620471985",
  /** §16 keeps the Contact section to the city only. */
  city: "Bengaluru",
} as const;

/**
 * The full postal address. §16 excludes it from the Contact section on purpose
 * — the Footer is the only place on the site it appears.
 */
export const OFFICE_ADDRESS = [
  "Unit 101, Raheja Chancery",
  "113, Brigade Road",
  "Bengaluru, Karnataka — 560025",
] as const;

/**
 * Legal links, §17. Rendered as plain text until Phase 9 builds the routes —
 * shipping anchors to pages that 404 would be worse than shipping labels.
 * Phase 9 (`LEGAL-002`) turns these into real links.
 */
export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
] as const;
