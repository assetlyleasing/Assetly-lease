import { describe, expect, it } from "vitest";

import { moveLogo, withSequentialSortOrder } from "@/lib/trustedBy/reorder";

const items = [{ id: "a" }, { id: "b" }, { id: "c" }];

describe("moveLogo", () => {
  it("swaps an item with its upward neighbor", () => {
    expect(moveLogo(items, "b", "up")).toEqual([{ id: "b" }, { id: "a" }, { id: "c" }]);
  });

  it("swaps an item with its downward neighbor", () => {
    expect(moveLogo(items, "b", "down")).toEqual([{ id: "a" }, { id: "c" }, { id: "b" }]);
  });

  it("leaves the order unchanged at either edge", () => {
    expect(moveLogo(items, "a", "up")).toEqual(items);
    expect(moveLogo(items, "c", "down")).toEqual(items);
  });

  it("leaves the order unchanged for an id that isn't present", () => {
    expect(moveLogo(items, "missing", "up")).toEqual(items);
  });

  it("never mutates the input array", () => {
    const before = [...items];
    moveLogo(items, "b", "up");
    expect(items).toEqual(before);
  });
});

describe("withSequentialSortOrder", () => {
  it("produces a correct, gap-free sortOrder sequence matching array position", () => {
    expect(withSequentialSortOrder(items)).toEqual([
      { id: "a", sortOrder: 0 },
      { id: "b", sortOrder: 1 },
      { id: "c", sortOrder: 2 },
    ]);
  });

  it("reflects a move: the swapped pair gets the swapped sortOrder", () => {
    const moved = moveLogo(items, "a", "down");
    expect(withSequentialSortOrder(moved)).toEqual([
      { id: "b", sortOrder: 0 },
      { id: "a", sortOrder: 1 },
      { id: "c", sortOrder: 2 },
    ]);
  });

  it("handles an empty list", () => {
    expect(withSequentialSortOrder([])).toEqual([]);
  });
});
