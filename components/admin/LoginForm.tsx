"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { LogoMark } from "@/components/brand/LogoMark";
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
    <main className={styles.loginShell}>
      <section className={styles.loginBrand} aria-labelledby="login-brand-heading">
        <Link href="/" className={styles.loginBrandLink} aria-label="Assetly homepage">
          <LogoMark className={styles.loginMark} />
          <span>assetly leasing</span>
        </Link>

        <div className={styles.loginStatement}>
          <p className={styles.loginEyebrow}>Private workspace</p>
          <h2 id="login-brand-heading">
            A considered home for the names that stand beside ours.
          </h2>
          <p>
            Manage the Trusted By section with the same care and restraint as the
            public Assetly experience.
          </p>
        </div>

        <p className={styles.loginTagline}>Access · Scale · Grow</p>
      </section>

      <section className={styles.loginPanel}>
        <div className={styles.loginCard}>
          <p className={styles.loginKicker}>Authorized access only</p>
          <h1 className={styles.loginTitle}>Admin sign-in</h1>
          <p className={styles.loginIntro}>
            Sign in with the email address assigned to your Assetly administrator
            account.
          </p>

          <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                aria-describedby={error ? "admin-sign-in-error" : undefined}
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
                aria-describedby={error ? "admin-sign-in-error" : undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error ? (
              <p id="admin-sign-in-error" className={styles.formError} role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className={`${styles.primaryButton} ${styles.loginButton}`}
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in securely"}
            </button>
          </form>

          <p className={styles.securityNote}>
            This workspace is protected by Firebase Authentication and is not
            available to public-site visitors.
          </p>
        </div>
      </section>
    </main>
  );
}
