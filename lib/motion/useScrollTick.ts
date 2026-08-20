"use client";

import { useEffect } from "react";

/**
 * The site's single scroll-linked animation frame (SOURCE_OF_TRUTH.md §8).
 *
 * §8 reserves `requestAnimationFrame` for the few effects that must track
 * scroll position exactly, and §13 describes the argument-focus effect and the
 * calculator's openness as sharing "a single shared `requestAnimationFrame`
 * loop reading `getBoundingClientRect()`". This module is that loop: one frame
 * request, one scroll listener and one resize listener for every subscriber,
 * no matter how many effects join.
 *
 * Each subscriber supplies two functions rather than one. All reads run, then
 * all writes — because a task that measures the DOM after another task has
 * written to it forces a synchronous layout, and doing that once per subscriber
 * per frame is exactly the jank `MASTER_PLAN.md` Phase 4 asks to profile for.
 *
 * Both callbacks must be stable across renders (`useCallback` with a `[]`
 * dependency list, reading through refs), since changing either resubscribes.
 */

type ScrollTickTask = {
  read: () => void;
  write: () => void;
};

const tasks = new Set<ScrollTickTask>();
let frame = 0;
let listening = false;

function runFrame() {
  frame = 0;
  for (const task of tasks) task.read();
  for (const task of tasks) task.write();
}

/**
 * Schedule a frame if one is not already pending.
 *
 * Exported because not every reason to recompute is a scroll event: the
 * calculator's manual-override tween (§13) advances on time, and pumps the
 * loop itself for as long as it is still moving.
 */
export function requestScrollTick(): void {
  if (frame || tasks.size === 0) return;
  frame = requestAnimationFrame(runFrame);
}

function onScrollOrResize() {
  requestScrollTick();
}

export function useScrollTick(
  read: () => void,
  write: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const task: ScrollTickTask = { read, write };
    tasks.add(task);

    if (!listening) {
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize, { passive: true });
      listening = true;
    }

    // Measure once on mount, so a section already on screen is correct before
    // the visitor has scrolled at all.
    requestScrollTick();

    return () => {
      tasks.delete(task);
      if (tasks.size > 0 || !listening) return;

      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      listening = false;

      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }, [read, write, enabled]);
}
