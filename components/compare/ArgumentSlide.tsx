"use client";

import type { Ref } from "react";

import { Container } from "@/components/primitives/Container";
import { SerifHeading } from "@/components/primitives/SerifHeading";
import { Plate } from "@/components/plate/Plate";
import type { CompareSlide } from "@/content/compare/slides";
import { COMPARE_PLATE_VIEWBOX } from "@/content/plates/compare-plates";
import { useDrawOnEnter } from "@/lib/motion/useDrawOnEnter";

import { compareSlideDomId } from "./CalculatorPanel";
import styles from "./Compare.module.css";

/**
 * One argument slide (SOURCE_OF_TRUTH.md §13).
 *
 * A near-full-screen beat: plate, index, headline, supporting copy — the same
 * stack on both desktop and mobile, since §13 changes the calculator's form
 * between them but not the narrative's.
 *
 * The slide takes two refs for two unrelated jobs. `ref` is the outer element
 * the shared scroll loop measures for the focus effect; the plate wrapper has
 * its own, because §13 has the plate draw "once on activation" and
 * `useDrawOnEnter` is the existing primitive for exactly that.
 */
export function ArgumentSlide({
  slide,
  ref,
}: {
  slide: CompareSlide;
  ref?: Ref<HTMLElement>;
}) {
  const { ref: plateRef, drawn } = useDrawOnEnter<HTMLDivElement>();
  const PlateArtwork = slide.plate;
  const headingId = `${compareSlideDomId(slide.id)}-headline`;

  return (
    <article
      ref={ref}
      id={compareSlideDomId(slide.id)}
      className={styles.slide}
      aria-labelledby={headingId}
    >
      <Container className={styles.slideInner}>
        <div className={styles.body}>
          <div ref={plateRef} className={styles.plateWrap}>
            {/*
             * Well above the Hero plate's 16%: that one is a full-bleed
             * background wash behind the headline, this one is a small drawing
             * the reader is meant to look at directly.
             */}
            <Plate
              viewBox={COMPARE_PLATE_VIEWBOX}
              drawn={drawn}
              opacity={0.55}
              preserveAspectRatio="xMidYMid meet"
            >
              <PlateArtwork />
            </Plate>
          </div>

          <span className={styles.index} aria-hidden="true">
            {slide.index}
          </span>

          <SerifHeading level={2} id={headingId} className={styles.headline}>
            {slide.headline.map((segment, index) =>
              segment.emphasis ? (
                <i key={index}>{segment.text}</i>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </SerifHeading>

          <p className={styles.copy}>{slide.copy}</p>
        </div>
      </Container>
    </article>
  );
}
