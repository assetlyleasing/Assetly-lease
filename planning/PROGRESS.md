# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 5 — Why Us: **complete**. Phases 0, 1, 2 and 4 are complete; Phase 4 also has its approved plate and qualitative-graph correction. Phase 3 remains blocked on `OD-05`/`OD-06`. Phase 6 is unblocked.

## Current Task

`SECTOR-001` — build the locked six-sector content model for Phase 6. Plate production remains tied to `OD-04` at `SECTOR-002`.

## Status

The homepage now renders the shared shell, Hero, corrected Compare sequence, and the completed Why Assetly section. Green at this boundary: lint, typecheck, production build, 71 unit tests, 86 Chromium Playwright tests, and 8 targeted WebKit Why Assetly tests.

## Completed This Cycle

### Phase 5 — Why Assetly

- Added the exact approved T/F/S/P value names and explanations in a typed `WhyUsValue` content model.
- Replaced the homepage placeholder with a connected 2×2 ledger grid that recomposes to one column at 640px and below.
- Built each card as an independent native button. Click, tap, Enter, and Space flip; multiple cards can remain open; hover only strengthens contrast and moves the cue by 1–2px.
- Locked both absolutely positioned faces to one shared card-shell minimum height. Desktop and mobile bounding boxes remain unchanged before and after a flip.
- Added the standard `RevealOnScroll` entrance and four-cell `rv-u` / `rv-d1..3` stagger without any automatic flip.
- Added the 900ms 3D flip with proper perspective and hidden backfaces. Reduced motion removes the 3D transform and uses the standard short opacity swap.
- Added Chromium coverage to the full suite and a targeted WebKit project for the complete Why Assetly interaction suite.

### Accessibility decision

- **DEC-024** records the active-face-only approach. The visual 3D faces are outside the accessibility tree; the button's value name and `aria-pressed` state remain available. The explanation is mounted as a polite button description only while flipped, then removed on return.
- This was chosen so assistive-technology users receive the same state-dependent explanation without hearing both faces or hidden back copy before activation.

### Visual review

- Reviewed rendered 1440×900 desktop front and mixed-flip states plus the complete 390×844 mobile column.
- Increased the shared mobile card minimum height after the first preview placed the longest explanation's return cue too close to the clipped edge. The final preview keeps the copy and cue fully visible without changing height during activation.
- Reconfirmed the project-owner-requested thicker Compare graph fills: uniform 44px desktop and 28px mobile.

## Decisions

- **DEC-021** — archive both prototype HTML files under `reference/`.
- **DEC-022** — approve the compact prototype-derived Compare plate set and resolve `OD-03`.
- **DEC-023** — use qualitative Compare tier bars while retaining the ban on prototype calculator math and value input.
- **DEC-024** — expose only the active Why Assetly face to screen readers.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test` | Pass — 71/71 |
| `npx playwright test --workers=2` | Pass — 94/94 (86 Chromium + 8 targeted WebKit) |
| Compare RAF profile | Pass inside the full suite — p95 below 60ms and worst frame below 200ms in the guarded development-build profile |
| `npm run build` | Pass — all routes statically generated |
| Visual preview | Pass — desktop front/mixed states and complete 390×844 mobile grid |

The Phase 5 suite guards exact copy, independent and simultaneous flips, native keyboard behavior, hover never flipping, active-face descriptions, fixed card and section boxes, mobile one-column composition, overflow, and reduced-motion behavior in both engines.

## Issues / Blockers

1. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
2. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
3. `OD-01` — the logo is raster, no favicon exists, and Phase 8.5 still needs the loader letterform confirmed.
4. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
5. `OD-04` — Phase 6 sector plate artwork still needs sourcing or approval before `SECTOR-002` can close.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` still reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Start Phase 6 with `SECTOR-001`: implement the locked six-sector pool and approved short descriptors without inventing facts. Then resolve `OD-04` before authoring the six sector plates in `SECTOR-002`.

## Notes for Next Cycle

- Run `npm run build` once before `npm run typecheck` on a clean checkout so Next.js route types exist.
- Stop any existing `next dev` before Playwright starts its own server.
- Use `page.emulateMedia({ reducedMotion: "reduce" })`; the fixture option does not reach the page here.
- Reuse the existing plate, reveal, typography, responsive, and shared-motion primitives.
- Anything clearing the fixed nav uses `--nav-block`, not `--nav-h`.
- Keep UI completion dependent on desktop and mobile browser inspection; the mobile card-height adjustment was visible before it was a test failure.
