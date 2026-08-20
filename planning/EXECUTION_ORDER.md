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
- [x] `FOUND-008` Archive static prototype HTML files into `reference/`, remove from build output — **closed as not applicable**: no `.html` file exists in the working tree or anywhere in git history. Nothing to archive; no `reference/` folder created. See `DECISIONS.md` DEC-016
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

- [ ] `PLATE-001` Build generic `Plate.tsx` (draw animation, `.go` trigger, reduced-motion fallback)
- [ ] `PLATE-002` Build `useDrawOnEnter` (IntersectionObserver trigger hook)
- [ ] `HERO-001` Implement Hero copy stack with locked DEC-001 copy (main line + subline), including a stable "A" mark position Phase 8.5 can hand off into
- [ ] `HERO-002` Author/source Hero plate SVG artwork (Access→Scale→Grow direction) — resolves `OD-02`
- [ ] `HERO-003` Implement interim entry sequence (§11 Hero Motion Sequence, post-loader form — plate draw → headline mask reveal → subline fade → plate complete → ambient start), fired on mount for now
- [ ] `HERO-004` Implement Stage 2 ambient drift (`useAmbientDrift`) + optional cursor parallax
- [ ] `HERO-005` Implement Stage 3 scroll-exit fade
- [ ] `HERO-006` Playwright: entry sequence timing, reduced-motion fallback, responsive 320–1920px
- [ ] `HERO-007` Performance check: Hero paint not blocked by any fetch

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

- [ ] `COMPARE-001` Build `content/compare/slides.ts` with exact locked copy for all 4 slides
- [ ] `COMPARE-002` Build `ArgumentSlide.tsx`
- [ ] `COMPARE-003` Implement `useScrollFocus` (shared RAF distance-from-center effect)
- [ ] `COMPARE-004` Build `CalculatorDrawer.tsx` desktop variant (chevron tab, Field panel, bar/row display)
- [ ] `COMPARE-005` Implement `useDrawerOpenness` (continuous scroll-scrubbed 0–1 value + manual override)
- [ ] `COMPARE-006` Implement calculator mode auto-sync + content transition (700–900ms)
- [ ] `COMPARE-007` Implement per-slide plate draw-on-activation (reuse `Plate.tsx`)
- [ ] `COMPARE-008` Build mobile bottom-sheet variant (stable height across slide changes)
- [ ] `COMPARE-009` Implement section entry/exit (drawer hidden pre-Hero-exit, exits before Why Us)
- [ ] `COMPARE-010` Author/source 4 Compare plate artworks (Lease/Loan/Purchase direction) — resolves `OD-03`
- [ ] `COMPARE-011` Playwright: scroll-through sync correctness, manual override, mobile height stability
- [ ] `COMPARE-012` Performance profile: RAF loop frame-rate check during scroll

## Phase 5 — Why Us

- [ ] `WHY-001` Build `content/why-us/values.ts` with locked T/F/S/P front+back copy
- [ ] `WHY-002` Build `FlipCard.tsx` (180° flip, click/tap only, independent per-card state)
- [ ] `WHY-003` Implement desktop hover micro-feedback (no flip on hover)
- [ ] `WHY-004` Build 2×2 → 1-column ledger grid with locked min-height (no layout jump)
- [ ] `WHY-005` Wire entry stagger via `RevealOnScroll`
- [ ] `WHY-006` Implement keyboard flip (Enter/Space) + `aria-pressed` state
- [ ] `WHY-007` Playwright: flip correctness, keyboard pass, reduced-motion, cross-browser (Chromium+WebKit)

## Phase 6 — Sectors

- [ ] `SECTOR-001` Build `content/sectors/sectors.ts` (6-sector pool, short descriptors)
- [ ] `SECTOR-002` Author/source 6 sector plate artworks — resolves `OD-04`
- [ ] `SECTOR-003` Implement `useOneOutOneIn` rotation scheduler (2.5s interval, one-slot-at-a-time)
- [ ] `SECTOR-004` Build `SectorCard.tsx` (index + name + optional descriptor + plate)
- [ ] `SECTOR-005` Build 2×2 desktop / 1×4 mobile ledger grid
- [ ] `SECTOR-006` Implement entrance sequence (stagger reveal → initial plates draw → rotation starts)
- [ ] `SECTOR-007` Implement hover-pause (desktop) + focus-pause (keyboard)
- [ ] `SECTOR-008` Playwright: rotation cadence/correctness, hover/focus pause, reduced-motion, responsive

