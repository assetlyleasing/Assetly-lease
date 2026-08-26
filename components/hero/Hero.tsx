"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
import { Plate } from "@/components/plate/Plate";
import {
  HERO_MOBILE_PLATE_MODE,
  HERO_PLATE_VIEWBOX,
  HeroPlateArtwork,
} from "@/content/plates/hero-plate";
import { HERO } from "@/content/site/hero";
import type { HeroLoaderPhase } from "@/lib/motion/useHeroLoaderSequence";
import { useScrollTick } from "@/lib/motion/useScrollTick";

import styles from "./Hero.module.css";

/**
 * The Hero (§11): mark, proposition, tagline, over a traced-line plate.
 *
 * Phase 8.5 gates this reveal behind the opening mark's completed settle. The
 * mark is one persistent node: fixed at screen centre during the signature,
 * moved to this section's measured anchor, then released into the anchor once
 * the Pitch overlay clears.
 */
export function Hero({
  start,
  openingPhase,
}: {
  start: boolean;
  openingPhase: HeroLoaderPhase;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const markAnchorRef = useRef<HTMLSpanElement | null>(null);
  const markRef = useRef<HTMLSpanElement | null>(null);
  const nextPlateFade = useRef(1);
  const openingActive = openingPhase !== "done";

  useLayoutEffect(() => {
    if (!openingActive) return;

    const measureTarget = () => {
      const anchor = markAnchorRef.current;
      const mark = markRef.current;
      if (!anchor || !mark) return;

      const bounds = anchor.getBoundingClientRect();
      mark.style.setProperty(
        "--loader-target-x",
        `${bounds.left + bounds.width / 2}px`,
      );
      mark.style.setProperty(
        "--loader-target-y",
        `${bounds.top + bounds.height / 2}px`,
      );
      mark.style.setProperty(
        "--loader-target-size",
        getComputedStyle(anchor).fontSize,
      );
    };

    measureTarget();
    window.addEventListener("resize", measureTarget, { passive: true });
    return () => window.removeEventListener("resize", measureTarget);
  }, [openingActive]);

  /*
   * §11 Stage 3: fade the plate as the Hero leaves the viewport. This joins
   * the site's shared read-then-write scroll frame instead of owning another
   * scroll listener.
   */
  const readPlateFade = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;
    const { height, bottom } = node.getBoundingClientRect();
    if (height === 0) return;
    nextPlateFade.current = Math.min(Math.max(bottom / height, 0), 1);
  }, []);

  const writePlateFade = useCallback(() => {
    sectionRef.current?.style.setProperty(
      "--hero-plate-fade",
      nextPlateFade.current.toFixed(3),
    );
  }, []);

  useScrollTick(readPlateFade, writePlateFade);

  const openingClass = openingActive
    ? `${styles.openingMark} ${styles[openingPhase]}`
    : "";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`${styles.hero} ${start ? styles.ready : ""}`}
      data-opening-phase={openingPhase}
      data-opening-complete={openingPhase === "done"}
    >
      <div
        className={styles.plateLayer}
        data-mobile-plate-mode={HERO_MOBILE_PLATE_MODE}
      >
        <div className={styles.plateFrame}>
          <Plate
            viewBox={HERO_PLATE_VIEWBOX}
            drawn={start}
            opacity={0.2}
            className={styles.plate}
            preserveAspectRatio="xMidYMid meet"
          >
            <HeroPlateArtwork />
          </Plate>
        </div>
      </div>

      <div className={styles.content}>
        <span
          ref={markAnchorRef}
          className={styles.markAnchor}
          data-hero-mark-target="true"
        >
          <LogoMark
            ref={markRef}
            className={`${styles.mark} ${openingClass}`.trim()}
          />
        </span>

        <h1 className={styles.headline}>
          {HERO.headlineLines.map((line, lineIndex) => (
            <span key={lineIndex} className={styles.maskLine}>
              <span>
                {line.map((segment, segmentIndex) =>
                  segment.emphasis ? (
                    <i key={segmentIndex}>{segment.text}</i>
                  ) : (
                    segment.text
                  ),
                )}
                {lineIndex < HERO.headlineLines.length - 1 ? " " : null}
              </span>
            </span>
          ))}
        </h1>

        <p className={styles.subline}>{HERO.subline}</p>
      </div>
    </section>
  );
}
