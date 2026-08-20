# EXECUTION ORDER — Assetly Website

Day-to-day build checklist. Status markers: `[ ]` pending, `[~]` in progress, `[x]` complete, `[!]` blocked (note the blocker inline). Each task should be completable or substantially advanceable in one coding session. Full detail for any task lives in `MASTER_PLAN.md`'s matching phase; design specifics live in `SOURCE_OF_TRUTH.md`.

Update this file at the end of every cycle per `LOOP.md` step 6. Do not skip ahead to a later phase's tasks while an earlier phase has unresolved `[!]` blockers that phase's exit criteria depend on.

---

## Phase 0 — Foundation

- [x] `FOUND-001` Scaffold Next.js App Router + TypeScript project, no Tailwind
- [x] `FOUND-002` Add `styles/tokens.css` (colors §6, fonts §7, easing §8, spacing §9)
- [x] `FOUND-003` Global reset + base typography in `app/globals.css`; load fonts via `next/font/google` — complete and verified: the Google Fonts fetch succeeds on a networked machine, so `DECISIONS.md` DEC-015 is **Withdrawn**
- [x] `FOUND-004` Establish folder structure (`app/(site)/`, `app/admin/`, `components/`, `lib/`, `content/`)
- [!] `FOUND-005` Create/configure Firebase project(s); resolve `OD-05` (env split, project IDs) — **blocked on `OD-05`**: creating the project needs Assetly Firebase console access. Deliberately deferred to Phase 3 / Phase 11 per `DECISIONS.md` DEC-014, which `MASTER_PLAN.md`'s Phase 0 exit criteria explicitly permit. Blocks `TRUST-001`–`TRUST-004` and `DEPLOY-001`; blocks nothing in Phase 1 or Phase 2
- [x] `FOUND-006` Wire `lib/firebase/client.ts` + `.env.local` (gitignored) — init only, no consumers yet — `client.ts` and `admin.ts` read from env vars and stay uninitialised when the environment is incomplete; `.env.local.example` is committed, and the real `.env.local` waits on `OD-05`
- [x] `FOUND-007` Configure Vitest + Playwright with smoke tests
- [x] `FOUND-008` Archive static prototype HTML files into `reference/`, remove from build output — originally closed as not applicable under DEC-016; completed when two prototypes later appeared and were archived during the Compare correction (DEC-021)
- [x] `FOUND-009` Verify: `next build` passes, lint/typecheck clean, blank page renders tokens/fonts correctly 320px–1920px — **closed 2026-08-20**. Re-run on a networked machine: `next build` passes on all routes *including* the three `next/font/google` downloads, lint and typecheck are clean, and the Playwright responsive sweep passes 320px–1920px. DEC-015's self-hosting proposal is unnecessary and is now **Withdrawn**

## Phase 1 — Shared site shell

- [x] `NAV-001` Build `Nav.tsx`: fixed, transparent-over-hero → Pitch-on-scroll (0.7s), logo+wordmark unit, desktop link row — wordmark/inset revised per `DECISIONS.md` DEC-017
- [x] `NAV-002` Build `MobileMenu.tsx`: hamburger → X, full-width top overlay (DEC-004), staggered entrance — focus trap, Escape-to-close with focus restore, `inert` while closed, body scroll lock
- [x] `NAV-003` Wire Nav link targets (Compare/Sectors/Contact = anchor scroll on `/`; About = route to `/about`) — the anchor-vs-route rule lives in `lib/scroll.ts` + `SiteLinkAnchor`, shared with the Footer
- [x] `FOOT-001` Build `Footer.tsx`: three-zone desktop layout, mobile vertical recomposition
- [x] `FOOT-002` Wire Footer nav groups + official info (email/phone/full address) + legal bar with auto year — legal items are labels, not links, until Phase 9 builds the routes (`LEGAL-002`)
- [x] `SHELL-001` Build `RevealOnScroll.tsx` (shared `.rv/.u` IntersectionObserver pattern + stagger classes) — classes are global and prefixed `rv-u`/`rv-d1..3`
- [x] `SHELL-002` Build `SerifHeading.tsx`, `Eyebrow.tsx`, `Container.tsx` primitives — plus `LogoMark.tsx` and `SiteLinkAnchor.tsx`
- [x] `SHELL-003` Playwright: nav/footer keyboard pass, mobile overlay focus trap, reduced-motion check — 33 shell tests, all passing

