import "@testing-library/jest-dom/vitest";

/**
 * jsdom does not implement `matchMedia`, which every component that respects
 * `prefers-reduced-motion` (§8) will call. The stub reports "no preference" by
 * default; a test that needs the reduced-motion branch should override
 * `window.matchMedia` for its own scope.
 */
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
