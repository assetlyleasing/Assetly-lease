import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import { SerifHeading } from "@/components/primitives/SerifHeading";
import { WHY_US_HEADING, WHY_US_VALUES } from "@/content/why-us/values";

import { FlipCard } from "./FlipCard";
import styles from "./WhyUs.module.css";

const DELAYS = ["", "rv-d1", "rv-d2", "rv-d3"] as const;

/** The T/F/S/P connected flip-card grid from SOURCE_OF_TRUTH.md §14. */
export function WhyUsSection() {
  return (
    <section id="why-us" className={styles.section} aria-labelledby="why-us-title">
      <Container>
        <RevealOnScroll>
          <header className={styles.header}>
            <Eyebrow className="rv-u">Why Us</Eyebrow>
            <SerifHeading
              level={2}
              id="why-us-title"
              className={`${styles.heading} rv-u rv-d1`}
            >
              {WHY_US_HEADING}
            </SerifHeading>
          </header>

          <div className={styles.grid} role="list">
            {WHY_US_VALUES.map((value, index) => (
              <div
                key={value.id}
                className={`${styles.cell} rv-u ${DELAYS[index]}`.trim()}
                role="listitem"
              >
                <FlipCard value={value} />
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