## Phase 2 — Hero and plate system

> Scope note (DEC-013): this phase's entry animation is the simple interim version only. The full blink/recede opening loader (§11a) is deferred to Phase 8.5, scheduled after Phase 8.

- [x] `PLATE-001` Build generic `Plate.tsx` (draw animation, `.go` trigger, reduced-motion fallback) — artwork passes geometry only; stroke/fill/dash all supplied by the component, so Phases 4 and 6 reuse it unmodified
- [x] `PLATE-002` Build `useDrawOnEnter` (IntersectionObserver trigger hook)
- [x] `HERO-001` Implement Hero copy stack with locked copy (main line + subline), including a stable mark position Phase 8.5 can hand off into — main line now per `DECISIONS.md` DEC-018
- [~] `HERO-002` Author/source Hero plate SVG artwork (Access→Scale→Grow direction) — artwork authored in-house and shipping (`content/plates/hero-plate.tsx`); `OD-02` stays **open** pending design review, since §11's direction was interpreted rather than supplied by a designer
- [x] `HERO-003` Implement interim entry sequence (§11 Hero Motion Sequence, post-loader form — plate draw → headline mask reveal → subline fade → plate complete → ambient start), fired on mount for now
- [x] `HERO-004` Implement Stage 2 ambient drift + cursor parallax — drift is CSS (8–12s, `alternate`, delayed past the draw); parallax is `lib/motion/useCursorParallax.ts`, inert under reduced motion and on coarse pointers
- [x] `HERO-005` Implement Stage 3 scroll-exit fade — continuous, rAF-coalesced, written as `--hero-plate-fade`
- [x] `HERO-006` Playwright: entry sequence timing, reduced-motion fallback, responsive 320–1920px
- [x] `HERO-007` Performance check: Hero paint not blocked by any fetch — asserted by test, no Firebase/network request on load

## Phase 3 — Trusted By infrastructure

- [ ] `TRUST-001` Resolve `OD-06` (admin auth method + authorized accounts)
- [ ] `TRUST-002` Implement Firebase Auth sign-in/out for `/admin`, redirect gate
- [ ] `TRUST-003` Define Firestore schema (`siteSections/trustedBy`, `trustedLogos/{logoId}`) exactly per §18
- [ ] `TRUST-004` Write/finalize `firestore.rules` + `storage.rules` (admin-write, public-read active-only)
- [ ] `TRUST-005` Build `LogoUploadForm.tsx` + Zod validation (`lib/validation/logoUpload.ts`)
- [ ] `TRUST-006` Build `LogoManager.tsx` (enable/disable, reorder, delete)
- [ ] `TRUST-007` Build `SectionToggle.tsx` (ON/OFF)
- [ ] `TRUST-008` Build public `TrustedBy.tsx` (enabled-AND-nonempty gating, §12)
- [ ] `TRUST-009` Build `LogoMarquee.tsx` (dual speed DEC-007, hover-pause, seamless duplication)
- [ ] `TRUST-010` Implement reduced-motion static fallback
- [ ] `TRUST-011` Implement silent-failure behavior (Firestore/Storage errors hide section)
- [ ] `TRUST-012` Playwright: full admin↔public loop, failure injection, reduced-motion, a11y pass

## Phase 4 — Compare experience

