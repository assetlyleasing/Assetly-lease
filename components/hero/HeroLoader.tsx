import type { HeroLoaderPhase } from "@/lib/motion/useHeroLoaderSequence";

import styles from "./HeroLoader.module.css";

export const HERO_LOADER_TAGLINE = "ACCESS · SCALE · GROW";

export function HeroLoader({
  phase,
  reduced,
}: {
  phase: HeroLoaderPhase;
  reduced: boolean;
}) {
  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={styles.overlay}
      data-hero-loader="true"
      data-phase={phase}
      data-reduced={reduced}
    >
      <p className={styles.tagline}>{HERO_LOADER_TAGLINE}</p>
    </div>
  );
}
