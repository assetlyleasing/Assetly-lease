"use client";

import { useEffect } from "react";

import { Hero } from "@/components/hero/Hero";
import { HeroLoader } from "@/components/hero/HeroLoader";
import { useShouldPlayHomeOpening } from "@/lib/motion/homeOpeningReplay";
import { useHeroLoaderSequence } from "@/lib/motion/useHeroLoaderSequence";

export function HeroOpening() {
  const shouldPlay = useShouldPlayHomeOpening();
  const sequence = useHeroLoaderSequence(shouldPlay);

  useEffect(() => {
    if (!sequence.active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sequence.active]);

  return (
    <>
      <Hero start={sequence.heroReady} openingPhase={sequence.phase} />
      <HeroLoader phase={sequence.phase} reduced={sequence.reduced} />
    </>
  );
}
