"use client";

import { useSyncExternalStore } from "react";

/*
 * A document-scoped replay flag for the home opening.
 *
 * Module state is deliberate. It survives App Router navigation within one
 * document, but is recreated by a full page load. Importing this module from
 * the shared Nav captures the document's initial route before a later client
 * navigation can mount the homepage.
 */
const initialDocumentPath =
  typeof window === "undefined" ? null : window.location.pathname;

/*
 * A bfcache-restored tab resumes exactly as it was frozen — `completed` would
 * stay whatever it was when the tab was cached, so returning to `/` via the
 * back/forward button could show the plate already fully drawn with no
 * opening at all. A reload on restore is a genuine full document load, which
 * is exactly the condition this module already exists to require, so it
 * re-runs `initialDocumentPath`'s capture from scratch rather than resuming
 * stale state. Scoped to `/` — no other route cares about this replay flag.
 */
if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && window.location.pathname === "/") {
      window.location.reload();
    }
  });
}

let completed = false;

const subscribe = () => () => undefined;
const getServerSnapshot = () => true;
const getSnapshot = () => initialDocumentPath === "/" && !completed;

export function useShouldPlayHomeOpening(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function completeHomeOpening(): void {
  completed = true;
}
