/**
 * Trusted By logo file storage (§18: `trusted-logos/`).
 *
 * Firestore holds only `imageUrl` (§18's schema, transcribed exactly — no
 * extra storage-path field). `ref(storage, url)` accepts a download URL
 * directly and resolves it back to the right object, so deletion doesn't need
 * one.
 */

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { getStorageClient } from "./client";

const LOGO_PREFIX = "trusted-logos";

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  if (file.type === "image/svg+xml") return "svg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "bin";
}

/** Uploads a logo file under a fresh, collision-proof object name; returns its download URL. */
export async function uploadTrustedLogoFile(file: File): Promise<string> {
  const storage = getStorageClient();
  if (!storage) throw new Error("Storage is not configured.");

  const objectRef = ref(
    storage,
    `${LOGO_PREFIX}/${crypto.randomUUID()}.${extensionFor(file)}`,
  );
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
}

/** Best-effort delete — an already-missing object must not block removing the Firestore doc. */
export async function deleteTrustedLogoFile(imageUrl: string): Promise<void> {
  const storage = getStorageClient();
  if (!storage) return;

  try {
    await deleteObject(ref(storage, imageUrl));
  } catch {
    // Ignored: the doc deletion is the source of truth for whether a logo exists.
  }
}
