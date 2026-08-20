export type SectorRotationState = {
  visibleIndices: readonly number[];
  nextItemIndex: number;
  nextSlotIndex: number;
};

export function createSectorRotationState(
  itemCount: number,
  visibleCount: number,
): SectorRotationState {
  if (itemCount <= 0 || visibleCount <= 0 || visibleCount > itemCount) {
    throw new RangeError("Rotation requires at least as many items as visible slots.");
  }

  return {
    visibleIndices: Array.from({ length: visibleCount }, (_, index) => index),
    nextItemIndex: visibleCount % itemCount,
    nextSlotIndex: 0,
  };
}

/** Replace exactly one slot, then advance both cyclic cursors. */
export function advanceSectorRotation(
  state: SectorRotationState,
  itemCount: number,
): SectorRotationState {
  const visibleIndices = [...state.visibleIndices];
  visibleIndices[state.nextSlotIndex] = state.nextItemIndex;

  return {
    visibleIndices,
    nextItemIndex: (state.nextItemIndex + 1) % itemCount,
    nextSlotIndex: (state.nextSlotIndex + 1) % visibleIndices.length,
  };
}
