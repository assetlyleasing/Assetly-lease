# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 8.5 (the Hero opening loader) is **merged into `main`**, alongside the owner-directed refinement pass over the shipped homepage. Phases 0, 1, 2, 4, 5, 6, 7, 8 and 8.5 are complete. Phase 3 remains blocked on `OD-05`/`OD-06`.

## Current Task

Verifying the merged tree. The loader now precedes every load of `/`, and the section specs written before it existed have to account for that.

## Status

Two lines of work that ran in parallel are now one. `phase/hero-opening-loader` carried the opening sequence; `main` carried seven corrections to already-built sections. Neither touched the other's components, and the merge conflicted only where both had appended to the same shared files.

## Completed This Cycle

### The Hero opening (Phase 8.5, DEC-031)

The homepage opens with the approved Pitch signature — the `a.` mark and `ACCESS · SCALE · GROW` — before handing off to the Hero. One persistent mark node runs through the whole sequence and lands on a destination measured from the rendered layout rather than a duplicated coordinate. The double blink is one continuous 1.7s curve with two 25% dips; recede is 650ms, settle 850ms, then the mark holds completely still for 320ms before the overlay clears. Nothing moves after landing. The loader plays on a full document load of `/` only — never on `/about`, never on a client-side return to `/` — recorded by a module-scope flag, so there is no storage read and no hydration branch.

### Slide 01's plate (DEC-035)

The left half was redrawn from the canonical reference rather than invented: the wheeled crane in `reference/home-2.html`'s hero plate, mirrored about its own bounding box so the boom hangs outward, scaled 0.2 onto the plate's ground line. The transform is recorded in the file so the drawing can be re-derived instead of guessed at.

### A locked focus band on the four arguments (DEC-034)

The focus effect was continuously derived from distance-to-centre, so "at rest" was one pixel and any movement blurred the copy the reader was reading — worst on a phone, where a thumb never stops on an exact pixel. `focusAppearance` now holds the resting state across a band (0.26 viewport heights desktop, 0.34 mobile), then runs the same fade/blur/shift to full effect by 0.86, and `nearestFocusIndex` is sticky by 0.08 so the calculator's mode cannot oscillate at a boundary.

Measured on screen: a settled slide is completely sharp through ~260px of scroll at 1440×900 and ~290px at 390×844, in both directions, with the mode still switching once per boundary.

### Compare graph

Bars went from 44px to `min(72px, 58%)` on desktop and 28px to `min(48px, 52%)` on mobile — proportional, so they hold their weight across the drawer's whole `clamp(340px, 44vw, 640px)` range without the three columns meeting. Heights, tiers and the scaleY transition are unchanged.

The mobile sheet's control moved off the centre line to the sheet's top-right corner and shrank to 34×22px inside an unchanged 44×44 target. It stays outside the sheet's own box on purpose: the sheet travels its full height on close, so a control drawn inside it would leave the screen with it.

### Why Assetly and Sectors fit the viewport (DEC-032)

DEC-028 capped the grids against viewport height but left the standard section padding around them, so each section still stood ~965px in a 900px window. Both are now composed against the viewport: `min-height: 100svh`, contents centred in the space below the fixed nav, tighter heading rhythm, shorter cells, and a mobile Why Assetly card recomposed horizontally — letter beside the value name, as the mobile sector card already works.

Each section is now exactly one viewport tall at 1440×900, 1280×800, 1024×768, 430×932 and 390×844. At 375×667 Why Assetly is 819px and scrolls: four flip cards whose back copy is fixed cannot fit 667px, and `min-height` being a floor is what keeps that case correct rather than clipped.

### Three sector plates

Commercial Interiors, Construction and Healthcare were redrawn against Manufacturing and IT Infrastructure as the quality benchmark, in the same elevation-on-a-ground-line language: a fitted-out workplace bay, a tracked excavator beside a frame still going up, and a patient bed with an imaging gantry in place of a cross in a square. Hospitality was reviewed and left alone.

