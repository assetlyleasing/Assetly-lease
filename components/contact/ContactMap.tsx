"use client";

import { Plate } from "@/components/plate/Plate";
import {
  BENGALURU_MAIN_ROADS,
  BENGALURU_MAP_ATTRIBUTION,
  BENGALURU_MAP_URL,
  BENGALURU_MAP_VIEWBOX,
  BENGALURU_MARKER,
  BENGALURU_MINOR_ROADS,
  BENGALURU_PARKS,
  BENGALURU_SECONDARY_ROADS,
  BENGALURU_WATER,
} from "@/content/plates/bengaluru-map";
import { CONTACT } from "@/content/site/navigation";
import { useDrawOnEnter } from "@/lib/motion/useDrawOnEnter";

import styles from "./Contact.module.css";

/**
 * The Bengaluru map (SOURCE_OF_TRUTH.md §16, DEC-033).
 *
 * §16 asks for a map that gives "simple Bengaluru location context" without the
 * default-Google-Maps look, and the drawing that did that first was invented
 * road geometry — consistent with the plate language but recognisably nowhere.
 * The lines are now real OpenStreetMap geography for the six kilometres around
 * the office, baked into static paths by `content/plates/bengaluru-map`, so the
 * city reads as itself: Cubbon Park, the arteries off it, the tanks to the east.
 *
 * It is still a plate. The same `Plate` component draws it on entry, on the
 * same stroke and the same easing as every other drawing on the site — a live
 * map would have brought a tile provider, a script, a key and a UI that §16
 * explicitly does not want.
 *
 * The layers are separate `<path>` elements so each can carry its own weight
 * through `--plate-stroke`, which every stroked child inherits.
 */
export function ContactMap() {
  const { ref, drawn } = useDrawOnEnter<HTMLDivElement>({ threshold: 0.18 });

  return (
    <div ref={ref} className={styles.map} data-contact-map>
      <Plate
        viewBox={BENGALURU_MAP_VIEWBOX}
        drawn={drawn}
        opacity={0.5}
        strokeWidth={1}
        /*
         * Each layer is one path holding a few hundred sub-paths, so the dash
         * that hides it before it draws has to be longer than that whole layer
         * — the longest here runs to about 6,900 user units.
         */
        dashLength={8000}
        className={styles.mapPlate}
        preserveAspectRatio="xMidYMid slice"
      >
        <g className={styles.mapArea}>
          <path d={BENGALURU_PARKS} />
        </g>
        <g className={styles.mapWater}>
          <path d={BENGALURU_WATER} />
        </g>
        <g className={styles.mapMinor}>
          <path d={BENGALURU_MINOR_ROADS} />
        </g>
        <g className={styles.mapSecondary}>
          <path d={BENGALURU_SECONDARY_ROADS} />
        </g>
        <g className={styles.mapMain}>
          <path d={BENGALURU_MAIN_ROADS} />
        </g>

        {/*
         * The pin sits on the viewBox's exact centre, and so does the label
         * that names it. With `xMidYMid slice` the centre is the one point
         * that maps to the same place at every container aspect ratio, so
         * anchoring both there is what keeps them together (DEC-030) — and
         * that centre is now a real position, the window having been cut
         * around the office rather than around the drawing.
         */}
        <g className={styles.mapPin}>
          <circle cx={BENGALURU_MARKER.x} cy={BENGALURU_MARKER.y} r="17" />
          <circle cx={BENGALURU_MARKER.x} cy={BENGALURU_MARKER.y} r="4" />
        </g>
      </Plate>

      <span className={styles.mapLabel}>{CONTACT.city}</span>

      {/*
       * ODbL requires the source to be credited wherever the data is shown.
       * Not a link: the section owns no other outbound chrome, and the credit
       * reads as part of the drawing's own key.
       */}
      <span className={styles.mapCredit}>{BENGALURU_MAP_ATTRIBUTION}</span>

      <a
        className={styles.mapMarker}
        href={BENGALURU_MAP_URL}
        target="_blank"
        rel="noreferrer"
        data-contact-map-label
      >
        <span className={styles.mapMarkerDot} aria-hidden="true" />
        Assetly
        <span className="sr-only"> — open this Bengaluru location on a map, in a new tab</span>
      </a>
    </div>
  );
}
