"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { createTrustedLogo } from "@/lib/firebase/firestore";
import { uploadTrustedLogoFile } from "@/lib/firebase/storage";
import {
  defaultAltFromName,
  logoUploadFieldErrors,
  logoUploadSchema,
  type LogoUploadFieldErrors,
} from "@/lib/validation/logoUpload";

import styles from "./Admin.module.css";

/**
 * Upload flow (§18/TRUST-005): pick a file, name it, get an editable
 * auto-generated alt default, preview it, then upload to Storage and create
 * the Firestore doc. `nextSortOrder` places the new logo at the end of the
 * current order.
 */
export function LogoUploadForm({ nextSortOrder }: { nextSortOrder: number }) {
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [altTouched, setAltTouched] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<LogoUploadFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleNameChange(value: string) {
    setName(value);
    if (!altTouched) setAlt(defaultAltFromName(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const result = logoUploadSchema.safeParse({ name, alt, file });
    if (!result.success) {
      setErrors(logoUploadFieldErrors(result.error));
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const imageUrl = await uploadTrustedLogoFile(result.data.file);
      await createTrustedLogo({
        name: result.data.name,
        alt: result.data.alt,
        imageUrl,
        sortOrder: nextSortOrder,
      });
      setName("");
      setAlt("");
      setAltTouched(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setFormError("Upload failed. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.uploadForm} onSubmit={handleSubmit} noValidate>
      <header className={styles.uploadHeader}>
        <div>
          <p className={styles.uploadEyebrow}>New partner</p>
          <h4>Add a logo</h4>
        </div>
        <p>SVG, PNG, or WebP · Maximum 2MB</p>
      </header>

      <div className={styles.formGrid}>
        <div className={styles.field} data-invalid={Boolean(errors.name)}>
          <label htmlFor="logo-name">Organization name</label>
          <input
            id="logo-name"
            type="text"
            placeholder="e.g. Acme Capital"
            value={name}
            aria-describedby={errors.name ? "logo-name-error" : undefined}
            onChange={(event) => handleNameChange(event.target.value)}
          />
          {errors.name ? (
            <span id="logo-name-error" className={styles.error}>
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className={styles.field} data-invalid={Boolean(errors.alt)}>
          <label htmlFor="logo-alt">Alternative text</label>
          <input
            id="logo-alt"
            type="text"
            placeholder="Acme Capital logo"
            value={alt}
            aria-describedby={errors.alt ? "logo-alt-error" : "logo-alt-hint"}
            onChange={(event) => {
              setAltTouched(true);
              setAlt(event.target.value);
            }}
          />
          {errors.alt ? (
            <span id="logo-alt-error" className={styles.error}>
              {errors.alt}
            </span>
          ) : (
            <span id="logo-alt-hint" className={styles.hint}>
              Generated from the name; edit if needed.
            </span>
          )}
        </div>
      </div>

      <div className={`${styles.field} ${styles.fileField}`} data-invalid={Boolean(errors.file)}>
        <label htmlFor="logo-file">Logo file</label>
        <input
          id="logo-file"
          ref={fileInputRef}
          type="file"
          accept="image/svg+xml,image/png,image/webp"
          aria-describedby={errors.file ? "logo-file-error" : undefined}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        {errors.file ? (
          <span id="logo-file-error" className={styles.error}>
            {errors.file}
          </span>
        ) : null}
      </div>

      {previewUrl ? (
        <div className={styles.previewRow}>
          <div className={styles.logoThumb}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ephemeral local preview, not a served asset */}
            <img src={previewUrl} alt="Selected logo preview" />
          </div>
          <span>Preview ready</span>
        </div>
      ) : null}

      {formError ? (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      ) : null}

      <div className={styles.uploadFooter}>
        <p>The new logo is added to the end of the current display order.</p>
        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? "Uploading…" : "Upload logo"}
        </button>
      </div>
    </form>
  );
}
