# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

An owner-directed refinement pass over the shipped homepage: **complete** on `main`. Phases 0, 1, 2, 4, 5, 6, 7 and 8 remain complete. Phase 3 is still blocked on `OD-05`/`OD-06`.

Phase 8.5 (the Hero opening loader) was built in parallel and lives on `phase/hero-opening-loader` (`1a23b96`), not on `main`. It carries `DEC-031`; this cycle's decisions therefore start at `DEC-032`, so the two lines merge without renumbering.

## Current Task

None outstanding on `main`. The next unblocked work is merging `phase/hero-opening-loader`, then Phase 9.

## Status

Seven refinements were requested against the live site after a visual review. All seven are implemented, measured on screen at six viewport sizes, and covered by the existing suites.

## Completed This Cycle

### 1. Slide 01's plate (DEC-035)

The left half was redrawn from the canonical reference rather than invented: the wheeled crane in `reference/home-2.html`'s hero plate, mirrored about its own bounding box so the boom hangs outward, scaled 0.2 onto the plate's ground line. The right half — the floored block and the rayed circle — is untouched reference geometry. The transform is recorded in the file (`x' = 127.4 - 0.2x`, `y' = 62.8 + 0.2y`) so the drawing can be re-derived instead of guessed at.

### 2. A locked focus band on the four arguments (DEC-034)

The focus effect was continuously derived from distance-to-centre, so "at rest" was one pixel and any movement blurred the copy the reader was reading — worst on a phone, where a thumb never stops on an exact pixel. `focusAppearance` now holds the resting state across a band (0.26 viewport heights desktop, 0.34 mobile), then runs the same fade/blur/shift to full effect by 0.86, and `nearestFocusIndex` is sticky by 0.08 so the calculator's mode cannot oscillate at a boundary.

Measured on screen: a settled slide is completely sharp through ~260px of scroll at 1440×900 and ~290px at 390×844, in both directions, with the mode still switching once per boundary.

### 3. Compare graph

Bars went from 44px to `min(72px, 58%)` on desktop and 28px to `min(48px, 52%)` on mobile — proportional, so they hold their weight across the drawer's whole `clamp(340px, 44vw, 640px)` range without the three columns meeting. Heights, tiers and the scaleY transition are unchanged.

The mobile sheet's control moved off the centre line to the sheet's top-right corner and shrank to 34×22px inside an unchanged 44×44 target. It stays outside the sheet's own box on purpose: the sheet travels its full height on close, so a control drawn inside it would leave the screen with it.

### 4. Why Assetly and Sectors fit the viewport (DEC-032)

DEC-028 capped the grids against viewport height but left the standard section padding around them, so each section still stood ~965px in a 900px window. Both are now composed against the viewport: `min-height: 100svh`, contents centred in the space below the fixed nav, tighter heading rhythm, shorter cells, and a mobile Why Assetly card recomposed horizontally — letter beside the value name, as the mobile sector card already works.

Each section is now exactly one viewport tall at 1440×900, 1280×800, 1024×768, 430×932 and 390×844. At 375×667 Why Assetly is 819px and scrolls: four flip cards whose back copy is fixed cannot fit 667px, and `min-height` being a floor is what keeps that case correct rather than clipped.

### 5. Three sector plates

Commercial Interiors, Construction and Healthcare were redrawn against Manufacturing and IT Infrastructure as the quality benchmark, in the same elevation-on-a-ground-line language:

- **Commercial Interiors** — desk, monitor, task chair and a glazed partition under a ceiling light, instead of nested rectangles that could have been a floor plan or a kitchen.
- **Construction** — a tracked excavator beside a frame still going up, with column stubs above the slab. Deliberately not a crane: Slide 01's plate is now a wheeled crane, and the two should not read as the same drawing twice.
- **Healthcare** — a wheeled patient bed under a vitals monitor, and an imaging gantry with its table run out. The plain cross in a square is gone; it was the one piece of clip-art vocabulary in the set.

Hospitality was reviewed and left alone — bed, side table and lamp already read.

### 6. The Bengaluru map is real (DEC-033)

The invented road network is replaced by OpenStreetMap geography for a 6 × 3.9 km window centred on the office's position on Brigade Road, projected, simplified and frozen into `content/plates/bengaluru-map.ts`. `ContactMap` draws it through the same `Plate` component in five weighted layers, so Cubbon Park, the arteries off it and the tanks to the east are recognisable while the page still ships no map SDK, no tile request and no API key. The ODbL credit sits beside the map and the marker links to the same coordinates on a real map.

