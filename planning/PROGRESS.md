# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 9 (Legal pages + basic SEO) is **complete and merged into `main`**. Phases 0, 1, 2, 4, 5, 6, 7, 8, 8.5, and 9 are done. Phase 3 remains blocked on `OD-05`/`OD-06`, with a path to resolving both now documented in `planning/DEPLOYMENT_RUNBOOK.md`.

## Current Task

None outstanding from Phase 9. The Hero plate opening-animation dev/prod report is still awaiting the owner's fresh-incognito confirmation (see Issues/Blockers) — a defensive bfcache fix landed either way, since it's a real gap independent of which cause explains the original report. The Hero motion proposal moved from written proposal to two shipped additions (node-arrival pop, traveling journey marker) plus one deferred addition (a crane-lift animation at Access) that the owner asked to hold for a later cycle.

## Status

This cycle covered five threads at the owner's request, run in parallel rather than sequentially:

1. Phase 9 build-out (below).
2. A verification-policy change (`DEC-054`): per-task testing now defaults to type check + lint + manual dev-server preview + owner approval, not a new automated suite per task. `LOOP.md` and `MASTER_PLAN.md` were updated to reflect this as the standing default, not a one-off.
3. A deployment runbook (`planning/DEPLOYMENT_RUNBOOK.md`) for the owner to execute themselves — new Firebase project, a new GitHub repo (one clean push once this cycle's work is on `origin`, not an ongoing second remote), a new Vercel project, and the `assetly.lease` domain connection. None of `gh`, the Vercel CLI, or the Firebase CLI could complete their OAuth logins in this environment, so this track is owner-executed rather than run directly. Firebase web SDK config and Admin SDK service account were both supplied by the owner and wired into `.env.local` (gitignored, not committed) — both `lib/firebase/client.ts` and `admin.ts` now initialise.
4. A Hero plate dev/prod animation discrepancy report — diagnosed as far as the code allows (see Issues/Blockers); a bfcache-restore gap was fixed regardless of the still-unconfirmed root cause.
5. Hero plate motion work (`DEC-055`, `DEC-056`) — cursor parallax removed per owner feedback that the whole plate was tracking the mouse; a node-arrival pop and a traveling journey marker (Scale → Grow) added and shipped. A further crane-lift addition at Access was built, then deliberately reverted at the owner's request to keep this push to the shipped-and-approved state only — it will be redone in a later cycle.

## Completed This Cycle

### Phase 9 — Legal pages + basic SEO

- `content/legal/privacy.ts`, `content/legal/terms.ts` — new. Generic, explicitly-labelled placeholder Privacy Policy / Terms of Use copy, flagging `OD-09`. No facts invented beyond what `content/site/navigation.ts` already established (entity name, Bengaluru/Karnataka office, `finance@assetly.lease`). No cookie/consent language — `OD-10` re-confirmed not required (no analytics/consent system exists).
- `components/legal/LegalPageBody.tsx` + `Legal.module.css` — shared body (heading, placeholder notice, paragraphs) for both legal routes, in the same plain typographic register as `/about`.
- `app/(site)/privacy/page.tsx`, `app/(site)/terms/page.tsx` — new routes, each with its own `metadata` (title, description, canonical, Open Graph).
- `content/site/navigation.ts` — `LEGAL_LINKS` changed from plain `{label, href}` to real `RouteLink`s (`kind: "route"`); `components/footer/Footer.tsx` now renders them through the existing `SiteLinkAnchor` (reusing the footer's `.link` hover/underline styling) instead of inert `Eyebrow` text.
- `app/(site)/page.tsx` — added `metadata` export (title, description, canonical, Open Graph) for `/`, which previously had none of its own.
- `app/(site)/about/page.tsx` — added `alternates.canonical` and `openGraph.url`, which were missing.
- `app/layout.tsx` — added `metadataBase: new URL("https://assetly.lease")` so every route's relative canonical/OG URL resolves correctly.
- `app/sitemap.ts`, `app/robots.ts` — new. Sitemap covers `/` and `/about` only; robots allows public routes and disallows `/admin`, and points at the sitemap.
- `app/admin/page.tsx` already carried `robots: { index: false, follow: false }` from Phase 0 — confirmed still correct and excluded from the sitemap; no change needed there.

### Testing-policy update (`DEC-054`)

`planning/LOOP.md` step 5 (VERIFY), step 3's "Test method" line, and the guardrail on skipping "Record" were reworded around the new default. `planning/MASTER_PLAN.md`'s opening paragraph now points at `LOOP.md` for what "Test" defaults to rather than implying a full automated pass every phase. A `DEC-054` entry was added to `planning/DECISIONS.md` recording the change and why, so future light-touch phases aren't mistaken for under-tested.

### Deployment runbook

`planning/DEPLOYMENT_RUNBOOK.md` — new. Ordered checklist: Firebase project + Firestore/Storage/Auth + web app config + admin SDK service account (resolves `OD-05`; surfaces `OD-06` as an owner decision with Email/Password recommended as the default) → new GitHub repo (created now, pushed to once this cycle's `origin` work is done) → new Vercel project with the Firebase env vars → `assetly.lease` domain connection. Confirmed via `vercel whoami` that the Vercel CLI here isn't logged in, and that `gh`/`firebase` aren't installed — all three need interactive browser logins this environment can't complete, hence the owner-executed runbook rather than driving it directly.

### Hero plate bfcache fix

`lib/motion/homeOpeningReplay.ts` — added a `pageshow` listener that forces `window.location.reload()` when a tab restores from the back/forward cache on `/`. A bfcache-restored tab otherwise resumes with whatever frozen `completed` state it was cached with, which could show the plate pre-drawn with no opening on a back-navigation. Scoped to `/` only. This is a real, independently-justified fix; it is not confirmed to be the cause of the original dev/prod report, which is still open pending the owner's incognito check.

### Hero plate motion (`DEC-055`, `DEC-056`)

- Cursor parallax removed: `lib/motion/useCursorParallax.ts` deleted; `Hero.tsx` no longer calls it; the `--hero-parallax-x/y`-driven transform on `.plateLayer` and the dead reduced-motion/mobile overrides that existed only to neutralise it are gone from `Hero.module.css`.
- Node-arrival pop: the three existing Grow nodes now scale in from 0.4 to 1 in a short, staggered transition timed to land near the end of the plate's draw, instead of appearing in lockstep with the rest of the linework.
- Journey marker: a new filled circle (`content/plates/hero-plate.tsx`'s `journey` region) travels via CSS `offset-path` from where the Scale curve starts (the crane's deck) through Grow's polyline to its top, fading in, completing the trip, fading out, and looping on a 9s cadence. Desktop/tablet only — hidden below 640px, where the mobile composition repositions Access/Growth separately and the shared-coordinate path would no longer line up.
- `tests/unit/heroPlate.test.tsx` updated: `data-hero-plate-region` count is now 5 (added `journey`); node count stays 3.
- **Deferred, not shipped**: a crane-lift animation at Access (a load traveling from a yard point up to the crane's hook, plus a fourth arrival-pop node at the hook) was built and verified, then reverted at the owner's explicit request ("push [the journey marker], we'll do the crane lifting later") so this push reflects only what's been previewed and approved. The geometry and CSS pattern are straightforward to redo from `DEC-056`'s "why rejected" note when picked back up.

## Decisions

- **DEC-054** — per-task verification defaults to manual preview + owner approval, not an automated suite (supersedes the implicit per-phase Vitest/Playwright expectation `MASTER_PLAN.md` previously carried).
- **DEC-055** — the Hero plate's cursor parallax is removed.
- **DEC-056** — the Hero plate gets a node-arrival pop and a traveling journey marker.

## Tests Run

Per `DEC-054`'s new default: `npx tsc --noEmit` clean, `npm run lint` clean throughout this cycle's changes. `npm run build` clean for Phase 9 (all eight routes — `/`, `/about`, `/admin`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt`, `/_not-found` — generated as static content). A production server (`next start`) was run locally and the following were checked directly against it and confirmed correct: `/sitemap.xml` content, `/robots.txt` content and its `Disallow: /admin` + `Sitemap:` lines, `/admin`'s `<meta name="robots" content="noindex, nofollow">`, `/privacy` and `/terms` page titles, the Footer's `/privacy` and `/terms` links resolving, and canonical + Open Graph tags on `/` and `/about`. No new Playwright spec was added for Phase 9, consistent with `DEC-054` — its own complexity (static content routes, no interactive/animated logic) doesn't call for one.

For the Hero plate motion work, which does touch interactive/animated behavior with existing dedicated coverage, `tests/unit/heroPlate.test.tsx` and both `tests/e2e/hero-plate.spec.ts` and `tests/e2e/hero-loader.spec.ts` (12 Playwright tests total) were re-run after every change in this area and pass. One run of the loader's headline-timing test failed once under machine-load variance and passed cleanly on a clean re-run immediately after — treated as flakiness, not a regression, since it's unrelated to anything the plate changes touch.

## Issues / Blockers

1. `OD-14` — the rights-cleared About photograph and its factual alt text are still required before Phase 10 exits.
2. `OD-13` — no Compare disclaimer wording supplied; none invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — logo is raster, no favicon. The loader reuses the shipped glyph so it hands off without a shape swap.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision yet; Phase 3 stays blocked until the owner runs `planning/DEPLOYMENT_RUNBOOK.md` step 1.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.
8. The Contact marker sits on Brigade Road's own centreline, taken from OSM. The building itself is not in OpenStreetMap, so the pin is street-accurate rather than door-accurate; confirm with the owner whether that is close enough before launch.
9. Hero plate reported as already fully drawn on entry to the deployed site, but plays correctly locally. Code review found no build/environment branch in the draw path at all (`Plate.tsx`/`Hero.tsx`/`useHeroLoaderSequence.ts`/`homeOpeningReplay.ts`, `next.config.ts` checked — no redirects, no static export, no middleware, no service worker). Two intentional, code-confirmed mechanisms could produce exactly this symptom: `prefers-reduced-motion` forcing the fully-drawn end state instantly (`Plate.module.css:59-70`, `Hero.module.css:385-433`), or the `homeOpeningReplay` module-scope gate only playing the opening on a document's genuine first load of `/` (`lib/motion/homeOpeningReplay.ts`) — a soft nav or bfcache-restored tab shows it pre-drawn. A fix for the bfcache case shipped this cycle regardless (see above); the root cause of the original report is still **unconfirmed** — the owner has not yet reported back from a fresh-incognito check.
10. Datum-line-width concern raised by the owner ("the base horizontal line needs to be the complete width") — investigated but not reproduced: `tests/e2e/hero-plate.spec.ts` asserts the datum line reaches both edges within 0.5px at 320/390/640px widths, and it's passing. No code change made without a specific width/device to reproduce against.
11. Crane-lift animation at Access — built, verified, then deliberately reverted at owner request to keep this push scoped to approved work. Redo in a later cycle: a fourth `data-hero-plate-node="0"` at the crane's hook (~127,337 in the access group's local coordinates) plus a `data-hero-plate-lift` circle traveling `offset-path: path('M230 555 C 210 480, 160 400, 130 340')`, both inside the same transformed `<g>` so they follow Access wherever it's repositioned. CSS pattern mirrors the journey marker's (`plateJourney`/`plateLift` keyframes, same reduced-motion/mobile suppression approach).

## Next Recommended Task

Phase 10 (Accessibility, performance, and QA) is the next phase in `MASTER_PLAN.md`, but Phase 3 (Firestore/Trusted By) becomes available first if the owner completes `planning/DEPLOYMENT_RUNBOOK.md` steps 2-4 (Firebase itself is done — see Status) and resolves `OD-06` — check which has actually happened before choosing. The Hero plate dev/prod diagnosis (blocker 9), the datum-line report (blocker 10), and the deferred crane-lift animation (blocker 11) are all open loops from this cycle that should be closed before or alongside whichever phase comes next.

## Notes for Next Cycle

- Every spec that loads `/` now loads the ~4.8s opening sequence with it. Specs written before Phase 8.5 must wait past it.
- `HERO_LOADER_DURATIONS.signature` and the `loaderDoubleBlink` duration in `Hero.module.css` are the same number in two places. Changing one without the other is a bug, not a mismatch.
- `content/plates/bengaluru-map.ts` is generated. To move the window or refresh the data, re-run an Overpass query for the bbox in its header; do not edit the numbers.
- The flip card cannot grow to fit its copy — both faces are absolutely positioned inside a cell of fixed height — so any type change in Why Assetly needs the back faces re-measured at 1280×720 and 375×667.
- `overflow: clip` rather than `hidden` for any box that hides something positioned outside it.
- Anything that must cover the whole window needs `100vw`, not `inset: 0`.
- The loader's target must continue to be measured from `[data-hero-mark-target]`; do not parse the `clamp()` token as a number.
- Per `DEC-054`, a task now closes on owner-approved manual preview by default — reach for a new Vitest/Playwright test only when a task's own complexity (non-trivial logic, or interactive/animated behavior worth protecting from regression) actually calls for one.
