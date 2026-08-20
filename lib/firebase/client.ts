/**
 * Browser-side Firebase initialisation.
 *
 * Phase 0 wires the SDK but gives it no consumers — the first of those arrive
 * in Phase 3 (Trusted By). See MASTER_PLAN.md Phase 0 task 6.
 *
 * Configuration comes entirely from `NEXT_PUBLIC_FIREBASE_*` environment
 * variables (see `.env.local.example`). No project exists yet: `OD-05` is
 * unresolved, so every accessor below is lazy and returns `null` when the
 * environment is incomplete, rather than throwing at import time. That keeps a
 * missing configuration from breaking the build or the first paint, which
 * matters because §21 makes Hero rendering the top performance priority and
 * §12/§18 require Trusted By to fail silently rather than surface an error.
 *
 * Callers must therefore treat every return value here as nullable and degrade
 * gracefully — never assert non-null.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

/**
 * True when every value the Firebase web SDK needs is present. Use this to skip
 * remote work entirely rather than letting a half-configured SDK fail at call
 * time.
 */
export function isFirebaseConfigured(): boolean {
  return Object.values(firebaseConfig).every(
    (value) => typeof value === "string" && value.length > 0,
  );
}

let app: FirebaseApp | null = null;

/**
 * The shared `FirebaseApp`, or `null` when the environment is not configured.
 * Reuses an existing app instance so React Fast Refresh does not re-initialise
 * on every edit.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (app) return app;

  app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: firebaseConfig.apiKey!,
        authDomain: firebaseConfig.authDomain!,
        projectId: firebaseConfig.projectId!,
        storageBucket: firebaseConfig.storageBucket!,
        messagingSenderId: firebaseConfig.messagingSenderId!,
        appId: firebaseConfig.appId!,
      });

  return app;
}

/** Firestore instance, or `null` when Firebase is not configured. */
export function getDb(): Firestore | null {
  const instance = getFirebaseApp();
  return instance ? getFirestore(instance) : null;
}

/** Cloud Storage instance, or `null` when Firebase is not configured. */
export function getStorageClient(): FirebaseStorage | null {
  const instance = getFirebaseApp();
  return instance ? getStorage(instance) : null;
}

/** Auth instance, or `null` when Firebase is not configured. */
export function getAuthClient(): Auth | null {
  const instance = getFirebaseApp();
  return instance ? getAuth(instance) : null;
}
