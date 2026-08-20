"use client";

import { useEffect, useRef, useState } from "react";

import {
  advanceSectorRotation,
  createSectorRotationState,
  skipSectorRotationSlot,
  type SectorRotationState,
} from "./sectorRotation";

type RotationViewState = {
  rotation: SectorRotationState;
  swappingSlot: number | null;
};

/**
 * §15's one-out-one-in rotation.
 *
 * The interval is the cadence of the *grid*, not of any one card: with four
 * slots in rotation, a 1.2s interval still leaves each individual card in place
 * for 4.8s, so its plate finishes the 2.6s draw well before that slot comes
 * round again. The swap itself stays at §15's 450ms.
 *
 * `paused` stops the grid; `holdSlot` stops one slot. They are different things
 * on purpose (DEC-038): reading one card should not freeze the other three, so
 * a held slot is passed over and the tick spends itself on the next slot
 * instead, leaving the cadence intact.
 */
export function useOneOutOneIn({
  itemCount,
  visibleCount,
  entered,
  paused,
  holdSlot = null,
  disabled,
  initialDelayMs = 3000,
  intervalMs = 1200,
  swapMs = 450,
}: {
  itemCount: number;
  visibleCount: number;
  entered: boolean;
  paused: boolean;
  /** A slot to leave alone — the one under the pointer — or `null`. */
  holdSlot?: number | null;
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
  const holdSlotRef = useRef(holdSlot);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    holdSlotRef.current = holdSlot;
  }, [holdSlot]);

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

        setView((current) => {
          let rotation = current.rotation;

          /*
           * Step past the held slot. Bounded by the slot count so that even a
           * nonsensical hold value cannot spin here; in practice a pointer is
           * over at most one card, so this runs at most once.
           */
          const slots = rotation.visibleIndices.length;
          for (
            let step = 0;
            step < slots && rotation.nextSlotIndex === holdSlotRef.current;
            step += 1
          ) {
            rotation = skipSectorRotationSlot(rotation);
          }

          return { rotation, swappingSlot: rotation.nextSlotIndex };
        });

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
