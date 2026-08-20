"use client";

import { useCallback, useEffect, useId, useRef } from "react";

import { SiteLinkAnchor } from "@/components/primitives/SiteLinkAnchor";
import { NAV_LINKS } from "@/content/site/navigation";

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

  // Escape closes, and focus returns to the button that opened it (§20).
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // The page behind an open full-screen overlay must not scroll.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the panel on open so the keyboard follows the eye.
  useEffect(() => {
    if (!open) return;

    const first = panelRef.current?.querySelector<HTMLElement>("a[href]");
    first?.focus();
  }, [open]);

  /*
   * Keep Tab inside the open overlay. The cycle is the toggle plus the panel's
   * links, so shift-tabbing off the first link lands back on the X rather than
   * on page content the visitor cannot see.
   */
  const onPanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusable = [
      toggleRef.current,
      ...Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [],
      ),
    ].filter((node): node is HTMLElement => node !== null);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
        onKeyDown={onPanelKeyDown}
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
        onKeyDown={onPanelKeyDown}
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
