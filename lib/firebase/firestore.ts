/**
 * Typed `siteSections/trustedBy` and `trustedLogos/{logoId}` accessors (§18).
 *
 * Every read here is a live `onSnapshot` subscription, not a one-shot `get`:
 * the whole point of Firestore-backing this one section (DEC-011) is that an
 * admin change appears on the public site with no redeploy, which only a
 * subscription delivers. Every subscribe function reports failure by calling
 * back with `null`/`[]` rather than throwing, per §12/§18/§21's silent-failure
 * requirement — the public marquee simply renders nothing.
 */

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";

import type { SortOrderPatch } from "@/lib/trustedBy/reorder";

import { getDb } from "./client";

export type TrustedBySection = {
  enabled: boolean;
};

export type TrustedLogo = {
  id: string;
  name: string;
  alt: string;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
};

const TRUSTED_BY_DOC_PATH = ["siteSections", "trustedBy"] as const;
const TRUSTED_LOGOS_COLLECTION = "trustedLogos";

/** Public: the Trusted By toggle. `null` = not configured, unreachable, or absent. */
export function subscribeTrustedBySection(
  callback: (section: TrustedBySection | null) => void,
): Unsubscribe {
  const db = getDb();
  if (!db) {
    callback(null);
    return () => {};
  }

  const ref = doc(db, ...TRUSTED_BY_DOC_PATH);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      const data = snapshot.data();
      callback({ enabled: data.enabled === true });
    },
    () => callback(null),
  );
}

/** Public: active logos only, sorted ascending — exactly what the marquee renders. */
export function subscribeActiveTrustedLogos(
  callback: (logos: TrustedLogo[]) => void,
): Unsubscribe {
  const db = getDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const logosQuery = query(
    collection(db, TRUSTED_LOGOS_COLLECTION),
    where("active", "==", true),
    orderBy("sortOrder", "asc"),
  );

  return onSnapshot(
    logosQuery,
    (snapshot) => callback(snapshot.docs.map(toTrustedLogo)),
    () => callback([]),
  );
}

/** Admin: every logo (active and inactive), sorted ascending, for `LogoManager`. */
export function subscribeAllTrustedLogos(
  callback: (logos: TrustedLogo[]) => void,
): Unsubscribe {
  const db = getDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  const logosQuery = query(
    collection(db, TRUSTED_LOGOS_COLLECTION),
    orderBy("sortOrder", "asc"),
  );

  return onSnapshot(
    logosQuery,
    (snapshot) => callback(snapshot.docs.map(toTrustedLogo)),
    () => callback([]),
  );
}

function toTrustedLogo(
  docSnapshot: import("firebase/firestore").QueryDocumentSnapshot,
): TrustedLogo {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    name: typeof data.name === "string" ? data.name : "",
    alt: typeof data.alt === "string" ? data.alt : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
    active: data.active === true,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

/** Admin: writes the Trusted By ON/OFF toggle. */
export async function setTrustedBySectionEnabled(enabled: boolean): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured.");

  const ref = doc(db, ...TRUSTED_BY_DOC_PATH);
  await setDoc(ref, { enabled, updatedAt: serverTimestamp() }, { merge: true });
}

/** Admin: creates a logo doc at the end of the current order. Returns the new id. */
export async function createTrustedLogo(input: {
  name: string;
  alt: string;
  imageUrl: string;
  sortOrder: number;
}): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured.");

  const ref = doc(collection(db, TRUSTED_LOGOS_COLLECTION));
  await setDoc(ref, {
    name: input.name,
    alt: input.alt,
    imageUrl: input.imageUrl,
    active: true,
    sortOrder: input.sortOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Admin: patches name/alt/active on an existing logo doc. */
export async function updateTrustedLogo(
  id: string,
  patch: Partial<Pick<TrustedLogo, "name" | "alt" | "active">>,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured.");

  const ref = doc(db, TRUSTED_LOGOS_COLLECTION, id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

/** Admin: deletes a logo doc. The caller is responsible for the Storage object. */
export async function deleteTrustedLogoDoc(id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured.");

  await deleteDoc(doc(db, TRUSTED_LOGOS_COLLECTION, id));
}

/** Admin: writes a new `sortOrder` for every entry in one batch. */
export async function writeTrustedLogoOrder(patches: readonly SortOrderPatch[]): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured.");
  if (patches.length === 0) return;

  const batch = writeBatch(db);
  for (const patch of patches) {
    batch.update(doc(db, TRUSTED_LOGOS_COLLECTION, patch.id), {
      sortOrder: patch.sortOrder,
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}
