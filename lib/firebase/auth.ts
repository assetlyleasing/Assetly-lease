/**
 * Admin sign-in/out for `/admin`.
 *
 * §18/DEC-057: the panel has exactly one authorized admin, created directly in
 * the Firebase console during deployment setup (not by this codebase). There
 * is no self-registration flow and no separate allowlist to check — being
 * signed in to the configured Firebase project *is* being the admin, so the
 * gate in `components/admin/AdminGate.tsx` only needs to know whether a user
 * is present, not who they are.
 */

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { getAuthClient } from "./client";

export type AdminSignInResult = { ok: true } | { ok: false; message: string };

/**
 * Subscribes to the current admin auth state. Calls back immediately with
 * `null` (and never again) when Firebase is not configured, so the gate has a
 * definite state to render instead of hanging on "checking" forever.
 */
export function subscribeToAdminAuth(
  callback: (user: User | null) => void,
): () => void {
  const auth = getAuthClient();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminSignInResult> {
  const auth = getAuthClient();
  if (!auth) {
    return { ok: false, message: "Sign-in is not available right now." };
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: adminAuthErrorMessage(error) };
  }
}

export async function signOutAdmin(): Promise<void> {
  const auth = getAuthClient();
  if (!auth) return;
  await signOut(auth);
}

function adminAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again shortly.";
    default:
      return "Sign-in failed. Try again.";
  }
}
