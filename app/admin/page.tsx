import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/admin/Admin.module.css";
import { LogoMark } from "@/components/brand/LogoMark";
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
    <div className={styles.dashboard}>
      <header className={styles.dashboardBar}>
        <Link href="/" className={styles.brandLink} aria-label="Assetly homepage">
          <LogoMark className={styles.brandMark} />
          <span className={styles.brandName}>assetly leasing</span>
          <span className={styles.adminBadge}>Admin</span>
        </Link>
        <div className={styles.headerMeta} aria-label="Signed-in account">
          <SignOutButton />
        </div>
      </header>

      <main className={styles.page}>
        <header className={styles.pageIntro}>
          <div className={styles.introMeta}>
            <span>Private workspace</span>
            <span>Homepage content</span>
          </div>
          <div className={styles.introCopy}>
            <h1 className={styles.title}>Trusted By</h1>
            <p>
              Curate the partner marks shown on the homepage and control when the
              section is visible to visitors.
            </p>
          </div>
        </header>

        <div className={styles.workspaceGrid}>
          <section className={`${styles.panel} ${styles.visibilityPanel}`}>
            <header className={styles.panelHeader}>
              <span className={styles.panelIndex} aria-hidden="true">01</span>
              <div>
                <p className={styles.panelEyebrow}>Publishing</p>
                <h2 className={styles.sectionHeading}>Section visibility</h2>
              </div>
            </header>
            <p className={styles.panelDescription}>
              Publish the strip only when the partner library is ready. An empty
              library remains hidden even when publishing is on.
            </p>
            <SectionToggle />
          </section>

          <section className={`${styles.panel} ${styles.libraryPanel}`}>
            <header className={styles.panelHeader}>
              <span className={styles.panelIndex} aria-hidden="true">02</span>
              <div>
                <p className={styles.panelEyebrow}>Content</p>
                <h2 className={styles.sectionHeading}>Partner library</h2>
              </div>
            </header>
            <p className={styles.panelDescription}>
              Upload approved logo files, write meaningful alternative text, and
              arrange the order shown on the public site.
            </p>
            <LogoManager />
          </section>
        </div>
      </main>

      <footer className={styles.dashboardFooter}>
        <span>Assetly Leasing</span>
        <span>Internal content control</span>
      </footer>
    </div>
  );
}