### The Bengaluru map is real (DEC-033)

The invented road network is replaced by OpenStreetMap geography for a 6 × 3.9 km window centred on the office's position on Brigade Road, projected, simplified and frozen into `content/plates/bengaluru-map.ts`. `ContactMap` draws it through the same `Plate` component in five weighted layers, so the city is recognisable while the page still ships no map SDK, no tile request and no API key. The ODbL credit sits beside the map and the marker links to the same coordinates on a real map.

The generated file must not be hand-edited — regenerate it instead.

### Contact drawer and mobile form (DEC-036)

The desktop drawer's "push and correct" was not its animation. `.mapShell` was `overflow: hidden`, which makes it a scroll container; the drawer starts parked outside it, and focusing a control inside the drawer made the browser scroll the shell to reach it, dragging the map, label and pin sideways and letting them drift back. It is now `overflow: clip`, which cannot be scrolled by anything, and the focus trap focuses with `preventScroll: true` on entry and on restoration. Separately, locking body scroll removed the scrollbar and widened the layout viewport, jogging every fixed and centred element; the document now reserves its gutter permanently.

Two places had been relying on that width not changing: `.slides` gave up 44% of its own width against a drawer set to 44vw, and both now read one `--compare-drawer-width`; the two full-bleed modals take `100vw` rather than the space inside the gutter.

The mobile sheet was recomposed so a step and its primary action are on screen together. At 390×844 all six fields of the longest step and its primary action are visible without scrolling.

## Decisions

- **DEC-031** — the Hero opening is document-scoped and holds after a continuous double blink.
- **DEC-032** — Why Assetly and Sectors are composed to resolve inside one viewport.
- **DEC-033** — the Contact map is real OpenStreetMap geography, baked to static paths (supersedes DEC-026).
- **DEC-034** — the Compare focus effect holds a locked band before it transitions.
- **DEC-035** — Slide 01's left half is the reference hero crane, mirrored.
- **DEC-036** — nothing that holds a parked panel may be a scroll container.

## Tests Run

Both lines passed their own full suites before the merge. The merged tree is being verified now; results replace this section when that run completes.

Measurement notes worth keeping:

- Playwright's `devices["Desktop Chrome"]` is **1280×720**, not 1280×800. The flip-card back faces clipped by 6–14px at 720 while passing at 800; card heights must be measured at the height the suite actually uses.
- `scrollbar-gutter: stable` changes layout width on any platform with classic scrollbars. Anything that mixes `vw` with `%` across that boundary is suspect.

## Issues / Blockers

1. `OD-14` — the rights-cleared About photograph and its factual alt text are still required before Phase 10 exits.
2. `OD-13` — no Compare disclaimer wording supplied; none invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — logo is raster, no favicon. The loader reuses the shipped glyph so it hands off without a shape swap.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 blocked.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.
8. The Contact marker sits on Brigade Road's own centreline, taken from OSM. The building itself is not in OpenStreetMap, so the pin is street-accurate rather than door-accurate; confirm with the owner whether that is close enough before launch.

## Next Recommended Task

Phase 9, beginning with `LEGAL-001`. Its wording decisions are owner work and must not be invented.

## Notes for Next Cycle

- Every spec that loads `/` now loads the opening sequence with it. Specs written before Phase 8.5 must wait past it.
- `content/plates/bengaluru-map.ts` is generated. To move the window or refresh the data, re-run an Overpass query for the bbox in its header; do not edit the numbers.
- The flip card cannot grow to fit its copy — both faces are absolutely positioned inside a cell of fixed height — so any type change in Why Assetly needs the back faces re-measured at 1280×720 and 375×667.
- `overflow: clip` rather than `hidden` for any box that hides something positioned outside it.
- Anything that must cover the whole window needs `100vw`, not `inset: 0`.
- The loader's target must continue to be measured from `[data-hero-mark-target]`; do not parse the `clamp()` token as a number.
