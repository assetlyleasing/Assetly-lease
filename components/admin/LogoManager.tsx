"use client";

import { useEffect, useState } from "react";

import {
  deleteTrustedLogoDoc,
  subscribeAllTrustedLogos,
  updateTrustedLogo,
  writeTrustedLogoOrder,
  type TrustedLogo,
} from "@/lib/firebase/firestore";
import { deleteTrustedLogoFile } from "@/lib/firebase/storage";
import { moveLogo, withSequentialSortOrder } from "@/lib/trustedBy/reorder";

import styles from "./Admin.module.css";
import { LogoUploadForm } from "./LogoUploadForm";

/**
 * Full logo CRUD list (§18/TRUST-006): enable/disable, reorder, delete. Move
 * buttons are disabled at either edge, so `handleMove` is never called on a
 * no-op swap.
 */
export function LogoManager() {
  const [logos, setLogos] = useState<TrustedLogo[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => subscribeAllTrustedLogos(setLogos), []);

  async function handleToggleActive(logo: TrustedLogo) {
    setBusyId(logo.id);
    try {
      await updateTrustedLogo(logo.id, { active: !logo.active });
    } finally {
      setBusyId(null);
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const reordered = moveLogo(logos, id, direction);
    setBusyId(id);
    try {
      await writeTrustedLogoOrder(withSequentialSortOrder(reordered));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(logo: TrustedLogo) {
    if (!window.confirm(`Delete "${logo.name}"? This cannot be undone.`)) return;
    setBusyId(logo.id);
    try {
      await deleteTrustedLogoDoc(logo.id);
      await deleteTrustedLogoFile(logo.imageUrl);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className={styles.logoManager}>
      <LogoUploadForm nextSortOrder={logos.length} />

      {logos.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIndex} aria-hidden="true">00</span>
          <div>
            <h4>No logos uploaded yet</h4>
            <p>Your approved partner marks will appear here after the first upload.</p>
          </div>
        </div>
      ) : (
        <div className={styles.libraryList}>
          <header className={styles.libraryHeader}>
            <div>
              <p className={styles.uploadEyebrow}>Display order</p>
              <h4>Current library</h4>
            </div>
            <span aria-live="polite">
              {logos.length} {logos.length === 1 ? "logo" : "logos"}
            </span>
          </header>
          <ul className={styles.logoList}>
            {logos.map((logo, index) => (
              <li
                key={logo.id}
                className={styles.logoRow}
                data-active={logo.active}
                data-busy={busyId === logo.id}
              >
                <span className={styles.logoOrder} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.logoThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-only, arbitrary external download URLs */}
                  <img src={logo.imageUrl} alt="" />
                </div>
                <div className={styles.logoInfo}>
                  <span className={styles.logoName}>{logo.name}</span>
                  <span className={styles.logoAlt}>{logo.alt}</span>
                </div>
                <div className={styles.logoActions}>
                  <div className={styles.orderActions} aria-label={`Reorder ${logo.name}`}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      disabled={busyId === logo.id || index === 0}
                      onClick={() => handleMove(logo.id, "up")}
                      aria-label={`Move ${logo.name} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      disabled={busyId === logo.id || index === logos.length - 1}
                      onClick={() => handleMove(logo.id, "down")}
                      aria-label={`Move ${logo.name} down`}
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    className={styles.statusButton}
                    data-active={logo.active}
                    disabled={busyId === logo.id}
                    aria-pressed={logo.active}
                    onClick={() => handleToggleActive(logo)}
                    aria-label={`${logo.active ? "Disable" : "Enable"} ${logo.name}`}
                  >
                    {logo.active ? "Live" : "Hidden"}
                  </button>
                  <button
                    type="button"
                    className={styles.removeButton}
                    disabled={busyId === logo.id}
                    onClick={() => handleDelete(logo)}
                    aria-label={`Delete ${logo.name}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
