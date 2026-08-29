# PROGRESS

This file reflects the current state of the project, not a chronological log.

---

## Current Phase

Phases 0–9 are complete. The owner-approved admin redesign is complete and `OD-07` is resolved.
Phase 10 remains in progress: `QA-000` and the newly proportioned `QA-010` browser journey gate are
complete; the remaining formal accessibility/performance audits and Lighthouse recording are still
open. Phase 11 deployment verification follows Phase 10.

## Current Task

Commit and push the branded admin redesign and lean regression suite to both GitHub remotes, then
continue the remaining Phase 10 checklist.

## Completed This Cycle

### Branded admin workspace (`DEC-062`)

- Redesigned `/admin/login` as a responsive split brand/authentication composition using only the
  approved Assetly palette, typography and ledger-line vocabulary.
- Redesigned authenticated `/admin` with a Pitch account bar, editorial Trusted By introduction,
  numbered publishing/content panels, explicit published/hidden states, a structured upload form and
  a professional partner library/empty state.
- Preserved the deliberately narrow Trusted By feature boundary and all existing Firebase Auth,
  Firestore and Storage behavior; no API or schema changes.
- Added form error associations, logical keyboard order, visible focus assertions, mobile overflow
  checks and 44px control checks.
- Previewed login and dashboard at 1440×900, 1024×768 and 390×844. The authenticated dashboard was
  rendered through a temporary local-only preview route that was removed immediately afterward.

### Proportionate browser regression (`DEC-063`)

- Reduced Playwright from 176 executions to 69 (61% smaller), per owner direction.
- Removed repeated nearby viewport cases, animation micro-timing specifications, overlapping visual
  assertions and the duplicate WebKit matrix.
- Retained one Chromium critical path per feature plus route/auth smoke, keyboard/focus, three
  representative widths, mobile containment, reduced motion, Contact draft generation and Firebase's
  public empty state.
- Kept all 124 Vitest cases for detailed state, validation and calculation logic.

## Decisions

- `DEC-062` — admin is a branded private workspace, not a generic dashboard.
- `DEC-063` — browser E2E coverage stays proportional to the two-page product.
- `DEC-065` — the browser suite is tiered, and runs in parallel.

## Tests Run

- `npx tsc --noEmit` — clean.
- `npx eslint tests/e2e playwright.config.ts` — clean.
- `npx vitest run --reporter=dot` — 124/124 passed.
- `npm run test:e2e` — 65/65 passed, three consecutive parallel runs (4.5m, 4.0m, 3.8m), against the
  same warm dev server. This is what withdrew the project-wide `--workers=1` rule: it existed for
  false failures on the WebKit mobile sheet, and WebKit went with DEC-063.
- `npm run test:e2e:fast` — 22/22 passed in 1.5m warm, 2.5m from a cold server.
- `npm run test:e2e:motion` — 12/12 passed, serial.

The full suite was about 22.5 minutes before this cycle. The cost was overhead, not test count:
serial execution, and the ~4.8s opening sequence paid on every one of the 50 loads of `/`.

## Issues / Blockers

1. `OD-13` — Compare disclaimer wording has not been supplied; none has been invented.
2. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
3. `OD-01` — no vector logo/wordmark lockup exists; the approved raster-derived favicon remains.
4. `npm audit` still reports moderate advisories through `firebase-admin`; the Admin SDK is currently
   unused by the application and its private credential is not required in Vercel.
5. The Contact marker follows Brigade Road's centreline rather than an exact building coordinate.
6. Phase 10's remaining manual/accessibility/performance/Lighthouse tasks and Phase 11's deployment
   smoke checks remain open.

## Next Recommended Task

The Hero plate's remaining motion work, in the owner's order: the crane hub keyway's tone bump at
payload drop and pickup, the plate draw tone (`plateDrawTone` currently reads as a uniform wash), and
the de-synchronisation of two loop pairs that share an exact 2:1 period ratio — `siteSpin` against
`buildingLift` (7.9s/15.8s) and `plateJourney` against node 1's `nodeBreathe` (9s/18s). Then the
admin UI/UX refinement: `app/admin/page.tsx` makes "Trusted By" the workspace's own `<h1>` at up to
126px, which is why the admin does not read as holding more than one managed section.

Phase 10's remaining checks and Phase 11's smoke verification are running in a separate session. Do
not expand the E2E matrix back into exhaustive visual specifications.
