# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 3 (Trusted By infrastructure) is **complete and exited** — the full admin→public loop was
verified end-to-end against the live project by the owner: signed in, toggled Trusted By on, uploaded a
logo, and confirmed it renders in the public marquee. Phases 0–3, 4, 5, 6, 7, 8, 8.5, and 9 are all
done. This session ran on a separate, parallel track from the Hero plate animation work (explicitly out
of scope) — no Hero/hero-plate/motion files were touched.

## Current Task

None outstanding from Phase 3. Next up is Phase 10 (Accessibility, performance, QA) — see Next
Recommended Task. The owner's requested favicon is also done this cycle (`DEC-058`) — see Completed
This Cycle.

### How the last Phase 3 bug was found and fixed

The owner's manual pass surfaced a real bug, not an untested edge case: `subscribeActiveTrustedLogos`'s
query (`where("active","==",true)` combined with `orderBy("sortOrder","asc")`) needs a Firestore
composite index that doesn't exist automatically, so every public read of it failed with
`failed-precondition` — caught by the deliberate silent-failure handling (§12/§18/§21), which made a
missing index look identical to "no data" with nothing surfaced anywhere. Diagnosed directly against
the live project with a small Node script that reproduced the exact query and surfaced Firestore's own
index-creation link; the owner created it via the Firebase console (one click, then a short build wait
— confirmed finished by re-running the same diagnostic script, which returned the uploaded logo).
`firestore.indexes.json` is added to the repo so future environments provision this index automatically
via `firebase deploy --only firestore:indexes` rather than relying on someone hitting the same failure.
See `docs/plot.md`'s load-bearing conventions for the general lesson (any `where` + `orderBy` on
different fields needs a composite index, and this failure mode is silent by design here).

## Status

This cycle picked up the outstanding threads listed in the task brief, in order:

1. **OD-06 resolved** — admin auth method is Email/Password (`DEC-057`), confirmed directly by the
   owner. The single admin account already exists in the Firebase console from prior deployment setup.
2. **Deployment runbook steps 3–4** — the owner has completed Vercel project setup and the
   `assetly.lease` domain connection themselves, outside this environment; `DEPLOYMENT_RUNBOOK.md` is
   updated to record that rather than leaving them open. Step 2 (push to the `fresh` remote) was also
   already done — `fresh/main` matches `origin/main` at the Phase 9 commit.
3. **OD-05 re-confirmed resolved** — `.env.local` holds all ten real Firebase values (verified present
   without printing them) and is confirmed gitignored.
4. **Phase 3 (Trusted By) built in full** — see Completed This Cycle. This was the main body of the
   cycle's work once 1–3 unblocked it.
5. **Firebase security rules deployed** — `firestore.rules`/`storage.rules` were finalized in code and
   the owner pasted both into the Firebase console's Rules tabs directly (their preferred path over a
   CLI OAuth device-code relay) and published them. Confirmed live.
6. **Three pre-existing, unrelated broken Playwright tests found and fixed** while running the full
   suite for regression coverage — see Completed This Cycle. None were caused by this cycle's own
   changes; two were stale leftovers from Phase 9 wiring the legal links and the SEO title, and one
   was already-known flakiness in the hero-loader timing test (confirmed by a clean re-run).

## Completed This Cycle

### Phase 3 — Trusted By infrastructure

**Firebase layer**
- `lib/firebase/auth.ts` — new. `subscribeToAdminAuth`, `signInAdmin`, `signOutAdmin`. DEC-057: one
  authorized admin account, created directly in the Firebase console, no self-registration anywhere in
  the code — being signed in to the configured project *is* being the admin.
- `lib/firebase/firestore.ts` — new. Typed `siteSections/trustedBy` / `trustedLogos/{logoId}`
  accessors exactly per §18: live `onSnapshot` subscriptions (not one-shot reads, since the point of
  Firestore-backing this section is redeploy-free updates) that degrade to `null`/`[]` on any failure
  rather than throwing, per §12/§18/§21's silent-failure requirement.
- `lib/firebase/storage.ts` — new. Upload writes to `trusted-logos/{uuid}.{ext}`; delete resolves the
  Storage object straight from the stored `imageUrl` (`ref(storage, url)` accepts a download URL), so
  Firestore's schema stays exactly what §18 specifies — no extra storage-path field.
- `lib/trustedBy/reorder.ts` — new. Pure `moveLogo`/`withSequentialSortOrder` helpers, kept free of
  Firestore so `LogoManager`'s reorder logic is unit-testable without a mocked SDK.
- `lib/validation/logoUpload.ts` — new. Zod schema for name/alt/file (SVG/PNG/WebP, ≤2MB), following
  the same pattern as `lib/validation/contactForm.ts`.