## Phase 7 — Contact

- [ ] `CONTACT-001` Build static left info block (email/phone/Bengaluru, no full address)
- [ ] `CONTACT-002` Build/source custom Bengaluru map visual — resolves `OD-08`
- [ ] `CONTACT-003` Build `ContactDrawer.tsx` (handle + slide-in, map partially visible)
- [ ] `CONTACT-004` Build `content/contact/enquiryTypes.ts` per DEC-003 (4 categories + conditional fields)
- [ ] `CONTACT-005` Build `EnquiryTypeStep.tsx` (selectable rows + custom field)
- [ ] `CONTACT-006` Build `EnquiryDetailsStep.tsx` (base fields + conditional fields, underline inputs)
- [ ] `CONTACT-007` Build `lib/validation/contactForm.ts` (Zod, per enquiry type)
- [ ] `CONTACT-008` Build `buildGmailUrl.ts` + `buildMailto.ts`, wire primary/fallback actions
- [ ] `CONTACT-009` Build mobile bottom-sheet variant (Step 1 → Step 2 → action)
- [ ] `CONTACT-010` Implement section entrance sequence
- [ ] `CONTACT-011` Playwright: full enquiry flow all 4 types + custom, URL/encoding correctness, mobile sheet, a11y

## Phase 8 — About page

- [ ] `ABOUT-001` Build `content/about/copy.ts` (source-grounded, no fabricated content)
- [ ] `ABOUT-002` Build `/about` page: image + heading + body + optional location line
- [ ] `ABOUT-003` Confirm Nav/Footer reuse and correct link resolution to/from `/about`
- [ ] `ABOUT-004` Playwright: renders correctly, alt text present, responsive pass

## Phase 8.5 — Hero loader / opening sequence

- [ ] `LOADER-001` Build `HeroLoader.tsx`: Pitch full-screen opening, centered "A" + "ACCESS · SCALE · GROW", no navbar/Hero/plate visible
- [ ] `LOADER-002` Implement slow double blink on the "A" only (tagline stays static)
- [ ] `LOADER-003` Implement recede (scale down + backward-move, no morph/mask/shape transform)
- [ ] `LOADER-004` Implement settle into the Hero's final "A" position, stopping fully before further content
- [ ] `LOADER-005` Wire hand-off: settle completion triggers Hero's proposition/tagline reveal + quiet plate appearance
- [ ] `LOADER-006` Implement `prefers-reduced-motion` fallback (skip blink/recede, short subtle fade straight to final Hero state)
- [ ] `LOADER-007` Decide + implement reload/back-navigation replay behavior; document choice in `PROGRESS.md`
- [ ] `LOADER-008` Playwright: full §11a test list (colors/contrast, blink count, static tagline, no full disappear, visible movement to destination, settle-before-reveal, no navbar/plate competition during opening, no layout shift, mobile scale, reload/back-nav, reduced-motion)
- [ ] `LOADER-009` Performance check on slow-device emulation

## Phase 9 — Legal / basic SEO

- [ ] `LEGAL-001` Write generic Privacy Policy + Terms of Use placeholder copy — flags `OD-09`
- [ ] `LEGAL-002` Build `/privacy` and `/terms` routes, wire Footer links
- [ ] `SEO-001` Add per-route metadata (title/description) for `/` and `/about`
- [ ] `SEO-002` Add canonical tags + Open Graph tags
- [ ] `SEO-003` Build `app/sitemap.ts` + `app/robots.ts`
- [ ] `SEO-004` Add `noindex` to `/admin`, confirm excluded from sitemap
- [ ] `SEO-005` Re-check `OD-10` (Cookie Policy) still not required

## Phase 10 — Accessibility, performance, QA

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
