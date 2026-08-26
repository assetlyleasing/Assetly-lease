"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import {
  subscribeActiveTrustedLogos,
  subscribeTrustedBySection,
  type TrustedLogo,
} from "@/lib/firebase/firestore";

import { LogoMarquee } from "./LogoMarquee";
import styles from "./TrustedBy.module.css";

/**
 * §12/§18: renders only when the admin toggle is on AND at least one active
 * logo exists. Both Firestore subscriptions degrade to their empty state
 * (`null`/`[]`) rather than throwing on failure or a missing project, so an
 * outage or an unconfigured environment both collapse to "render nothing" —
 * no error UI, no placeholder, and Hero's first paint is never blocked
 * waiting on this section (§21).
 */
export function TrustedBy() {
  const [enabled, setEnabled] = useState(false);
  const [logos, setLogos] = useState<TrustedLogo[]>([]);

  useEffect(
    () => subscribeTrustedBySection((section) => setEnabled(section?.enabled ?? false)),
    [],
  );
  useEffect(() => subscribeActiveTrustedLogos(setLogos), []);

  if (!enabled || logos.length === 0) return null;

  return (
    <section id="trusted-by" className={styles.section} aria-labelledby="trusted-by-title">
      <RevealOnScroll>
        <Container>
          <header className={styles.header}>
            <Eyebrow as="h2" id="trusted-by-title" className="rv-u">
              Trusted By
            </Eyebrow>
          </header>
        </Container>
        <div className={`${styles.marqueeReveal} rv-u rv-d1`}>
          <LogoMarquee logos={logos} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