- `firestore.rules` / `storage.rules` — finalized from the Phase 0 deny-all skeleton to the real rules:
  public read of `siteSections/trustedBy`; `trustedLogos` readable publicly where `active == true` or
  by any signed-in admin (the manager panel needs to see disabled logos too); all writes require
  `request.auth != null`. Storage additionally checks size (≤2MB) and content-type server-side, not
  just on the client. **Deployed to the live project** via the Firebase console (see Status).

**Admin panel** (`/admin`, `/admin/login`)
- `components/admin/AdminGate.tsx` — client-side auth gate wrapping every `/admin` route via
  `app/admin/layout.tsx`. Unauthenticated → redirect to `/admin/login`; signed-in visitor landing on
  `/admin/login` → redirect to `/admin`. Exposes the current user through `useAdminUser()`.
  Verified end-to-end against the real Firebase project: a wrong-password sign-in attempt gets a real
  network round trip to Firebase Auth and the correct "Incorrect email or password." error.
- `components/admin/LoginForm.tsx`, `SignOutButton.tsx`, `SectionToggle.tsx`, `LogoUploadForm.tsx`,
  `LogoManager.tsx`, `Admin.module.css` — new. Deliberately small and utilitarian per §18/`OD-07`, not
  a themed product surface. Upload form auto-derives alt text from the name (editable, per §18) and
  previews the selected file before upload; manager supports enable/disable, move up/down (writing a
  fresh sequential `sortOrder` via one batched write), and delete-with-confirmation (Firestore doc +
  best-effort Storage file).
- `app/admin/layout.tsx`, `app/admin/login/page.tsx`, `app/admin/page.tsx` (rewritten) — wire the gate,
  login screen, and panel together. `noindex` metadata preserved on both routes.

