/**
 * Navigation and footer content.
 *
 * Static by decision, not by omission: DEC-011 scopes Firestore to the Trusted
 * By section only, so every other piece of site copy is a typed constant here
 * and versioned with the code.
 *
 * Contact details come from SOURCE_OF_TRUTH.md §16 and §17, which DEC-049
 * updated from the visiting card's details to the published ones. Do not add a
 * business fact to this file that is not already in SOURCE_OF_TRUTH.md.
 *
 * `CONTACT.email` is the one place the enquiry address is written;
 * `lib/email/buildEmailDraft.ts` derives its recipient from it rather than
 * repeating the string.
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
  email: "finance@assetly.lease",
  /** Display form; `telHref` is the dialable one. */
  phone: "+91 81231 96924",
  telHref: "+918123196924",
  /** §16 keeps the Contact section to the city only. */
  city: "Bengaluru",
} as const;

/**
 * Assetly's presence off the site. One entry today; a constant rather than a
 * literal in the About page because §17's Footer is the other place a social
 * link would ever be added, and it should read the same value.
 */
export const SOCIAL = {
  linkedin: "https://www.linkedin.com/company/assetly-leasing/",
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
