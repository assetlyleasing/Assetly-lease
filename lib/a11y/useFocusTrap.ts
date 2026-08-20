"use client";

import { useCallback, useEffect, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useFocusTrap({
  active,
  containerRef,
  triggerRef,
  onEscape,
  initialFocusSelector,
  includeTrigger = false,
}: {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  onEscape: () => void;
  initialFocusSelector?: string;
  includeTrigger?: boolean;
}) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";

    const initial =
      (initialFocusSelector
        ? containerRef.current?.querySelector<HTMLElement>(initialFocusSelector)
        : null) ?? containerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    const focusInitial = () => {
      const container = containerRef.current;
      const activeElement = document.activeElement;

      // Do not disturb a visitor who has already moved to another control in
      // the dialog. Some browsers restore focus to the activating button once
      // more after reduced motion removes the opening transition, so make a
      // small number of bounded attempts while focus remains outside.
      if (container && activeElement && container.contains(activeElement)) return;
      initial?.focus();
    };
    const focusTimers = [50, 150, 400].map((delay) => setTimeout(focusInitial, delay));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      focusTimers.forEach(clearTimeout);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [active, containerRef, initialFocusSelector, onEscape, triggerRef]);

  const onTrapKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      if (!active || event.key !== "Tab") return;

      const nodes = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((node) => !node.hasAttribute("inert") && node.offsetParent !== null);
      const focusable = [
        ...(includeTrigger && triggerRef.current ? [triggerRef.current] : []),
        ...nodes,
      ];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [active, containerRef, includeTrigger, triggerRef],
  );

  return { onTrapKeyDown };
}
