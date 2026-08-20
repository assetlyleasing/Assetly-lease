"use client";

import { useCallback, useEffect, useId, useRef } from "react";

import { SiteLinkAnchor } from "@/components/primitives/SiteLinkAnchor";
import { NAV_LINKS } from "@/content/site/navigation";
import { useFocusTrap } from "@/lib/a11y/useFocusTrap";

import styles from "./MobileMenu.module.css";

/**
 * Hamburger and full-width top overlay (§10, DEC-004).
 *
 * The overlay stays mounted so its entrance can be a CSS transition rather than
 * a mount, and is hidden from assistive technology and from the tab order while
 * closed — `visibility: hidden` in the stylesheet plus `inert` here, so a
 * closed menu is unreachable by keyboard as well as invisible.
 *
 * Controlled by Nav, which needs the open state to keep the brand mark legible
 * above the overlay.
 */
export function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const { onTrapKeyDown } = useFocusTrap({
    active: open,
    containerRef: panelRef,
    triggerRef: toggleRef,
    onEscape: close,
    initialFocusSelector: "a[href]",
    includeTrigger: true,
  });

  // Close when the viewport grows past the breakpoint: the desktop link row
  // takes over, and an overlay left open would trap focus in hidden content.
  useEffect(() => {
    if (!open) return;

    const media = window.matchMedia("(min-width: 701px)");
    const onChange = () => {
      if (media.matches) close();
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => onOpenChange(!open)}
        onKeyDown={onTrapKeyDown}
      >
        <span className={`${styles.bar} ${styles.barTop}`} />
        <span className={`${styles.bar} ${styles.barBottom}`} />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        className={styles.overlay}
        data-open={open}
        inert={!open}
        onKeyDown={onTrapKeyDown}
      >
        <nav aria-label="Mobile">
          <ul className={styles.list}>
            {NAV_LINKS.map((link) => (
              <li key={link.label} className={styles.item}>
                <SiteLinkAnchor
                  link={link}
                  className={styles.link}
                  onNavigate={close}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
