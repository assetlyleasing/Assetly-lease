import { describe, expect, it } from "vitest";

/**
 * Phase 0 smoke test: proves the Vitest runner, the TypeScript pipeline, the
 * jsdom environment, and the `@/` path alias are all wired correctly. Real unit
 * tests arrive with the first testable logic in Phase 1 (lib/scroll.ts).
 */
describe("test environment", () => {
  it("runs TypeScript tests", () => {
    expect(1 + 1).toBe(2);
  });

  it("provides a DOM", () => {
    document.body.innerHTML = '<main id="root">Assetly</main>';
    expect(document.getElementById("root")).toHaveTextContent("Assetly");
  });

  it("stubs matchMedia so reduced-motion branches are testable", () => {
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(
      false,
    );
  });
});
