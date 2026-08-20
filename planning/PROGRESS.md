# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 7 — Contact: **complete**. Phases 0, 1, 2, 4, 5, 6 and 7 are complete. Phase 3 remains blocked on `OD-05`/`OD-06`. Phase 8 is blocked on the real-image requirement in `OD-14` and must not begin partially.

## Current Task

`ABOUT-000` — obtain the real, usage-approved landscape About image and its factual alt description required by `OD-14` before any Phase 8 implementation begins.

## Status

The homepage now renders the shared shell, Hero, corrected Compare sequence, Why Assetly, rotating Sectors grid, and complete Contact enquiry experience. Green at this boundary: lint, typecheck, production build, 87 unit tests, 104 Chromium Playwright tests, and 26 targeted WebKit interaction tests.

## Completed This Cycle

### Phase 7 — Contact

- Added the approved CONTACT information block with linked email and phone plus Bengaluru only; the full postal address remains Footer-only.
- Authored an illustrative, non-cartographic Bengaluru SVG with muted linework, one Assetly marker, and a BENGALURU label using the shared `Plate` and draw-on-enter behavior.
- Added the typed enquiry model and Zod discriminated union for Operating Lease, Asset Requirement, Existing Requirement, General Enquiry, and a custom type, including all approved required/optional fields and length limits.
- Built a stable two-step enquiry flow with associated validation errors, first-invalid-field focus, Back and Close actions, and preserved local form state across close/reopen.
- Built the desktop map-edge drawer and structurally separate mobile bottom sheet at 700px. The sheet has a visual grip and explicit Close action without an unrequested drag gesture.
- Factored focus trapping, Escape close, focus return, and body scroll lock into one shared hook, then migrated the mobile menu and reused the behavior for both Contact dialogs without changing the menu presentation.
- Added one pure email-draft builder. Gmail and mailto actions share the same recipient, subject, and body; blank optional lines are omitted, visitor input is encoded, and nothing is submitted to or stored by Assetly.
- Reduced motion completes the map immediately and removes spatial panel and field transitions.
- Expanded the targeted WebKit project to cover Contact alongside Why Assetly and Sectors.

### Decisions and planning

- **DEC-026** approves the illustrative code-authored Bengaluru plate and resolves/removes `OD-08`.
- Phase 7 execution items are complete. Phase 8 remains explicitly gated by `OD-14`; no About implementation or partial Phase 8 commit was created.

### Visual review

- Reviewed rendered 1440×900 desktop closed/drawer states and 390×844 mobile closed/sheet states from a running preview server.
- Tightened desktop drawer spacing after the first preview exposed a partly clipped Continue action; the complete first step now fits while longer detail forms retain internal scrolling.
- Confirmed the map-edge composition, partially visible map, mobile sheet, grip and close control, typography, shared borders, and responsive overflow on screen.

## Decisions

- **DEC-024** — expose only the active Why Assetly face to screen readers.
- **DEC-025** — author the six sector plates inline and stop rotation entirely under reduced motion.
- **DEC-026** — use a non-cartographic code-authored Bengaluru plate without external map data or tracking.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test -- --maxWorkers=1` | Pass — 87/87 |
| `npx playwright test --workers=1` | Pass — 130/130 (104 Chromium + 26 targeted WebKit) |
| Compare RAF profile | Pass inside the serial full suite |
| `npm run build` | Pass — all routes statically generated |
| Visual preview | Pass — desktop Contact/map drawer and 390×844 Contact/mobile sheet |

The Phase 7 suite guards every Zod branch and boundary, deterministic draft text, special-character encoding, identical Gmail/mailto payloads, absence of persistence, every enquiry type plus custom, conditional fields, validation and focus behavior, Back/close/reopen preservation, Escape/focus return/trap, desktop drawer, mobile sheet, protected external links, reduced motion, and exclusion of the full address.

## Issues / Blockers

1. `OD-14` — Phase 8 cannot begin until a real, rights-cleared About image at least 1600px wide and its factual alt description are supplied.
2. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — the logo is raster, no favicon exists, and Phase 8.5 still needs the loader letterform confirmed.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Supply the `OD-14` About asset: a genuine Assetly-relevant landscape WebP, JPEG, or AVIF at least 1600px wide, with confirmed usage rights and a factual alt description. Once supplied, implement and commit Phase 8 as one complete boundary. Do not use stock, generated, logo-based, or abstract artwork as a substitute.

## Notes for Next Cycle

- Do not start Phase 8 or create a partial phase commit while `OD-14` remains unresolved.
- After the asset is supplied, render it with `next/image`, intrinsic dimensions, responsive `sizes`, and the supplied factual alt text.
- Reuse the public Nav/Footer, clear the fixed nav with `--nav-block`, and verify homepage anchors in both directions from `/about`.
- Phase 3 remains separately blocked on Firebase project and admin-auth decisions.
- `OD-13` remains open; no Compare disclaimer wording may be invented.
