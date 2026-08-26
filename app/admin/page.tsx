import type { Metadata } from "next";

import styles from "@/components/admin/Admin.module.css";
import { LogoManager } from "@/components/admin/LogoManager";
import { SectionToggle } from "@/components/admin/SectionToggle";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata: Metadata = {
  title: "Admin | Assetly",
  // §22: the admin surface must never be indexed, and is excluded from the
  // sitemap built in Phase 9.
  robots: { index: false, follow: false },
};

/**
 * Trusted By logo management (§18, Phase 3). Scope is deliberately narrow —
 * this section only, no general-purpose CMS (DEC-011).
 */
export default function AdminPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Trusted By</h1>
        <div className={styles.headerMeta}>
          <SignOutButton />
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Section</h2>
        <SectionToggle />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Logos</h2>
        <LogoManager />
      </section>
    </div>
  );
}
