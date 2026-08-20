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
