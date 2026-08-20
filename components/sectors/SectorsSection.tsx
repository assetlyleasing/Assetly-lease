"use client";

import { useState, useSyncExternalStore } from "react";

import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import { SerifHeading } from "@/components/primitives/SerifHeading";
import { SECTORS } from "@/content/sectors/sectors";
import { useDrawOnEnter } from "@/lib/motion/useDrawOnEnter";
import { useMediaQuery } from "@/lib/motion/useMediaQuery";
import { useOneOutOneIn } from "@/lib/motion/useOneOutOneIn";

import { SectorCard } from "./SectorCard";
import styles from "./Sectors.module.css";

const DELAYS = ["", "rv-d1", "rv-d2", "rv-d3"] as const;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function documentIsHidden() {
  return document.visibilityState === "hidden";
}

export function SectorsSection() {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const hidden = useSyncExternalStore(subscribeVisibility, documentIsHidden, () => false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { ref: entryRef, drawn: entered } = useDrawOnEnter<HTMLDivElement>({
    threshold: 0.12,
    rootMargin: "0px 0px -8%",
  });
  const { visibleIndices, swappingSlot } = useOneOutOneIn({
    itemCount: SECTORS.length,
    visibleCount: 4,
    entered,
    /*
     * Hover holds one card, not the grid (DEC-038). Keyboard focus still stops
     * everything: it is the deliberate, keyboard-reachable pause the section
     * owes an auto-updating region, and the grid's label says so.
     */
    paused: focused || hidden,
    holdSlot: hoveredSlot,
    disabled: reducedMotion !== false,
  });

  return (
    <section id="sectors" className={styles.section} aria-labelledby="sectors-title">
      <Container className={styles.shell}>
        <RevealOnScroll className={styles.stack}>
          <header className={styles.header}>
            <Eyebrow className="rv-u">Sectors</Eyebrow>
            <SerifHeading
              level={2}
              id="sectors-title"
              className={`${styles.heading} rv-u rv-d1`}
            >
              Sectors We Serve
            </SerifHeading>
          </header>

          <div
            ref={entryRef}
            className={styles.grid}
            role="list"
            tabIndex={0}
            aria-label="Sectors Assetly serves. Automatic rotation pauses while this grid is focused."
            aria-live="off"
            data-sectors-grid
            data-reduced-motion={reducedMotion === true ? "true" : "false"}
            onMouseLeave={() => setHoveredSlot(null)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            {visibleIndices.map((sectorIndex, slotIndex) => {
              const sector = SECTORS[sectorIndex];
              return (
                <div
                  key={`sector-slot-${slotIndex}`}
                  className={`${styles.cell} rv-u ${DELAYS[slotIndex]}`.trim()}
                  role="listitem"
                  data-sector-slot={slotIndex}
                  onMouseEnter={() => setHoveredSlot(slotIndex)}
                >
                  <SectorCard sector={sector} swapping={swappingSlot === slotIndex} />
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
