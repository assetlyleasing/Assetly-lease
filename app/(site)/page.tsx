import styles from "./placeholder.module.css";

/**
 * Homepage.
 *
 * The sections below are Phase 1 placeholders. They exist so the shared shell
 * has a real body to sit around and so every Nav and Footer anchor resolves to
 * something in the document — a link that scrolls nowhere cannot be tested.
 *
 * Each is replaced by its own phase, in the fixed §3 order: Hero (Phase 2),
 * Trusted By (Phase 3), Compare (Phase 4), Why Us (Phase 5), Sectors (Phase 6),
 * Contact (Phase 7). Do not add a section here that §3 does not list.
 */
const PLACEHOLDER_SECTIONS = [
  { id: "compare", label: "Lease vs. Loan vs. Purchase", phase: "Phase 4" },
  { id: "why-us", label: "Why Us", phase: "Phase 5" },
  { id: "sectors", label: "Sectors We Serve", phase: "Phase 6" },
  { id: "contact", label: "Contact", phase: "Phase 7" },
] as const;

export default function HomePage() {
  return (
    <main>
      <section id="hero" className={styles.hero}>
        <h1>Assetly</h1>
        <p>{"Access . Scale . Grow"}</p>
      </section>

      {PLACEHOLDER_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className={styles.section}>
          <h2>{section.label}</h2>
          <p className={styles.note}>Placeholder — built in {section.phase}.</p>
        </section>
      ))}
    </main>
  );
}
