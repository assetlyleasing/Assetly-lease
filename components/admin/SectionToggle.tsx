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
    <div className={styles.toggleRow}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Trusted By section"
        className={styles.toggleSwitch}
        data-on={enabled}
        disabled={saving}
        onClick={handleToggle}
      >
        <span />
      </button>
      <span className={styles.toggleLabel}>
        Trusted By is {enabled ? "on" : "off"}
      </span>
    </div>
  );
}
