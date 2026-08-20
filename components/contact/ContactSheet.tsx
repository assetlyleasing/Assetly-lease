"use client";

import { useRef, type ReactNode, type RefObject } from "react";

import { useFocusTrap } from "@/lib/a11y/useFocusTrap";

import styles from "./Contact.module.css";

export function ContactSheet({
  open,
  panelId,
  triggerRef,
  onClose,
  children,
}: {
  open: boolean;
  panelId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const { onTrapKeyDown } = useFocusTrap({
    active: open,
    containerRef: panelRef,
    triggerRef,
    onEscape: onClose,
    initialFocusSelector: 'button[aria-pressed], [data-contact-step="details"] input',
  });

  return (
    <div
      className={styles.sheetLayer}
      data-open={open ? "true" : "false"}
      inert={!open}
      data-contact-panel-layer
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close contact panel"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        id={panelId}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${panelId}-title`}
        data-contact-panel="sheet"
        onKeyDown={onTrapKeyDown}
      >
        <span className={styles.grip} aria-hidden="true" />
        <div className={styles.panelTop}>
          <h2 id={`${panelId}-title`}>Contact Assetly</h2>
          <button type="button" className={styles.close} onClick={onClose} data-contact-close>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