The generated file must not be hand-edited — regenerate it instead.

### 7. Contact drawer and mobile form (DEC-036)

The desktop drawer's "push and correct" was not its animation. `.mapShell` was `overflow: hidden`, which makes it a scroll container; the drawer starts parked outside it, and focusing a control inside the drawer made the browser scroll the shell to reach it, dragging the map, label and pin sideways and letting them drift back. It is now `overflow: clip`, which cannot be scrolled by anything, and the focus trap focuses with `preventScroll: true` on entry and on restoration. Separately, locking body scroll removed the scrollbar and widened the layout viewport, jogging every fixed and centred element; the document now reserves its gutter permanently.

Frame-by-frame, the drawer travels from the shell's right edge to its resting position with the map stationary throughout.

The mobile sheet was recomposed so a step and its primary action are on screen together: smaller heading, tighter flow and field gaps, inputs still a full 44px. At 390×844 all six fields of the longest step and "Open in Gmail →" are visible without scrolling; at 375×667 a short scroll remains, which §16 allows.

### Two consequences of the reserved gutter, both fixed

- `.slides` gave up 44% of its own width against a drawer set to 44vw. Those agreed only while they measured the same thing; they stopped agreeing the moment the gutter existed. Both now read one `--compare-drawer-width`.
- A fixed overlay laid out inside the initial containing block stops 15px short of the window edge. The mobile nav overlay and the contact sheet layer — the two full-bleed modals — now take `100vw`.

## Decisions

- **DEC-032** — Why Assetly and Sectors are composed to resolve inside one viewport.
- **DEC-033** — the Contact map is real OpenStreetMap geography, baked to static paths (supersedes DEC-026).
- **DEC-034** — the Compare focus effect holds a locked band before it transitions.
- **DEC-035** — Slide 01's left half is the reference hero crane, mirrored.
- **DEC-036** — nothing that holds a parked panel may be a scroll container.

`SOURCE_OF_TRUTH.md` §13 (plate note, focus effect) and §16 (map artwork) are amended to match.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test` | Pass — 102/102 |
| `npx playwright test --workers=1` | Pass — see note below |
| `npm run build` | Pass |
| Visual review | 1440×900, 1280×800, 1024×768, 430×932, 390×844, 375×667 — Compare 01–04, Why Assetly, Sectors, Contact, both contact panels |

New coverage: the locked band holds its resting appearance across the whole band and in both directions, begins only past it, still reaches full effect a screen away, locks harder on mobile, and rises without a step at the edge; the focused index holds until a rival is clearly closer and ignores an unmeasurable current index. The graph test now asserts the heavier bar with the same anti-collision guard.

Measurement notes worth keeping:

- Playwright's `devices["Desktop Chrome"]` is **1280×720**, not 1280×800. The flip-card back faces clipped by 6–14px at 720 while passing at 800; card heights must be measured at the height the suite actually uses.
- `scrollbar-gutter: stable` changes layout width on any platform with classic scrollbars, which is why the two regressions above surfaced only as test failures. Anything that mixes `vw` with `%` across that boundary is suspect.

## Issues / Blockers

1. `OD-14` — the rights-cleared About photograph and its factual alt text are still required before Phase 10 exits.
2. `OD-13` — no Compare disclaimer wording supplied; none invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — logo is raster, no favicon.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 blocked.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.
8. The marker sits on Brigade Road's own centreline, taken from OSM. The building itself is not in OpenStreetMap, so the pin is street-accurate rather than door-accurate; confirm with the owner whether that is close enough before launch.

## Next Recommended Task

Merge `phase/hero-opening-loader` into `main`, re-running the full suite after the merge — the loader changes the homepage's first five seconds, and every spec here now loads a page without it. Then Phase 9.

## Notes for Next Cycle

- `content/plates/bengaluru-map.ts` is generated. To move the window or refresh the data, re-run an Overpass query for the bbox in its header and regenerate; do not edit the numbers.
- The flip card cannot grow to fit its copy — both faces are absolutely positioned inside a cell of fixed height — so any type change in Why Assetly needs the back faces re-measured at 1280×720 and 375×667.
- `overflow: clip` rather than `hidden` for any box that hides something positioned outside it.
- Anything that must cover the whole window needs `100vw`, not `inset: 0`.
