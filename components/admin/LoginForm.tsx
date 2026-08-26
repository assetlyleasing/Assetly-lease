"use client";

import { useState, type FormEvent } from "react";

import { signInAdmin } from "@/lib/firebase/auth";

import styles from "./Admin.module.css";

/**
 * `/admin/login` form. On success, `AdminGate`'s auth subscription picks up
 * the new session and redirects to `/admin` itself — this component only
 * needs to attempt sign-in and surface a failure.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signInAdmin(email, password);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
    }
    // On success, leave `submitting` true — AdminGate redirects away shortly.
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin sign-in</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
