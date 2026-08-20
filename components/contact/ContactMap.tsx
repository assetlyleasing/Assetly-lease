"use client";

import { Plate } from "@/components/plate/Plate";
import { useDrawOnEnter } from "@/lib/motion/useDrawOnEnter";

import styles from "./Contact.module.css";

export function ContactMap() {
  const { ref, drawn } = useDrawOnEnter<HTMLDivElement>({ threshold: 0.18 });

  return (
    <div ref={ref} className={styles.map} data-contact-map>
      <Plate
        viewBox="0 0 800 520"
        drawn={drawn}
        opacity={0.5}
        strokeWidth={1.1}
        dashLength={3600}
        className={styles.mapPlate}
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-20 102C94 124 134 74 242 98S415 174 524 142 701 56 830 86" />
        <path d="M-12 318C92 282 182 346 278 314S449 231 557 263 703 379 825 330" />
        <path d="M76-20C103 96 55 190 111 284S227 411 198 550" />
        <path d="M349-18C313 82 384 157 342 249S259 414 315 545" />
        <path d="M629-20C580 77 655 158 617 247S521 413 583 550" />
        <path d="M21 208L155 181 267 222 391 188 509 218 691 173 814 205" />
        <path d="M18 430L142 395 248 442 372 403 491 443 612 396 808 438" />
        <path d="M156 181L198 104M267 222L315 314M391 188L449 91M509 218L557 263M691 173L612 396" />
        <circle cx="475" cy="276" r="23" />
        <circle cx="475" cy="276" r="5" />
        <path d="M475 299V356M448 356H502" />
      </Plate>

      <span className={styles.mapLabel}>Bengaluru</span>
      <span className={styles.mapMarker} aria-hidden="true">
        <span className={styles.mapMarkerDot} />
        Assetly
      </span>
    </div>
  );
}
