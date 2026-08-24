/**
 * About-page copy (SOURCE_OF_TRUTH.md §4).
 *
 * Owner-supplied and verbatim (DEC-050). §4 previously ruled out leadership
 * and company-character writing on the grounds that no such material had been
 * supplied; the fourth paragraph is that material, supplied. Nothing here may
 * be extended, summarised, or given a fact the owner did not write —
 * `tests/unit/about.test.ts` asserts the exact text for that reason.
 */

export type AboutContent = {
  eyebrow: "About";
  heading: "About Assetly";
  /** Four paragraphs, rendered in order. */
  paragraphs: readonly string[];
  city: "Bengaluru";
};

export const ABOUT_CONTENT: AboutContent = {
  eyebrow: "About",
  heading: "About Assetly",
  paragraphs: [
    "Assetly is a leasing platform built for growing businesses. We purchase office furniture and fit-outs, IT equipment, medical equipment, and plant & machinery, and lease these assets to corporate customers under fixed-term rental contracts – a simple, no-ownership model.",
    "Instead of a large upfront purchase, customers pay a fixed rental for the assets they use – for exactly as long as they need it. This keeps costs predictable, frees up working capital, and gives businesses the flexibility to scale and upgrade as their needs change.",
    "The result: businesses preserve capital, simplify budgeting, and stay agile as their asset needs evolve.",
    "At Assetly Leasing, our strength lies in the depth and diversity of our leadership. Bringing together decades of combined experience in finance, business development, operations and facility management, our leaders drive the strategic vision, operational excellence, and financial discipline that power Assetly's growth as an asset leasing platform.",
  ],
  city: "Bengaluru",
};

export const ABOUT_META_DESCRIPTION =
  "Learn how Assetly structures operating leases to help businesses preserve working capital and maintain financial flexibility.";