- [x] `COMPARE-001` Build `content/compare/slides.ts` with exact locked copy for all 4 slides — guarded by `tests/unit/compareCopy.test.ts`, which asserts the headlines, copy and all twelve readings verbatim
- [x] `COMPARE-002` Build `ArgumentSlide.tsx`
- [x] `COMPARE-003` Implement `useScrollFocus` (shared RAF distance-from-center effect) — pure curve in `lib/motion/scrollFocus.ts`
- [x] `COMPARE-004` Build `CalculatorDrawer.tsx` desktop variant (chevron tab, Field panel, persistent qualitative bar graph) — no numeric magnitudes, coefficients or value input; DEC-023 supersedes DEC-019's no-bars clause
- [x] `COMPARE-005` Implement `useDrawerOpenness` (continuous scroll-scrubbed 0–1 value + manual override) — pure math in `lib/motion/drawerOpenness.ts`, unit-tested without a DOM
- [x] `COMPARE-006` Implement calculator mode auto-sync + content transition (800ms) — plus a mode row that jumps rather than switching, so scroll position stays the only input (DEC-019)
- [x] `COMPARE-007` Implement per-slide plate draw-on-activation (reuse `Plate.tsx`) — `Plate` reused unmodified, as Phase 2's exit criterion required
- [x] `COMPARE-008` Build mobile bottom-sheet variant (stable height across slide changes) — height fixed in CSS and asserted pixel-exact across all four arguments
- [x] `COMPARE-009` Implement section entry/exit (drawer hidden pre-Hero-exit, exits before Why Us)
- [x] `COMPARE-010` Author/source 4 Compare plate artworks — approved 200×130 set adapts three archived `home-2.html` drawings and adds a matching Tax Treatment plate; `OD-03` resolved (DEC-022)
- [x] `COMPARE-011` Playwright: scroll-through sync correctness, manual override, mobile height stability — 30 Compare tests in `tests/e2e/compare.spec.ts`
- [x] `COMPARE-012` Performance profile: RAF loop frame-rate check during scroll — median 19.1ms, p95 25.6ms, 1 frame of 190 over 32ms, none over 50ms (dev build, headless Chromium); guarded by a test
- [x] `COMPARE-013` Archive `home-2.html` and `2-duty-cycle.html` under `reference/`; supersede DEC-016's missing-files premise
- [x] `COMPARE-014` Replace the calculator rows with one persistent, transitioning three-bar graph driven by qualitative tiers only
- [x] `COMPARE-015` Re-test copy, graph identity/tier sync, drawer and sheet behavior, reduced motion, responsive layout, performance, and desktop/mobile visuals

## Phase 5 — Why Us

- [x] `WHY-001` Build `content/why-us/values.ts` with locked T/F/S/P front+back copy
- [x] `WHY-002` Build `FlipCard.tsx` (180° flip, click/tap only, independent per-card state)
- [x] `WHY-003` Implement desktop hover micro-feedback (no flip on hover)
- [x] `WHY-004` Build 2×2 → 1-column ledger grid with locked min-height (no layout jump)
- [x] `WHY-005` Wire entry stagger via `RevealOnScroll`
- [x] `WHY-006` Implement native-button keyboard flip, `aria-pressed`, and active-face-only descriptions (DEC-024)
- [x] `WHY-007` Playwright: flip correctness, keyboard pass, reduced-motion, cross-browser (Chromium+WebKit)
- [x] `WHY-008` Correct the grid's proportions (DEC-028): cell height capped against viewport height so the 2×2 is seen whole, letter enlarged and the void closed, back-face copy verified unclipped at 1440×900 and 390×844

## Phase 6 — Sectors

