import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import { SerifHeading } from "@/components/primitives/SerifHeading";
import type { LegalContent } from "@/content/legal/privacy";

import styles from "./Legal.module.css";

/**
 * Shared body for the Privacy Policy and Terms of Use pages — both are the
 * same simple typographic treatment as About (SOURCE_OF_TRUTH.md §23), just
 * heading, a placeholder notice, and paragraphs.
 */
export function LegalPageBody({ content }: { content: LegalContent }) {
  return (
    <main id="main-content">
      <section className={styles.section} aria-labelledby="legal-title">
        <Container>
          <RevealOnScroll className={styles.layout}>
            <div className="rv-u">
              <Eyebrow>{content.eyebrow}</Eyebrow>
              <SerifHeading level={1} id="legal-title" className={styles.heading}>
                {content.heading}
              </SerifHeading>
              <p className={styles.notice}>{content.updated}</p>
            </div>

            {content.paragraphs.map((paragraph) => (
              <p className={`${styles.body} rv-u rv-d1`} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </RevealOnScroll>
        </Container>
      </section>
    </main>
  );
}
