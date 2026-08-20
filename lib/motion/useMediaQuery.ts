"use client";

import { useSyncExternalStore } from "react";

/**
 * Reading a media query without tearing, and without a hydration mismatch.
 *
 * `useSyncExternalStore` is the right primitive here rather than
 * `useState` + `useEffect`: the server has no viewport and no preferences, so
 * the server snapshot is `null` — "not known yet" — and React re-renders with
 * the real answer once it is on the client. That also keeps the project's
 * `react-hooks/set-state-in-effect` rule satisfied without contortions.
 *
 * `null` is a meaningful value for callers, not a placeholder to coerce away:
 * a component that must render one of two structurally different layouts
 * (§13's desktop drawer versus mobile bottom sheet) should render neither until
 * it knows which, rather than render the wrong one and swap.
 */

const lists = new Map<string, MediaQueryList>();

function listFor(query: string): MediaQueryList {
  let list = lists.get(query);
  if (!list) {
    list = window.matchMedia(query);
    lists.set(query, list);
  }
  return list;
}

export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const list = listFor(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => listFor(query).matches,
    () => null,
  );
}

/**
 * §8's `prefers-reduced-motion: reduce`, as a hook.
 *
 * Defaults to `false` while unknown, because the CSS in every component already
 * carries its own reduced-motion block — the preference is honoured by the
 * stylesheet whether or not JavaScript has caught up. This hook exists for the
 * cases CSS cannot express, such as declining to run a scroll loop at all.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)") ?? false;
}
