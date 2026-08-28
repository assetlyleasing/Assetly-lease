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

## Tests Run

- `npx tsc --noEmit` — clean.
- `npx eslint .` — clean before the final test-suite reduction; final changed-file lint is the push
  gate for this cycle.
- `npx vitest run --reporter=dot` — 124/124 passed.
- `npx playwright test --reporter=line` — 66 unaffected cases passed; three assertions in newly
  condensed tests were corrected (one stale selector, expected text casing and a matcher name).
- `npx playwright test tests/e2e/compare.spec.ts tests/e2e/hero-loader.spec.ts --workers=1` — 7/7
  passed after those corrections. Together, every one of the final 69 cases has passed.
- Focused admin regression — 5/5 passed.

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

Finish the remaining proportionate Phase 10 checks, record Lighthouse, then run Phase 11 staging and
production smoke verification. Do not expand the E2E matrix back into exhaustive visual specifications.
