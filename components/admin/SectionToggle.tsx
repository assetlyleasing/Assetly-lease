"use client";

import { useEffect, useState } from "react";

import { setTrustedBySectionEnabled, subscribeTrustedBySection } from "@/lib/firebase/firestore";

import styles from "./Admin.module.css";

/**
 * Trusted By ON/OFF (§18 `siteSections/trustedBy.enabled`). Writing here is
 * what the public homepage picks up with no redeploy (DEC-011).
 */
export function SectionToggle() {
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeTrustedBySection((section) => setEnabled(section?.enabled ?? false)), []);

  async function handleToggle() {
    setSaving(true);
    try {
      await setTrustedBySectionEnabled(!enabled);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.toggleCard} data-on={enabled}>
      <div className={styles.toggleCopy}>
        <span className={styles.toggleStatus}>
          {enabled ? "Published" : "Not published"}
        </span>
        <span id="trusted-by-toggle-description" className={styles.toggleLabel}>
          Trusted By is {enabled ? "visible when active logos exist" : "hidden from the homepage"}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Trusted By section"
        aria-describedby="trusted-by-toggle-description"
        className={styles.toggleSwitch}
        data-on={enabled}
        disabled={saving}
        onClick={handleToggle}
      >
        <span />
      </button>
    </div>
  );
}
