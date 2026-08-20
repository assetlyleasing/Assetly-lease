import type { Metadata } from "next";

import styles from "../placeholder.module.css";

export const metadata: Metadata = {
  title: "About | Assetly",
};

/*
 * About page. Phase 1 renders it only as a second route for the shared shell to
 * prove itself on — Nav and Footer must behave identically here, and section
 * links must resolve back to `/#section` rather than to a fragment.
 *
 * The real content (image, heading, company description, optional location
 * line) is built in Phase 8 from source-grounded copy only. Do not fabricate
 * company history, statistics, or founder content here; §4 is explicit.
 */
export default function AboutPage() {
  return (
    <main>
      <section className={styles.section}>
        <h1>About Assetly</h1>
        <p className={styles.note}>Placeholder — built in Phase 8.</p>
      </section>
    </main>
  );
}
