/**
 * Section anchors and smooth-scrolling for the homepage narrative.
 *
 * The homepage is one long document (SOURCE_OF_TRUTH.md §3), so Nav and Footer
 * links are anchors while on `/` and route links from anywhere else. The pure
 * helpers here carry that rule so it can be unit-tested without a DOM, and so
 * Nav and Footer cannot drift apart on it.
 */

/**
 * Every addressable homepage section, in the fixed §3 order. `hero` is the
 * logo's scroll target; `trusted-by` is addressable even though §12 lets it
 * render nothing, so a link to it degrades to "not in the document" rather
 * than to a wrong id.
 */
export const HOME_SECTION_IDS = [
  "hero",
  "trusted-by",
  "compare",
  "why-us",
  "sectors",
  "contact",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export function isHomeSectionId(value: string): value is HomeSectionId {
  return (HOME_SECTION_IDS as readonly string[]).includes(value);
}

/**
 * The `href` a section link should carry from the given path.
 *
 * On `/` it stays a bare fragment so the click handler can scroll smoothly
 * without a navigation. Anywhere else it has to be a real route link back to
 * the homepage, because the section is not in the current document.
 */
export function sectionHref(
  sectionId: HomeSectionId,
  pathname: string,
): string {
  return pathname === "/" ? `#${sectionId}` : `/#${sectionId}`;
}

/**
 * The section id in a location hash, or `null` if there isn't a valid one.
 * Accepts the value with or without its leading `#`.
 */
export function sectionIdFromHash(hash: string): HomeSectionId | null {
  const bare = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!bare) return null;

  let decoded = bare;
  try {
    decoded = decodeURIComponent(bare);
  } catch {
    // A malformed escape sequence is simply not one of our section ids.
    return null;
  }

  return isHomeSectionId(decoded) ? decoded : null;
}

/**
 * Scroll a section into view. Returns `false` when the section is not in the
 * document — the caller should then let the browser follow the link normally
 * instead of swallowing the click.
 *
 * Honours `prefers-reduced-motion` by jumping instead of animating (§8). The
 * vertical offset for the fixed nav comes from the `scroll-margin-top` set in
 * globals.css, so it applies to native hash navigation too.
 */
export function scrollToSection(sectionId: HomeSectionId): boolean {
  if (typeof document === "undefined") return false;

  const target = document.getElementById(sectionId);
  if (!target) return false;

  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });

  return true;
}
