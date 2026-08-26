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
    <div>
      <LogoUploadForm nextSortOrder={logos.length} />

      {logos.length === 0 ? (
        <p className={styles.emptyState}>No logos uploaded yet.</p>
      ) : (
        <ul className={styles.logoList}>
          {logos.map((logo, index) => (
            <li key={logo.id} className={styles.logoRow} data-active={logo.active}>
              <div className={styles.logoThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-only, arbitrary external download URLs */}
                <img src={logo.imageUrl} alt="" />
              </div>
              <div className={styles.logoInfo}>
                <span className={styles.logoName}>{logo.name}</span>
                <span className={styles.logoAlt}>{logo.alt}</span>
              </div>
              <div className={styles.logoActions}>
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
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busyId === logo.id}
                  aria-pressed={logo.active}
                  onClick={() => handleToggleActive(logo)}
                  aria-label={`${logo.active ? "Disable" : "Enable"} ${logo.name}`}
                >
                  {logo.active ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busyId === logo.id}
                  onClick={() => handleDelete(logo)}
                  aria-label={`Delete ${logo.name}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
