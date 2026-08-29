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
- `DEC-065` — the browser suite is tiered, and runs in parallel.
- `DEC-066` — plate mechanisms de-synchronised; the hub keyway signals load transfer.
- `DEC-067` — the admin is a workspace holding sections, not the Trusted By page.

## Tests Run

- `npx tsc --noEmit` — clean.
- `npx eslint tests/e2e playwright.config.ts` — clean.
- `npx vitest run --reporter=dot` — 124/124 passed.
- `npm run build` — production build completed successfully.
- Lighthouse production mobile audits — scores recorded above.
- `npm run test:e2e` — 65/65 passed, three consecutive parallel runs (4.5m, 4.0m, 3.8m), against the
  same warm dev server. This is what withdrew the project-wide `--workers=1` rule: it existed for
  false failures on the WebKit mobile sheet, and WebKit went with DEC-063.
- `npm run test:e2e:fast` — 22/22 passed in 1.5m warm, 2.5m from a cold server.
- `npm run test:e2e:motion` — 12/12 passed, serial.
- Admin refinement branch, before the tiering merged into it — 69/69 browser cases and 124/124 unit
  tests passed.
- The plate work (keyway, draw tone, loop periods) was type-checked and linted only. Plate motion is
  reviewed by owner preview on a running dev server, not by test output — `HERO_PLATE_MOTION.md` §1.

The full suite was about 22.5 minutes before this cycle. The cost was overhead, not test count:
serial execution, and the ~4.8s opening sequence paid on every one of the 50 loads of `/`.

## Issues / Blockers

1. `OD-13` — Compare disclaimer wording has not been supplied; none has been invented.
2. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
3. `OD-01` — no vector logo/wordmark lockup exists; the approved raster-derived favicon remains.
4. `npm audit` still reports moderate advisories through `firebase-admin`; the Admin SDK is currently
   unused by the application and its private credential is not required in Vercel.
5. The Contact marker follows Brigade Road's centreline rather than an exact building coordinate.

## Next Recommended Task

Owner preview of the three plate changes and the admin workspace, neither of which has been seen yet:
the crane keyway's load signal and the front-loaded draw tone are judged by eye, and the admin
dashboard sits behind a real Firebase sign-in that no automated test can reach.

After that, select the next owner-directed product item. The office fit-out and the dev/prod
plate-draw discrepancy are both dropped at the owner's instruction. Do not expand the E2E matrix
unless a future feature introduces a genuinely new critical journey; when it does, tag it into the
tier it belongs in rather than letting the everyday gate grow.
