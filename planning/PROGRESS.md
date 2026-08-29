# PROGRESS

This file reflects the current state of the project, not a chronological log.

---

## Current Phase

Phases 0–11 are complete. The owner-approved admin redesign is live, `OD-07` is resolved, and the
proportionate QA/accessibility/performance pass is recorded. Firebase, Vercel, the production domain,
rules, current deployment and production smoke verification are complete.

## Current Task

No release task remains. Select the next owner-directed product item; the office fit-out item was
explicitly skipped by the owner and must not be reopened without a new request.

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

### Phase 10 and release verification

- `npm run build` completed successfully, including TypeScript and all 12 static routes.
- Production returned HTTP 200 for `/`, `/about`, `/admin`, `/admin/login`, `/privacy`, `/terms`,
  `/robots.txt` and `/sitemap.xml`; robots and sitemap retain the intended admin exclusions.
- Lighthouse 12.8.2 mobile audits on the current production alias recorded:
  - `/`: Performance 67, Accessibility 96, Best Practices 100, SEO 100; CLS 0.
  - `/about`: Performance 70, Accessibility 100, Best Practices 100, SEO 100; CLS 0.
- The current `main` deployment was rebuilt without Vercel's build cache and promoted to
  `assetly.lease`. Hydrated production smoke confirmed the branded admin login, compiled Firebase
  configuration, public routes, About heading and Contact drawer/focus behavior. Trusted By currently
  resolves to its intentional hidden state because Firebase supplies no enabled logo set.

## Decisions

- `DEC-062` — admin is a branded private workspace, not a generic dashboard.
- `DEC-063` — browser E2E coverage stays proportional to the two-page product.
- `DEC-064` — Vercel hosts preview/production; Firebase remains the application backend.

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
- `npm run build` — production build completed successfully.
- Lighthouse production mobile audits — scores recorded above; no additional E2E suite was run.

## Issues / Blockers

1. `OD-13` — Compare disclaimer wording has not been supplied; none has been invented.
2. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
3. `OD-01` — no vector logo/wordmark lockup exists; the approved raster-derived favicon remains.
4. `npm audit` still reports moderate advisories through `firebase-admin`; the Admin SDK is currently
   unused by the application and its private credential is not required in Vercel.
5. The Contact marker follows Brigade Road's centreline rather than an exact building coordinate.

## Next Recommended Task

Select the next owner-directed product item. Keep the office fit-out skipped and do not expand the E2E
matrix unless a future feature introduces a genuinely new critical journey.