- [x] `SECTOR-001` Build `content/sectors/sectors.ts` (6-sector pool, short descriptors)
- [x] `SECTOR-002` Author 6 code-native 200×130 sector plate artworks — resolves `OD-04` (DEC-025)
- [x] `SECTOR-003` Implement `useOneOutOneIn` rotation scheduler (1.2s interval per DEC-029, one-slot-at-a-time)
- [x] `SECTOR-004` Build `SectorCard.tsx` (index + name + desktop descriptor + plate)
- [x] `SECTOR-005` Build 2×2 desktop / 1×4 mobile ledger grid
- [x] `SECTOR-006` Implement entrance sequence (stagger reveal → initial plates draw → rotation starts)
- [x] `SECTOR-007` Implement hover, focus, and document-visibility pause behavior
- [x] `SECTOR-008` Playwright: rotation cadence/correctness, hover/focus pause, reduced-motion, responsive, Chromium+WebKit
- [x] `SECTOR-009` Correct the grid's proportions so §15's four-at-once rotation is actually visible (DEC-028): cell capped against viewport height, plate sized from the card, descriptor given a one-line measure, and the mobile card recomposed horizontally so all four fit a 390×844 screen
- [x] `SECTOR-010` Set the rotation interval to 1.2s and rewrite the cadence test to sample consecutive states rather than snapshot around one swap (DEC-029)

## Phase 7 — Contact

- [x] `CONTACT-001` Build static left info block (email/phone/Bengaluru, no full address)
- [x] `CONTACT-002` Author illustrative non-cartographic Bengaluru plate — resolves `OD-08` (DEC-026)
- [x] `CONTACT-003` Build `ContactDrawer.tsx` (handle + slide-in, map partially visible)
- [x] `CONTACT-004` Build `content/contact/enquiryTypes.ts` per DEC-003 (4 categories + custom and conditional fields)
- [x] `CONTACT-005` Build the selectable enquiry-type step in `EnquiryFlow.tsx`
- [x] `CONTACT-006` Build the details step with conditional underline fields in `EnquiryFlow.tsx`
- [x] `CONTACT-007` Build `lib/validation/contactForm.ts` (Zod discriminated union and locked limits)
- [x] `CONTACT-008` Build one deterministic email draft source and wire matching protected Gmail/mailto actions
- [x] `CONTACT-009` Build the separate mobile bottom-sheet variant with grip and explicit Close control
- [x] `CONTACT-010` Implement reduced-motion-safe section, map, panel, and step presentation
- [x] `CONTACT-011` Playwright: every enquiry branch, encoding, preservation, validation/focus, desktop/mobile panels, reduced motion, Chromium+WebKit
- [x] `CONTACT-012` Factor and reuse shared modal focus trap, Escape, focus return, and scroll lock behavior
- [x] `CONTACT-013` Correct the section's proportions (DEC-028): info column and map shell brought to one shorter shared height, closing the ~200px void under the heading
- [x] `CONTACT-014` Anchor the map pin and its label to the viewBox centre so `slice` cropping cannot separate them, and delete the per-breakpoint marker offset (DEC-030)

## Phase 8 — About page

- [!] `ABOUT-000` Resolve `OD-14`: real usage-approved image and factual alt description deferred to `QA-000` by owner instruction (DEC-027); no longer blocks the Phase 8 layout/content commit
- [x] `ABOUT-001` Build `content/about/copy.ts` with the exact source-grounded copy
- [x] `ABOUT-002` Build `/about`: owner-approved temporary media slot + heading + body + Bengaluru/email line (DEC-027)
- [x] `ABOUT-003` Confirm Nav/Footer reuse and correct link resolution to/from `/about`
- [x] `ABOUT-004` Playwright: approved copy, metadata, placeholder semantics, responsive composition, navigation, reduced motion

## Phase 8.5 — Hero loader / opening sequence

