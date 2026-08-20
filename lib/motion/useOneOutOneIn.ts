"use client";

import { useEffect, useRef, useState } from "react";

import {
  advanceSectorRotation,
  createSectorRotationState,
  type SectorRotationState,
} from "./sectorRotation";

type RotationViewState = {
  rotation: SectorRotationState;
  swappingSlot: number | null;
};

export function useOneOutOneIn({
  itemCount,
  visibleCount,
  entered,
  paused,
  disabled,
  initialDelayMs = 3000,
  intervalMs = 2500,
  swapMs = 450,
}: {
  itemCount: number;
  visibleCount: number;
  entered: boolean;
  paused: boolean;
  disabled: boolean;
  initialDelayMs?: number;
  intervalMs?: number;
  swapMs?: number;
}) {
  const initial = createSectorRotationState(itemCount, visibleCount);
  const [view, setView] = useState<RotationViewState>({
    rotation: initial,
    swappingSlot: null,
  });
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!entered || disabled) return;

    let cycleTimer: ReturnType<typeof setTimeout> | undefined;
    let swapTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const schedule = (delay: number) => {
      cycleTimer = setTimeout(() => {
        if (cancelled) return;

        if (pausedRef.current) {
          schedule(intervalMs);
          return;
        }

        setView((current) => ({
          ...current,
          swappingSlot: current.rotation.nextSlotIndex,
        }));

        swapTimer = setTimeout(() => {
          if (cancelled) return;
          setView((current) => ({
            rotation: advanceSectorRotation(current.rotation, itemCount),
            swappingSlot: null,
          }));
        }, swapMs);

        schedule(intervalMs);
      }, delay);
    };

    schedule(initialDelayMs);

    return () => {
      cancelled = true;
      if (cycleTimer) clearTimeout(cycleTimer);
      if (swapTimer) clearTimeout(swapTimer);
    };
  }, [disabled, entered, initialDelayMs, intervalMs, itemCount, swapMs]);

  if (disabled) {
    return { visibleIndices: initial.visibleIndices, swappingSlot: null };
  }

  return {
    visibleIndices: view.rotation.visibleIndices,
    swappingSlot: view.swappingSlot,
  };
}
