import { CompareSection } from "@/components/compare/CompareSection";
import { Hero } from "@/components/hero/Hero";
import { WhyUsSection } from "@/components/why-us/WhyUsSection";

import styles from "./placeholder.module.css";

/**
 * Homepage.
 *
 * The Hero (Phase 2), Compare (Phase 4), and Why Us (Phase 5) are real. The
 * sections below them are still placeholders, kept so every Nav and Footer
 * anchor resolves to something in the document — a link that scrolls nowhere
 * cannot be tested.
 *
 * Each is replaced by its own phase, in the fixed §3 order: Trusted By
 * (Phase 3), Why Us (Phase 5), Sectors (Phase 6), Contact (Phase 7). Do not add
 * a section here that §3 does not list.
 */
const PLACEHOLDER_SECTIONS = [
  { id: "sectors", label: "Sectors We Serve", phase: "Phase 6" },
  { id: "contact", label: "Contact", phase: "Phase 7" },
] as const;

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CompareSection />
      <WhyUsSection />

      {PLACEHOLDER_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className={styles.section}>
          <h2>{section.label}</h2>
          <p className={styles.note}>Placeholder — built in {section.phase}.</p>
        </section>
      ))}
    </main>
  );
}
