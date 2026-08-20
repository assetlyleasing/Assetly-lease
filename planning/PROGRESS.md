# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 6 — Sectors: **complete**. Phases 0, 1, 2, 4, 5 and 6 are complete. Phase 3 remains blocked on `OD-05`/`OD-06`; Phase 7 is unblocked. Phase 8 is now explicitly blocked on the real-image requirement in `OD-14`.

## Current Task

`CONTACT-001` — build the approved static Contact information block, followed by the code-authored Bengaluru visual and enquiry experience.

## Status

The homepage now renders the shared shell, Hero, corrected Compare sequence, Why Assetly, and the complete auto-rotating Sectors section. Green at this boundary: lint, typecheck, production build, 78 unit tests, 93 Chromium Playwright tests, and 15 targeted WebKit interaction tests.

## Completed This Cycle

### Phase 6 — Sectors We Serve

- Added the locked six-sector pool with typed IDs, fixed `01–06` indices, approved short descriptors, and typed plate references.
- Authored six distinct 200×130 inline plates for commercial interiors, manufacturing, construction, hospitality, healthcare, and IT infrastructure using the unchanged shared `Plate` primitive.
- Built the connected 2×2 desktop / 1×4 mobile ledger grid with four sectors visible, equal desktop row heights, and compact mobile cards without long descriptors.
- Added a pure cyclic rotation model and one timer owner. Rotation begins after the entrance settles, changes one slot every 2.5 seconds, completes the 450ms exit before replacement, and remounts only entering artwork for its 2.6-second draw.
- Rotation pauses before another swap while the grid is hovered or focused and while the document is hidden. An in-progress swap is allowed to finish.
- The grid is one keyboard focus target with a visible focus state and `aria-live="off"`; passive cards do not become four extra tab stops.
- Reduced motion renders sectors 01–04 and fully drawn plates without creating the rotation timer.

### Decisions and planning

- **DEC-025** approves the six code-authored plates and the completely static reduced-motion state, resolving `OD-04`.
- Added **OD-14** for Phase 8: a real, usage-approved landscape About image at least 1600px wide plus factual alt text. No substitute visual is authorized and no partial Phase 8 implementation may begin without it.

### Visual review

- Reviewed rendered 1440×900 desktop and 390×844 mobile Sectors states after rotation.
- Corrected unequal desktop row sizing exposed by the longer IT title by locking both implicit grid rows to one shared fraction.
- Confirmed the shared-border grid, thin drafting plates, mobile composition, and completed reduced-motion plates on screen.

## Decisions

- **DEC-023** — use qualitative Compare tier bars while retaining the ban on prototype calculator math and value input.
- **DEC-024** — expose only the active Why Assetly face to screen readers.
- **DEC-025** — author the six sector plates inline and stop rotation entirely under reduced motion.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test -- --maxWorkers=1` | Pass — 78/78 |
| `npx playwright test --workers=1` | Pass — 108/108 (93 Chromium + 15 targeted WebKit) |
| Compare RAF profile | Pass inside the serial full suite; an earlier concurrent run produced one 207.6ms outlier while p95 stayed within guard, and the isolated plus serial reruns passed |
| `npm run build` | Pass — all routes statically generated |
| Visual preview | Pass — desktop rotated state and complete 390×844 mobile grid |

The Phase 6 suite guards exact copy, six unique geometries, deterministic one-slot rotation, timer suppression and cleanup, hover/focus pause, entering plate draw, equal layout, responsive composition, overflow, no live announcements, and static reduced motion in Chromium and WebKit.

## Issues / Blockers

1. `OD-08` — Phase 7 still needs the approved illustrative Bengaluru map produced; the implementation plan authorizes a non-cartographic code-native SVG.
2. `OD-14` — Phase 8 cannot begin until a real, rights-cleared About image and factual alt description are supplied.
3. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
4. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
5. `OD-01` — the logo is raster, no favicon exists, and Phase 8.5 still needs the loader letterform confirmed.
6. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
7. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
8. `npm audit` still reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Complete Phase 7 in order: static Contact information, code-authored Bengaluru map, typed enquiry model and Zod validation, shared modal focus management, desktop drawer/mobile sheet, deterministic Gmail/mailto draft generation, then full interaction and visual verification.

## Notes for Next Cycle

- Install `zod` as the only new Phase 7 runtime dependency and commit both package files with the phase.
- Preserve partially entered Contact data when the panel closes; nothing is sent or persisted by Assetly.
- Use separate desktop drawer and mobile sheet structures selected through `useMediaQuery`; do not add a drag gesture.
- Stop any preview server before Playwright starts its own server and use `page.emulateMedia({ reducedMotion: "reduce" })`.
- Reuse `Plate`, `useDrawOnEnter`, shared primitives, `.sr-only`, and the existing focus/scroll-lock behavior.
- Anything clearing the fixed nav uses `--nav-block`, not `--nav-h`.