- [x] `LOADER-001` Build `HeroLoader.tsx`: Pitch full-screen opening, centered "A" + "ACCESS · SCALE · GROW", no navbar/Hero/plate visible
- [x] `LOADER-002` Implement slow double blink on the "A" only (tagline stays static)
- [x] `LOADER-003` Implement recede (scale down + backward-move, no morph/mask/shape transform)
- [x] `LOADER-004` Implement settle into the Hero's final "A" position, stopping fully before further content
- [x] `LOADER-005` Wire hand-off: settle completion triggers Hero's proposition/tagline reveal + quiet plate appearance
- [x] `LOADER-006` Implement `prefers-reduced-motion` fallback (skip blink/recede, short subtle fade straight to final Hero state)
- [x] `LOADER-007` Decide + implement reload/back-navigation replay behavior; document choice in `PROGRESS.md`
- [x] `LOADER-008` Playwright: full §11a test list (colors/contrast, blink count, static tagline, no full disappear, visible movement to destination, settle-before-reveal, no navbar/plate competition during opening, no layout shift, mobile scale, reload/back-nav, reduced-motion)
- [x] `LOADER-009` Performance check on slow-device emulation
- [x] `LOADER-010` Recompose the Hero plate around a protected copy zone at desktop/tablet widths; settle at 20% opacity with a darker draw tone
- [x] `LOADER-011` Prepare typed hidden/Access/Growth phone treatments, ship hidden, and document the one-setting switch
- [x] `LOADER-012` Playwright and visual review: collision clearance, prepared mobile modes, short landscape, reduced motion and loader landing regression

## Phase 9 — Legal / basic SEO

- [ ] `LEGAL-001` Write generic Privacy Policy + Terms of Use placeholder copy — flags `OD-09`
- [ ] `LEGAL-002` Build `/privacy` and `/terms` routes, wire Footer links
- [ ] `SEO-001` Add per-route metadata (title/description) for `/` and `/about`
- [ ] `SEO-002` Add canonical tags + Open Graph tags
- [ ] `SEO-003` Build `app/sitemap.ts` + `app/robots.ts`
- [ ] `SEO-004` Add `noindex` to `/admin`, confirm excluded from sitemap
- [ ] `SEO-005` Re-check `OD-10` (Cookie Policy) still not required

## Phase 10 — Accessibility, performance, QA

- [!] `QA-000` Replace the About media placeholder with the real usage-approved `next/image` asset and factual alt text — **blocked on `OD-14`; blocks Phase 10 exit and deployment**
- [ ] `QA-001` Full-site keyboard pass (`/`, `/about`, `/admin`)
- [ ] `QA-002` Focus management audit (all drawers/overlays/sheets)
- [ ] `QA-003` Screen reader pass (NVDA or VoiceOver) across all sections
- [ ] `QA-004` Touch target audit (mobile, ~44px minimum)
- [ ] `QA-005` Reduced-motion audit across every animated component
- [ ] `QA-006` Layout-stability (CLS) audit — Trusted By, Compare mobile, Why Us flip
- [ ] `QA-007` Real/emulated mobile browser pass (iOS Safari, Android Chrome)
- [ ] `QA-008` Animation performance profiling (Compare RAF, Hero ambient drift)
- [ ] `QA-009` Firebase failure-state re-verification post-integration
- [ ] `QA-010` Full Playwright journey suite (home scroll-through, About, admin loop, Contact flow)
- [ ] `QA-011` Lighthouse pass on `/` and `/about`, scores recorded in `PROGRESS.md`

## Phase 11 — Deployment

- [ ] `DEPLOY-001` Finalize staging/production Firebase environment config (`OD-05`)
- [ ] `DEPLOY-002` Deploy to staging, run Phase 10 checklist against staging
- [ ] `DEPLOY-003` Connect production domain (`OD-12`)
- [ ] `DEPLOY-004` Finalize production `firestore.rules`/`storage.rules`
- [ ] `DEPLOY-005` Deploy to production via Firebase App Hosting
- [ ] `DEPLOY-006` Final production smoke test (all sections, admin login, Trusted By, Contact flow)
- [ ] `DEPLOY-007` Production Lighthouse run recorded in `PROGRESS.md`