**Public section**
- `components/trusted-by/TrustedBy.tsx`, `LogoMarquee.tsx`, `TrustedBy.module.css` — new. Renders
  `null` unless `enabled === true AND activeLogos.length > 0` (§12). Marquee duplicates the logo
  sequence for the seamless `translateX(0)→translateX(-50%)` loop (30–34s desktop, ~37s mobile per
  DEC-007's spirit) and additionally repeats the real collection to a minimum track length when there
  are too few logos to fill a wide viewport — only the genuine first pass is announced to screen
  readers, every repeat/duplicate is `aria-hidden`. Hover pauses the loop; individual logos brighten on
  hover. `prefers-reduced-motion` collapses to a static, horizontally-scrollable strip showing only the
  real pass (CSS-only, no JS branch).
- `app/(site)/page.tsx` — `<TrustedBy />` inserted between `<HeroOpening />` and `<CompareSection />`
  per §3's fixed order, always mounted (it hides itself) rather than conditionally rendered.

### Favicon (`DEC-058`)

`app/icon.png` (512×512) and `app/apple-icon.png` (180×180) — new, generated from
`public/brand/assetly-mark.png` via a one-off `sharp` script (not committed as a build step — the
mark's own alpha channel is masked onto a flat Ivory fill with `dest-in` compositing, then centred on a
Pitch square). Matches the opening loader's Ivory-on-Pitch treatment of the same glyph. Picked up
automatically by Next.js's file-convention metadata — confirmed both `<link rel="icon">` and
`<link rel="apple-touch-icon">` render correctly, no code changes needed elsewhere.

### Test suite fixes (found while validating Phase 3, not caused by it)

- `tests/e2e/hero.spec.ts` — the §21 "paints without waiting on any network fetch" test asserted zero
  Firebase/Firestore requests ever fire, with a comment noting "Firestore is Phase 3" — i.e. it
  anticipated needing an update once Phase 3 landed. Trusted By's subscription now legitimately starts
  as soon as the homepage mounts (§12 fetches early on purpose, to avoid a later layout shift), so the
  literal zero-requests assertion is now wrong on its own terms. Rewritten to prove the same thing
  structurally instead: the Hero headline is already present in the raw server-rendered HTML, before
  any client script — Firestore included — has had a chance to run at all. An intermediate
  request-ordering version was tried and rejected: Firestore's handshake can complete faster than a
  client-side "is the heading visible" check resolves, so ordering alone was still flaky.
- `tests/e2e/shell.spec.ts` — "legal labels are present but not yet linked (Phase 9)" asserted the
  Footer's Privacy/Terms text were *not* links, a pre-Phase-9 assumption that Phase 9 itself
  (`LEGAL-002`) invalidated by wiring them as real links to `/privacy`/`/terms`, without the test being
  updated at the time. Rewritten to assert the links now resolve to the correct routes.
- `tests/e2e/smoke.spec.ts` — the root-route title assertion still expected `"Assetly"`, unchanged
  since Phase 0, but Phase 9's SEO metadata work gave `/` the real title
  `"Assetly | Access. Scale. Grow."` without this test being updated. Fixed to match.
- `tests/e2e/hero-loader.spec.ts`'s "recedes, moves to the measured Hero destination, then reveals
  content" failed once under load in the first full-suite run and passed cleanly on immediate re-run —
  consistent with the known flakiness already recorded in this file before this cycle. No code change;
  not a regression from this cycle's work.

## Decisions

- **DEC-057** — admin auth method resolved: Email/Password, confirmed by the owner over the runbook's
  own default recommendation.
- **DEC-058** — the favicon is the raster brand mark, recoloured Ivory on a Pitch square, matching the
  opening loader's treatment of the same glyph.

## Tests Run

`npx tsc --noEmit` clean. `npm run lint` clean. `npm run build` clean — all ten routes generate,
including the two new `/admin` and `/admin/login` routes. `npm run test` (Vitest): 124 tests passing
across 14 files, including two new suites for this cycle (`tests/unit/logoUpload.test.ts`,
`tests/unit/trustedByReorder.test.ts`).

Full Playwright suite (Chromium project): **130/130 passing**, including two new specs
(`tests/e2e/admin.spec.ts`, `tests/e2e/trusted-by.spec.ts`) that exercise the real Firebase project —
the wrong-password rejection test is a genuine network round trip to Firebase Auth, not a mock. This
covers: the unauthenticated `/admin` → `/admin/login` redirect, the login form, a real auth failure,
and the public section's silent-failure/absent-when-empty behavior. WebKit and the responsive/a11y
sweeps were not re-run project-wide this cycle (no code in those sections' paths changed); Chromium is
the full regression baseline and it's green.

The authenticated admin loop (sign in with the real account → toggle Trusted By on → upload a logo →
see it appear in the public marquee) was verified manually by the owner against the live project, since
those credentials were never shared with and should not be shared with this session. That pass
surfaced the missing composite index bug (see Current Task), which is now fixed and confirmed — the
owner's uploaded "test" logo renders correctly, verified independently against the live project by
re-running the diagnostic query.

## Issues / Blockers

1. `OD-14` — the rights-cleared About photograph and its factual alt text are still required before
   Phase 10 exits.
2. `OD-13` — no Compare disclaimer wording supplied; none invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — no vector logo/wordmark lockup exists yet. A raster-derived favicon now ships (`DEC-058`)
   using the existing brand mark, but the underlying vector-lockup question stays open — regenerate the
   favicon from the real vector when it lands.
5. `OD-07` — the admin panel's visual design is deliberately minimal/utilitarian per §18; a themed
   redesign remains open if the owner wants one later, but nothing about it blocks Phase 3 functioning.
6. `npm audit` reports moderate advisories through `firebase-admin`; unchanged this cycle, still worth
   a look now that Firebase is live in production use rather than just wired.
7. The Contact marker sits on Brigade Road's own centreline (OSM data), not the exact building —
   carried over from a prior cycle, still open, still not blocking.
8. Hero plate dev/prod discrepancy report and the deferred crane-lift animation are both explicitly
   out of scope for this session (Hero/plate work is running in a separate, parallel track) — carried
   over unchanged from the last cycle's `PROGRESS.md`, not touched here.

## Next Recommended Task

`EXECUTION_ORDER.md` points at Phase 10 (Accessibility, performance, QA) as the next phase —
`QA-000` (the About photograph) stays blocked on `OD-14` regardless, so QA-001 through QA-011 are the
actually-available next work.

## Notes for Next Cycle

- `firestore.rules`/`storage.rules` are deployed via the Firebase console's Rules tabs, not the
  Firebase CLI — this environment has no persisted CLI login. If the rules need to change again, the
  fastest path confirmed working this cycle is: update the `.rules` files in the repo, then have the
  owner paste the new contents into the console and publish, the same way as this cycle.
- The owner runs Vercel project setup and the `assetly.lease` domain connection themselves, outside
  Claude Code sessions — don't restart `vercel login` or ask about the registrar without checking
  first; `DEPLOYMENT_RUNBOOK.md` now reflects both as done.
- `TrustedBy`'s Firestore subscriptions start as soon as the homepage mounts, deliberately (§12: fetch
  early to avoid a later layout shift). This is why `tests/e2e/hero.spec.ts`'s §21 test now checks the
  Hero heading structurally (present in the raw SSR HTML) rather than counting network requests —
  keep that in mind if a future section adds another early client-side fetch near Hero.
- Every spec that loads `/` still plays the ~4.8s Phase 8.5 opening sequence first; `tests/e2e/support/opening.ts` handles that for every spec that imports `test`/`expect` from it, `admin.spec.ts` and
  `trusted-by.spec.ts` included even though the admin routes themselves never mount the loader.
- Per `DEC-054`, a task closes on owner-approved manual preview by default. This cycle leaned harder on
  Playwright than that default suggests because Phase 3 is genuinely new interactive/stateful logic
  (auth, CRUD, security rules) — worth protecting from silent regression — and because it let this
  session verify real behavior (a genuine Firebase Auth round trip) that it otherwise couldn't have
  claimed to have checked at all.
