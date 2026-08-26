/**
 * Pure reordering logic for the Trusted By logo list (§18 `sortOrder`).
 *
 * Kept free of Firestore so it can be unit-tested without a DOM or a mocked
 * SDK — `LogoManager.tsx` calls these, then writes the result.
 */

export type SortOrderPatch = { id: string; sortOrder: number };

/**
 * Swaps the item at `id` with its neighbor in the given direction. Returns the
 * same array (by value) when `id` is not found or already at that edge, so a
 * caller can always write the result back without checking first.
 */
export function moveLogo<T extends { id: string }>(
  items: readonly T[],
  id: string,
  direction: "up" | "down",
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return [...items];

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return [...items];

  const next = [...items];
  [next[index], next[swapWith]] = [next[swapWith], next[index]];
  return next;
}

/** Assigns a fresh, gap-free `sortOrder` matching each item's array position. */
export function withSequentialSortOrder<T extends { id: string }>(
  items: readonly T[],
): SortOrderPatch[] {
  return items.map((item, index) => ({ id: item.id, sortOrder: index }));
}
