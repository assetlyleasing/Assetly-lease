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
 * The private content workspace (§18, Phase 3).
 *
 * Trusted By is the only managed section, and DEC-011 keeps it that way — this
 * is not a general-purpose CMS. The page is nonetheless built as a workspace
 * holding a list of sections rather than as the Trusted By page itself, because
 * the earlier shape made the section name the workspace's own h1 and left
 * nowhere for a second section to go.
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
            <span>Assetly Leasing</span>
          </div>
          <div className={styles.introCopy}>
            <h1 className={styles.title}>Homepage content</h1>
            <p>
              The sections of the public homepage that are managed from here.
              Changes are live as soon as they are saved.
            </p>
          </div>
        </header>

        {/*
         * The managed sections are a list, and the list is the point. Trusted By
         * is the only entry today (DEC-011 keeps the scope to that section), but
         * it is presented as one section among however many there turn out to
         * be, rather than as the identity of the whole workspace — adding the
         * next one should be adding an entry, not restructuring the page.
         */}
        <p className={styles.sectionIndex}>Managed sections</p>

        <section className={styles.section} aria-labelledby="section-trusted-by">
          <header className={styles.sectionBar}>
            <span className={styles.sectionIndexMark} aria-hidden="true">
              01
            </span>
            <div className={styles.sectionBarCopy}>
              <h2 id="section-trusted-by" className={styles.sectionTitle}>
                Trusted By
              </h2>
              <p>
                Curate the partner marks shown on the homepage and control when
                the section is visible to visitors.
              </p>
            </div>
          </header>

          <div className={styles.workspaceGrid}>
            <section className={`${styles.panel} ${styles.visibilityPanel}`}>
              <header className={styles.panelHeader}>
                <span className={styles.panelIndex} aria-hidden="true">
                  01
                </span>
                <div>
                  <p className={styles.panelEyebrow}>Publishing</p>
                  <h3 className={styles.panelHeading}>Section visibility</h3>
                </div>
              </header>
              <p className={styles.panelDescription}>
                Publish the strip only when the partner library is ready. An
                empty library remains hidden even when publishing is on.
              </p>
              <SectionToggle />
            </section>

            <section className={`${styles.panel} ${styles.libraryPanel}`}>
              <header className={styles.panelHeader}>
                <span className={styles.panelIndex} aria-hidden="true">
                  02
                </span>
                <div>
                  <p className={styles.panelEyebrow}>Content</p>
                  <h3 className={styles.panelHeading}>Partner library</h3>
                </div>
              </header>
              <p className={styles.panelDescription}>
                Upload approved logo files, write meaningful alternative text,
                and arrange the order shown on the public site.
              </p>
              <LogoManager />
            </section>
          </div>
        </section>
      </main>

      <footer className={styles.dashboardFooter}>
        <span>Assetly Leasing</span>
        <span>Internal content control</span>
      </footer>
    </div>
  );
}
