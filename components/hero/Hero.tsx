"use client";

import { useEffect, useRef, useState } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
import { Plate } from "@/components/plate/Plate";
import { HERO_PLATE_VIEWBOX, HeroPlateArtwork } from "@/content/plates/hero-plate";
import { HERO } from "@/content/site/hero";
import { useCursorParallax } from "@/lib/motion/useCursorParallax";

import styles from "./Hero.module.css";

/**
 * The Hero (§11): mark, proposition, tagline, over a traced-line plate.
 *
 * Scope note (DEC-013): this is the interim entrance — it fires on mount.
 * Phase 8.5 replaces the trigger with the opening loader's "A" settle; the
 * sequence itself, and the mark's final position, stay as they are here so the
 * loader has a real hand-off target.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const plateLayerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  // Held back until the plate has drawn, so the parallax joins Stage 2 rather
  // than nudging the artwork while it is still drawing itself (§11).
  useCursorParallax(plateLayerRef, { enabled: ready });

  /*
   * Start on the frame after mount rather than during it, so the browser has
   * painted the "before" state and actually transitions into the "after" one.
   */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /*
   * §11 Stage 3: the plate fades out as the Hero leaves the viewport. Written
   * straight to the element as a custom property from a rAF-coalesced scroll
   * read — this has to track scroll position continuously rather than snap at
   * a threshold, which is exactly the case §8 reserves for rAF.
   */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const { height, bottom } = node.getBoundingClientRect();
      if (height === 0) return;
      // 1 while the Hero fills the viewport, easing to 0 as its base rises past.
      const progress = Math.min(Math.max(bottom / height, 0), 1);
      node.style.setProperty("--hero-plate-fade", progress.toFixed(3));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`${styles.hero} ${ready ? styles.ready : ""}`}
    >
      <div ref={plateLayerRef} className={styles.plateLayer}>
        <Plate
          viewBox={HERO_PLATE_VIEWBOX}
          drawn={ready}
          className={styles.plate}
          preserveAspectRatio="xMidYMid meet"
        >
          <HeroPlateArtwork />
        </Plate>
      </div>

      <div className={styles.content}>
        <LogoMark className={styles.mark} />

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
                {/*
                 * The mask lines are block elements, so without this the two
                 * halves run together in the accessibility tree and the
                 * headline is announced as "accesswhat". Invisible in layout.
                 */}
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
