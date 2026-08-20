"use client";

import { useEffect, useState } from "react";

import { completeHomeOpening } from "@/lib/motion/homeOpeningReplay";
import { usePrefersReducedMotion } from "@/lib/motion/useMediaQuery";

export type HeroLoaderPhase =
  | "prepare"
  | "signature"
  | "recede"
  | "settle"
  | "hold"
  | "reveal"
  | "done";

export const HERO_LOADER_DURATIONS = {
  prepare: 150,
  /*
   * The same number as `loaderDoubleBlink`'s duration in `Hero.module.css`, and
   * it has to be: this timer is what ends the phase the animation is playing
   * in. Changing one without the other either cuts the second blink off or
   * leaves the mark sitting still on a finished animation (DEC-039).
   */
  signature: 2400,
  recede: 650,
  settle: 850,
  hold: 320,
  reveal: 420,
  reducedReveal: 120,
} as const;

export function nextHeroLoaderPhase(
  phase: Exclude<HeroLoaderPhase, "done">,
): HeroLoaderPhase {
  if (phase === "prepare") return "signature";
  if (phase === "signature") return "recede";
  if (phase === "recede") return "settle";
  if (phase === "settle") return "hold";
  if (phase === "hold") return "reveal";
  return "done";
}

export function useHeroLoaderSequence(enabled: boolean): {
  phase: HeroLoaderPhase;
  heroReady: boolean;
  active: boolean;
  reduced: boolean;
} {
  const reduced = usePrefersReducedMotion();
  const [animatedPhase, setAnimatedPhase] =
    useState<HeroLoaderPhase>("prepare");

  const phase = !enabled
    ? "done"
    : reduced && animatedPhase !== "done"
      ? "reveal"
      : animatedPhase;

  useEffect(() => {
    if (!enabled || animatedPhase === "done") return;

    const delay = reduced
      ? HERO_LOADER_DURATIONS.reducedReveal
      : HERO_LOADER_DURATIONS[animatedPhase];

    const timer = window.setTimeout(() => {
      const next = reduced ? "done" : nextHeroLoaderPhase(animatedPhase);
      if (next === "done") completeHomeOpening();
      setAnimatedPhase(next);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [animatedPhase, enabled, reduced]);

  return {
    phase,
    heroReady: phase === "reveal" || phase === "done",
    active: phase !== "done",
    reduced,
  };
}
