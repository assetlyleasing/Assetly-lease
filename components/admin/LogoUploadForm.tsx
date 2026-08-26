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
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field} data-invalid={Boolean(errors.name)}>
        <label htmlFor="logo-name">Name</label>
        <input
          id="logo-name"
          type="text"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
        />
        {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
      </div>

      <div className={styles.field} data-invalid={Boolean(errors.alt)}>
        <label htmlFor="logo-alt">Alt text</label>
        <input
          id="logo-alt"
          type="text"
          value={alt}
          onChange={(event) => {
            setAltTouched(true);
            setAlt(event.target.value);
          }}
        />
        {errors.alt ? <span className={styles.error}>{errors.alt}</span> : null}
      </div>

      <div className={styles.field} data-invalid={Boolean(errors.file)}>
        <label htmlFor="logo-file">Logo file (SVG, PNG, or WebP, up to 2MB)</label>
        <input
          id="logo-file"
          ref={fileInputRef}
          type="file"
          accept="image/svg+xml,image/png,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        {errors.file ? <span className={styles.error}>{errors.file}</span> : null}
      </div>

      {previewUrl ? (
        <div className={styles.logoThumb}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ephemeral local preview, not a served asset */}
          <img src={previewUrl} alt="Selected logo preview" />
        </div>
      ) : null}

      {formError ? (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      ) : null}

      <button type="submit" className={styles.primaryButton} disabled={submitting}>
        {submitting ? "Uploading…" : "Upload logo"}
      </button>
    </form>
  );
}
