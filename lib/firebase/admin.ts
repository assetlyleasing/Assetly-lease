/**
 * Server-side Firebase Admin initialisation.
 *
 * Never import this from a Client Component or from anything that reaches the
 * browser bundle — it reads a service-account private key.
 *
 * As with the browser client, this is init-only in Phase 0 and has no consumers
 * yet. Credentials come from `FIREBASE_ADMIN_*` environment variables and no
 * project exists yet (`OD-05` deferred), so initialisation is lazy and returns
 * `null` when the environment is incomplete instead of throwing.
 *
 * The private key is stored as a single-line value with escaped newlines, which
 * is how Firebase's own console exports it and how most hosts accept it; the
 * newlines are restored below.
 */

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const ADMIN_APP_NAME = "assetly-admin";

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
} as const;

/** True when a full service-account credential is present in the environment. */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    adminConfig.projectId && adminConfig.clientEmail && adminConfig.privateKey,
  );
}

let adminApp: App | null = null;

/**
 * The shared Admin `App`, or `null` when credentials are not configured.
 * Named so it cannot collide with a default app initialised elsewhere.
 */
export function getFirebaseAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;
  if (adminApp) return adminApp;

  const existing = getApps().find((entry) => entry.name === ADMIN_APP_NAME);
  if (existing) {
    adminApp = existing;
    return adminApp;
  }

  adminApp = initializeApp(
    {
      credential: cert({
        projectId: adminConfig.projectId!,
        clientEmail: adminConfig.clientEmail!,
        privateKey: adminConfig.privateKey!.replace(/\\n/g, "\n"),
      }),
      storageBucket: adminConfig.storageBucket,
    },
    ADMIN_APP_NAME,
  );

  return adminApp;
}

/** Admin Firestore instance, or `null` when credentials are not configured. */
export function getAdminDb(): Firestore | null {
  const instance = getFirebaseAdminApp();
  return instance ? getFirestore(instance) : null;
}

/** Admin Storage instance, or `null` when credentials are not configured. */
export function getAdminStorage(): Storage | null {
  const instance = getFirebaseAdminApp();
  return instance ? getStorage(instance) : null;
}

/** Admin Auth instance, or `null` when credentials are not configured. */
export function getAdminAuth(): Auth | null {
  const instance = getFirebaseAdminApp();
  return instance ? getAuth(instance) : null;
}
