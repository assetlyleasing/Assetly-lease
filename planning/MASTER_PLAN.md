# MASTER PLAN — Assetly Website

Ordered, dependency-gated implementation phases. Each phase's design specifics are governed by `SOURCE_OF_TRUTH.md` — this document sequences the work, lists concrete files/schema, and defines exit criteria. Do not start a phase whose prerequisites haven't passed. Verification is mandatory per phase per the root mandate: **Implement → Test → Fix → Retest → Record** (record in `PROGRESS.md`) — see `LOOP.md` step 5 for what "Test" defaults to (DEC-054: type check + lint + manual dev-server preview + owner approval, with each phase's "Tests" list below as a menu to reach for on complex/interactive work, not a per-phase checklist).

Referenced open decisions (`OD-xx`) and resolved conflicts (`DEC-xxx`) are defined in `SOURCE_OF_TRUTH.md` §25 and `DECISIONS.md` respectively.

---

## Phase 0 — Repository and project foundation

**Objective**: Stand up the Next.js/TypeScript project that every later phase builds inside, with tokens, fonts, and Firebase wired but unused until Phase 3.

**Inputs/dependencies**: None. `SOURCE_OF_TRUTH.md` §6–§9, §19; `DECISIONS.md` DEC-008–DEC-011.

**Components/files**:
- `package.json`, `tsconfig.json`, `next.config.ts`
- `app/layout.tsx`, `app/globals.css`
- `styles/tokens.css` (color/typography/spacing/easing custom properties from §6–§9)
- `lib/firebase/client.ts`, `lib/firebase/admin.ts` (init only, no consumers yet)
- `.env.local.example`, `.env.local` (gitignored)
- `firebase.json`, `firestore.rules`, `storage.rules` (skeletons)
- `vitest.config.ts`, `playwright.config.ts`

**Implementation tasks**:
1. `create-next-app` with App Router + TypeScript, no Tailwind.
2. Add `styles/tokens.css` transcribing every token in `SOURCE_OF_TRUTH.md` §6 (colors), §7 (font stacks + Google Fonts import), §8 (easing curves), §9 (spacing clamps). Exclude `--soot` (§6 note).
3. Global reset + base typography in `app/globals.css`, importing `tokens.css`.
4. Load DM Serif Display, DM Serif Text, Inter Tight via `next/font/google`.
5. Establish folder structure: `app/(site)/page.tsx` (home), `app/(site)/about/page.tsx`, `app/admin/`, `components/`, `lib/`, `content/` (static section content constants per DEC-011).
6. Create Firebase project(s) — resolve OD-05 (project ID, env split) before proceeding past this task; wire `lib/firebase/client.ts` (Firestore/Storage/Auth SDK init) and confirm it builds without being called anywhere yet.
7. Define dev/staging/production strategy: local `.env.local` for dev, a distinct Firebase project or environment prefix for staging vs. production (finalize under OD-05).
8. Configure Vitest and Playwright with empty smoke tests.
9. Archive the static prototype HTML files (`home-2.html`, `index.html`, `assetly-home.html`, `1-residual.html`, `2-duty-cycle.html`, `3-white-paper.html`, `4-position.html`, `previews.html`) into a `reference/` folder — keep them for visual/motion reference (DEC-008), remove from build output.

**Data/schema changes**: None yet (schemas defined in Phase 3).

**Responsive requirements**: N/A (foundation only) — but confirm the base font/clamp system renders correctly from 320px to 1920px viewport widths via a throwaway test page.

**Animation requirements**: `prefers-reduced-motion` media query block established in `globals.css` per §8, even though no components consume it yet.

**Accessibility requirements**: Base HTML lang, viewport meta, focus-visible reset (not `outline:none` without replacement).

**Tests**:
- Vitest: token file parses / no build errors.
- `next build` succeeds.
- Playwright smoke: root route returns 200 with expected `<title>`.

**Exit criteria**: `next dev` runs; tokens/fonts render on a blank page; Firebase SDK initializes without runtime error; lint/typecheck/build all pass; OD-05 resolved (or explicitly deferred with a stub project for local dev only, documented in `PROGRESS.md`).

**Risks**: Firebase project misconfiguration blocking later phases; committing real env secrets by mistake (confirm `.env.local` is gitignored before first commit).

**Open decisions**: OD-05.

---

## Phase 1 — Shared site shell

**Objective**: Build Navigation and Footer as shared chrome, plus reusable typography/layout primitives every later section will use.

**Inputs/dependencies**: Phase 0 complete. `SOURCE_OF_TRUTH.md` §10 (Nav), §17 (Footer). **Blocked on OD-01** (logo asset) for pixel-final nav/footer, but layout/behavior can be built with a placeholder mark.

**Components/files**:
- `components/nav/Nav.tsx`, `Nav.module.css`, `components/nav/MobileMenu.tsx`
- `components/footer/Footer.tsx`, `Footer.module.css`
- `components/primitives/` — `Eyebrow.tsx`, `SerifHeading.tsx`, `Container.tsx` (page-gutter wrapper), `RevealOnScroll.tsx` (the `.rv/.u` IntersectionObserver pattern from §8)
- `lib/scroll.ts` (smooth-scroll-to-section helper)

**Implementation tasks**:
1. Build `Nav.tsx`: fixed position, transparent-over-hero → Pitch solid on scroll (§10 scroll behavior, 0.7s `--eio`), logo+wordmark unit, desktop link row (Compare/Sectors/About/Contact), hover underline animation.
2. Build `MobileMenu.tsx`: hamburger icon (2–3 line → X, 0.5–0.7s), full-width top overlay per DEC-004, staggered fade/slide entrance, large touch targets.
3. Wire Nav links: Compare/Sectors/Contact = smooth-scroll anchors on `/`; About = route link to `/about`. From `/about`, Compare/Sectors/Contact must navigate back to `/` with the anchor (e.g. `/#compare`).
4. Build `Footer.tsx`: three-zone desktop layout (brand / two nav groups / official info), legal bar with auto-updating copyright year, mobile vertical recomposition (§17).
5. Build `RevealOnScroll.tsx` implementing the shared `.rv/.u` IntersectionObserver reveal + `.d1/.d2/.d3` stagger classes, reusable by every later section.
6. Build `SerifHeading.tsx` supporting the italic-in-Moss span convention (§7).

**Data/schema changes**: None.

**Responsive requirements**: Nav collapses to hamburger per §10's breakpoint; Footer recomposes vertically on mobile per §17, nav groups may sit side-by-side on wider mobile widths.

**Animation requirements**: Nav scroll transition (0.7s `--eio`); hamburger transform; mobile overlay stagger; footer entrance stagger (fade upward, brand → nav → contact → legal). All reduced-motion-safe.

**Accessibility requirements**: Hamburger button has `aria-expanded`/`aria-controls`; mobile overlay traps focus while open and restores focus on close; all nav/footer links keyboard-reachable with visible focus; landmark roles (`<nav>`, `<footer>`) present.

**Tests**:
- Vitest: `lib/scroll.ts` helper unit tests (correct target resolution).
- Playwright: desktop nav renders all 4 links and scroll-transitions on scroll; mobile hamburger opens/closes overlay and traps focus; footer links navigate/scroll correctly; keyboard-only pass through nav → footer.
- Responsive check at mobile/tablet/laptop/desktop widths.
- Reduced-motion check: nav/footer transitions collapse to instant per `prefers-reduced-motion`.

**Exit criteria**: Nav and Footer render correctly and pass all tests above on `/` (even with only a placeholder body between them) and on a placeholder `/about`. No console errors.

**Risks**: Logo placeholder shipped instead of the real mark (OD-01) — must be swapped later without layout rework; smooth-scroll-to-anchor from `/about` back to `/` needs care with Next.js navigation timing.

**Open decisions**: OD-01 (logo asset — placeholder acceptable to proceed, must be tracked).

---

## Phase 2 — Hero and plate system

**Objective**: Build the Hero section and the reusable inline-SVG "plate" infrastructure that every later section (Compare, Sectors) will reuse. **Scope note (DEC-013)**: this phase ships the Hero with a simple interim entrance (plate draw + mask reveal on mount) — it does **not** build the blink/recede opening loader described in `SOURCE_OF_TRUTH.md` §11a; that is deliberately deferred to Phase 8.5 so it can be layered on once the rest of the site shell is stable. Build the Hero's final "A" mark position/markup so Phase 8.5 has a real hand-off target later.

**Inputs/dependencies**: Phase 1 complete (Nav must render transparently over Hero). `SOURCE_OF_TRUTH.md` §11 (§11a is Phase 8.5's concern, not this phase's).

**Components/files**:
- `components/plate/Plate.tsx` (generic reusable traced-line SVG component: accepts path data, handles the `stroke-dasharray:2200 → stroke-dashoffset:0` draw animation, `.go` trigger class, reduced-motion fallback)
- `components/hero/Hero.tsx`, `Hero.module.css`
- `content/plates/hero-plate.tsx` (or `.svg` + wrapper) — the Access→Scale→Grow artwork
- `lib/motion/useDrawOnEnter.ts` (IntersectionObserver hook triggering `.go`)
- `lib/motion/useAmbientDrift.ts` (Stage 2 living-plate micro-movement + optional cursor parallax)

**Implementation tasks**:
1. Build `Plate.tsx` as a generic component: props for `pathRefs`/`d` data, opacity target, draw duration (default 2.6s), easing (`--eio`), and a `reducedMotion` fallback that shows the final state instantly.
2. Author or source the Hero plate SVG per §11's Access→Scale→Grow direction (**resolves OD-02** when complete — do not fabricate finished artwork silently; if a designer asset isn't available, flag it explicitly in `PROGRESS.md` rather than shipping a placeholder as final).
3. Implement Hero copy stack: Logo → main line (DM Serif Display, `clamp(31px,6.4vw,76px)`, 2-line max, optional Moss italic word) → subline (DM Serif Text, `clamp(17px,1.8vw,22px)`) using the locked DEC-001 copy.
4. Implement the interim entry sequence (§11 Hero Motion Sequence, post-loader form: plate draw → headline mask reveal → subline fade → plate complete → ~3s ambient start) as the Hero's own mount animation for this phase — Phase 8.5 will later gate this behind the opening loader's "A" settle instead of firing it on page load directly.
5. Implement Stage 2 (`useAmbientDrift`): 2–5px line drift, slow node reposition, subtle cursor parallax on desktop, ~8–12s cycle — must read as "alive," not looping.
6. Implement Stage 3 scroll-transition fade tied to scroll position leaving the Hero (hook shared later with Compare's entry, Phase 4).
7. Wire the Hero to sit directly under the transparent Nav from Phase 1.

**Data/schema changes**: None.

**Responsive requirements**: Hero is `min-height:100svh`; headline/subline clamp fluidly; plate scales/repositions sensibly down to 320px width without becoming illegible or overflowing.

**Animation requirements**: Full choreography above; `prefers-reduced-motion` collapses the entry to an instant final state (plate at rest, fully drawn, no ambient drift, no parallax) per §8.

**Accessibility requirements**: Plate SVG is `aria-hidden` (decorative); headline is a real heading element (`h1`); reduced-motion respected; no motion that could trigger vestibular discomfort in the "living plate" stage beyond the specified 2–5px drift.

**Tests**:
- Vitest: `useDrawOnEnter` hook triggers `.go` correctly on intersection; `Plate` component renders reduced-motion final state when the media query is mocked true.
- Playwright: Hero entry sequence completes visually within expected timing bounds; reduced-motion variant shows final state immediately; Hero renders correctly at mobile/tablet/laptop/desktop widths.
- Performance: Hero paints without blocking on any network fetch (no Firestore call in this phase, per §21).

**Exit criteria**: Hero renders with correct copy, choreography, and reduced-motion fallback; `Plate` component is generic enough to be reused unmodified in Phase 4 and Phase 6; Lighthouse performance check shows no Hero-blocking regression.

**Risks**: Hand-authoring meaningful SVG line-art is a real design task, not just engineering — do not let "plate looks fine" substitute for "plate represents Access→Scale→Grow" per §5's meaningful-plate principle. Cursor-parallax implementation can be a performance/jank risk if not throttled to RAF.

**Open decisions**: OD-02 (only fully resolved once real artwork ships, not a placeholder).

---

## Phase 3 — Trusted By infrastructure

**Objective**: Build the Firestore/Storage-backed, admin-toggleable Trusted By section end-to-end: schema, admin CRUD, and the public marquee.

**Inputs/dependencies**: Phase 0 (Firebase wired). `SOURCE_OF_TRUTH.md` §12, §18. Independent of Phase 2 (can run in parallel with Phase 2 if resourced separately, since it doesn't touch the Hero/plate system) — but must land before Phase 4 if Phase 4 relies on the shared page assembly order.

**Components/files**:
- `app/admin/page.tsx`, `app/admin/layout.tsx` (auth-gated)
- `app/admin/login/page.tsx`
- `components/admin/LogoManager.tsx`, `components/admin/LogoUploadForm.tsx`, `components/admin/SectionToggle.tsx`
- `lib/firebase/auth.ts` (admin sign-in/out, session check)
- `lib/firebase/firestore.ts` (typed `siteSections`/`trustedLogos` accessors)
- `lib/firebase/storage.ts` (logo upload/delete)
- `components/trusted-by/TrustedBy.tsx`, `TrustedBy.module.css`, `LogoMarquee.tsx`
- `lib/validation/logoUpload.ts` (Zod schema: file type/size, name, alt text)
- `firestore.rules`, `storage.rules` (finalized: admin-write, public-read for active logos only)

**Implementation tasks**:
1. Resolve OD-06 (admin auth method + authorized account list) before building sign-in.
2. Implement Firebase Auth sign-in for `/admin`; redirect unauthenticated visitors to `/admin/login`.
3. Define Firestore schema exactly as in §18 (`siteSections/trustedBy`, `trustedLogos/{logoId}`).
4. Write `firestore.rules`/`storage.rules`: public read of `trustedLogos` where `active === true` and `siteSections/trustedBy`; writes restricted to authenticated admin UIDs.
5. Build `LogoUploadForm.tsx`: file picker (SVG/PNG/WebP, ≤2MB via Zod validation), name field, auto-generated alt text (editable), before/after preview, upload to Storage + Firestore doc creation.
6. Build `LogoManager.tsx`: list of logos with enable/disable toggle, move up/move down (or drag-and-drop) reordering writing `sortOrder`, delete (Storage file + Firestore doc, with confirmation).
7. Build `SectionToggle.tsx`: ON/OFF control writing `siteSections/trustedBy.enabled`.
8. Build public `TrustedBy.tsx`: reads `siteSections/trustedBy`; if disabled or no active logos, renders `null` (§12 empty-state logic); otherwise renders `LogoMarquee.tsx`.
9. Build `LogoMarquee.tsx`: duplicated logo sequence, `translateX(0)→translateX(-50%)` linear loop (desktop 30–34s / mobile 34–40s per DEC-007), auto-repeat collection if too few logos to fill viewport, hover-to-pause, decorative duplicate hidden from screen readers.
10. Implement reduced-motion fallback: static horizontally-scrollable strip.
11. Implement silent-failure behavior: any Firestore/Storage error hides the section, logs to console only (no user-facing error UI) per §12/§18/§21.

**Data/schema changes**: `siteSections/trustedBy`, `trustedLogos/{logoId}` (both defined in §18) — first schema introduced in the project.

**Responsive requirements**: Marquee logo sizing (28–40px desktop / 22–30px mobile), spacing (`clamp(40px,6vw,90px)`), admin panel usable on desktop (mobile admin UX not required unless OD-07 specifies otherwise).

**Animation requirements**: Marquee linear loop per DEC-007; hover pause; reduced-motion static fallback; no plate animation in this section (§12).

**Accessibility requirements**: Admin forms fully labeled and keyboard-operable; public marquee logos have meaningful alt text; decorative duplicate `aria-hidden`; admin route is `noindex` (ties into Phase 9 SEO work, but the meta tag should be added now since the route exists).

**Tests**:
- Vitest: Zod upload validation (rejects oversized/wrong-type files); Firestore accessor functions (mocked); reorder logic produces correct `sortOrder` sequence.
- Playwright: admin login flow (success/failure); upload → appears in public marquee; disable logo → disappears from marquee; toggle section OFF → section disappears from homepage entirely; toggle ON with zero active logos → section stays hidden.
- Failure testing: simulate Firestore read failure → section hides silently, no visible error; simulate Storage upload failure → admin sees a clear (admin-only) error, public site unaffected.
- Reduced-motion: marquee becomes static scrollable strip.
- Accessibility: screen-reader pass confirms logos announced once (not doubled), admin forms navigable by keyboard.

**Exit criteria**: Full loop works end-to-end — admin uploads/toggles, public homepage reflects changes without redeploy; empty and error states degrade silently on the public side; security rules verified (unauthenticated writes rejected).

**Risks**: Firestore security rules misconfiguration exposing write access; logo aspect-ratio/color inconsistency across uploads (mitigated by the normalization treatment in §12); admin auth method choice (OD-06) affects onboarding friction for the actual Assetly admin user.

**Open decisions**: OD-06, OD-07, OD-11 (content population is post-launch, not a build blocker).

---

## Phase 4 — Compare experience

**Objective**: Build the four-slide Lease vs. Loan vs. Purchase argument sequence with the scroll-synced, context-aware calculator drawer. Highest interaction complexity in the project — isolate and test thoroughly before moving on.

**Inputs/dependencies**: Phase 2 complete (reuses `Plate.tsx`, RAF/scroll infrastructure patterns). `SOURCE_OF_TRUTH.md` §13.

**Components/files**:
- `components/compare/CompareSection.tsx` (wraps all 4 slides + drawer)
- `components/compare/ArgumentSlide.tsx` (×4 instances, content-driven)
- `components/compare/CalculatorDrawer.tsx`, `CalculatorDrawer.module.css`
- `content/compare/slides.ts` (typed content: headline, copy, plate ref, calculator row data per slide — the 4 slides from §13)
- `content/plates/compare-plates.tsx` (Lease/Loan/Purchase plate artwork ×4, reusing `Plate.tsx`)
- `lib/motion/useScrollFocus.ts` (shared RAF loop: distance-from-viewport-center → opacity/blur/translateY per active slide)
- `lib/motion/useDrawerOpenness.ts` (continuous 0–1 openness value keyed to scroll position between measured zones, with manual-override state)

**Implementation tasks**:
1. Build `content/compare/slides.ts` with the exact 4 slides' copy/data from §13 (Upfront Cash, Risk of Obsolescence, Tax Treatment, Leverage Impact) — do not paraphrase the locked headlines/copy.
2. Build `ArgumentSlide.tsx`: plate + index number + headline (DM Serif Display, one italic word) + supporting copy (DM Serif Text), min-height ~104svh on desktop.
3. Implement `useScrollFocus`: single shared RAF loop computing each slide's distance from viewport center, driving opacity/blur/translateY so the on-screen slide is sharp and neighbors dim/blur (§13 left-content focus effect).
4. Build `CalculatorDrawer.tsx`: desktop right-side drawer (`width: clamp(340px,44vw,640px)`, Field background), minimal chevron tab (no text, `›`/`‹`), and one persistent 3-column qualitative bar graph. The graph keeps its DOM frame while 30% / 60% / 92% `low` / `mid` / `high` tiers and approved outcome text transition with the active slide; it has no coefficients, computed figures, or value input (DEC-023).
5. Implement `useDrawerOpenness`: continuous openness value from scroll position across the hero-bottom→value-grid-top zone with soft ~40vh easing bands; content reflow (`width: 100-openness*44%` on desktop argument slides); manual override on tab click (500ms cubic ease-out tween, silences auto-sync until re-triggered).
6. Implement calculator mode auto-sync: whichever slide has focus (from `useScrollFocus`) sets the drawer's active data set; transition fade + 4–8px vertical movement, 700–900ms, `--e`.
7. Implement per-slide plate draw-on-activation (reusing `Plate.tsx` from Phase 2), 2.6s.
8. Build mobile variant: bottom sheet (34–42svh expanded, 42vh max), tiny centered triangle handle (`▼`/`▲`, ~44px touch target), stable height across slide changes (content settles → plate draws → values transition → height stays fixed — no repeated push up/down).
9. Implement section entry (drawer hidden pre-Hero-exit, opens as Slide 01 approaches) and exit (drawer slides away approaching Why Us, narrative returns to full width).
10. Build the approved 200×130 Compare plate set: adapt three argument plates from archived `reference/home-2.html` and author Tax Treatment's missing ledger-to-recurring-line drawing in the same drafting language (**resolves OD-03**; DEC-022).
11. Archive `home-2.html` and `2-duty-cycle.html` under `reference/`, outside the build, superseding DEC-016's now-invalid premise (DEC-021).

**Data/schema changes**: None (static content per DEC-011).

**Responsive requirements**: Desktop drawer vs. mobile bottom sheet are structurally different components sharing the same data/state, not one component with CSS-only breakpoint changes (per §9's "intentionally recomposed" principle) — mobile height must stay stable across slide transitions.

**Animation requirements**: Full §13 animation set — argument focus effect, plate draws, drawer openness scrubbing, calculator content transitions, manual-override tween. All reduced-motion-safe (openness becomes a snap to final state, plate shows fully drawn, focus effect may be disabled or reduced to opacity-only).

**Accessibility requirements**: Drawer tab has `aria-expanded`/`aria-controls`; calculator mode is programmatically associated with the currently-focused slide for screen readers (e.g. `aria-live="polite"` region announcing mode changes, used sparingly to avoid noise); keyboard users can navigate slides via normal scroll/tab order without being trapped by the RAF focus effect; touch targets meet the 44px minimum on mobile drawer controls.

**Tests**:
- Vitest: `useDrawerOpenness` math (zone boundaries, easing bands, override behavior) unit-tested independent of DOM; slide-to-calculator-mode mapping and qualitative tier logic.
- Playwright: scrolling through all 4 slides updates calculator content and bar tiers correctly while preserving one graph node; manual drawer toggle works and persists (closed stays closed) until reopened; mobile bottom sheet maintains stable height across slide transitions; desktop drawer reflows content width correctly.
- Responsive: full pass at mobile/tablet/laptop/desktop.
- Performance: RAF loop doesn't cause dropped frames/jank during scroll (profile during test).
- Reduced motion: openness/focus/plate animations collapse appropriately, drawer still functionally usable.

**Exit criteria**: All 4 slides display correct locked copy/data; calculator auto-syncs correctly on scroll and supports manual override; mobile bottom sheet is stable (no layout jump); plates draw meaningfully; reduced-motion fallback confirmed; no dropped-frame regressions in profiling.

**Risks**: This is the highest-complexity phase — RAF-driven scroll math is easy to get subtly wrong (drawer opening at the wrong scroll position, mode desync). Budget extra QA time. Qualitative bars must never acquire prototype coefficients or be described as measured financial magnitudes.

**Open decisions**: OD-13 (disclaimer wording, if any; not a Phase 4 implementation blocker).

---

## Phase 5 — Why Us

**Objective**: Build the T/F/S/P flip-card grid.

**Inputs/dependencies**: Phase 1 (uses `RevealOnScroll`). `SOURCE_OF_TRUTH.md` §14.

**Components/files**:
- `components/why-us/WhyUsSection.tsx`, `FlipCard.tsx`, `WhyUs.module.css`
- `content/why-us/values.ts` (T/F/S/P front + back content, exact copy from §14)

**Implementation tasks**:
1. Build `content/why-us/values.ts` with the 4 values' locked front/back copy from §14.
2. Build `FlipCard.tsx`: front face (oversized letter + value name) and back face (explanation), `perspective` container, `backface-visibility:hidden` on both faces, `rotateY(0→180deg)` 0.8–1.0s `--eio` on click/tap.
3. Implement independent per-card flip state (multiple cards can stay flipped simultaneously, no accordion).
4. Implement desktop hover micro-feedback (contrast raise, 1–2px inward nudge, tiny arrow indicator) without triggering flip.
5. Build the 2×2 shared-border ledger grid (desktop) collapsing to 1-column (mobile), with `min-height` locked consistently across front/back so flip never shifts page layout.
6. Wire entry animation via `RevealOnScroll`: eyebrow/title fade in, 4 cells stagger (~0.12s), `opacity:0→1, translateY(16px)→0`. Cards never auto-flip on entrance.
7. Build section heading ("WHY US" eyebrow + "Why Assetly" serif heading).

**Data/schema changes**: None.

**Responsive requirements**: 2×2 desktop grid → 1-column mobile stack; mobile cards keep consistent min-height front/back.

**Animation requirements**: Flip mechanics + entry stagger per §14, reduced-motion-safe (flip becomes an instant cross-fade or instant state swap rather than a 3D rotation when `prefers-reduced-motion: reduce`).

**Accessibility requirements**: Each card is a native button triggering flip on Enter/Space as well as click/tap; `aria-pressed` exposes state. Per DEC-024, the visual 3D faces stay outside the accessibility tree, the button retains the value name, and its explanation is exposed as a polite description only while flipped. Touch targets remain appropriately sized on mobile.

**Tests**:
- Vitest: flip-state logic (independent per-card, no unintended coupling).
- Playwright: click/tap flips only the targeted card; keyboard Enter/Space flips the focused card; multiple cards can be simultaneously flipped; mobile flip doesn't cause layout jump (measure bounding box before/after).
- Reduced motion: flip degrades to instant/cross-fade.
- Accessibility: keyboard-only pass flips all 4 cards; screen-reader spot check on back-face content reachability.

**Exit criteria**: All 4 cards flip correctly and independently on click/tap and keyboard; no layout jump on mobile; reduced-motion fallback confirmed; entry stagger works and never auto-flips.

**Risks**: 3D CSS transforms (`perspective`/`backface-visibility`) have known cross-browser quirks — verify in at least two engines (Chromium + WebKit via Playwright projects).

**Open decisions**: None blocking.

---

## Phase 6 — Sectors

**Objective**: Build the auto-rotating 4-of-6 sector grid.

**Inputs/dependencies**: Phase 2 (reuses `Plate.tsx`). `SOURCE_OF_TRUTH.md` §15.

**Components/files**:
- `components/sectors/SectorsSection.tsx`, `SectorCard.tsx`, `Sectors.module.css`
- `content/sectors/sectors.ts` (6-sector pool: name, short descriptor, plate ref)
- `content/plates/sector-plates.tsx` (6 plate artworks, reusing `Plate.tsx`)
- `lib/motion/useOneOutOneIn.ts` (rotation scheduler: pool of 6, 4 visible slots, one slot swaps every 2.5s)

**Implementation tasks**:
1. Build `content/sectors/sectors.ts` with the 6 sectors from §15 (Commercial Interiors, Manufacturing, Construction, Hospitality, Healthcare, IT Equipment & IT Infrastructure) — short descriptors only, no fabricated statistics.
2. Author/source the 6 sector plate artworks per §15's per-sector geometry direction (**resolves OD-04** when complete).
3. Build `useOneOutOneIn`: maintains 4 visible slot indices into the 6-item pool; every 2.5s, picks the next slot to rotate, fades it out (~450ms + `translateY(10px)`), swaps content, fades back in — never refreshes the whole grid at once.
4. Build `SectorCard.tsx`: index/label (Inter Tight) + sector name (DM Serif Display) + optional short descriptor (DM Serif Text, desktop only) + plate (draws once on entering a slot, 2.6s).
5. Build 2×2 desktop / 1×4 mobile shared-border ledger grid, no gaps, equal card heights.
6. Implement entrance sequence: heading fades in → 4 cards stagger reveal → initial plates draw → auto-rotation starts after entrance settles.
7. Implement desktop hover: pause rotation, slightly raise plate opacity, no scale/movement. Mobile: no hover dependency, rotation continues passively.

**Data/schema changes**: None.

**Responsive requirements**: 2×2 desktop → 1×4 vertical mobile, both showing exactly 4 of 6 sectors at any moment.

**Animation requirements**: One-out-one-in rotation (2.5s interval, 450ms fade+translateY swap) + plate draw (2.6s) per §15. Under reduced motion, render the initial four sectors and completed plates without creating the rotation timer (DEC-025).

**Accessibility requirements**: The grid is one focusable region with a visible focus state and `aria-live="off"`; focus pauses rotation. The four passive cards do not become separate tab stops (DEC-025).

**Tests**:
- Vitest: `useOneOutOneIn` scheduler produces correct one-at-a-time rotation over a simulated pool of 6/visible 4, never double-swapping simultaneously.
- Playwright: rotation cadence approximates 2.5s per swap; hover pauses rotation (desktop); focus pauses rotation (keyboard); mobile rotation continues without hover.
- Reduced motion: rotation behavior degrades per the documented approach, verified visually.
- Responsive: 2×2 vs 1×4 layouts confirmed at breakpoints.

**Exit criteria**: Rotation is correct, one-at-a-time, never a full-grid refresh; hover/focus pausing works; plates are meaningful (§15 direction) and draw correctly; reduced-motion and accessibility passes complete.

**Risks**: `setInterval`-based rotation can drift or double-fire if not cleaned up correctly on unmount/re-render — prefer a single scheduler instance guarded by `useEffect` cleanup. OD-04 (plate artwork) is a real design deliverable.

**Open decisions**: None blocking; `OD-04` resolved by DEC-025.

---

## Phase 7 — Contact

**Objective**: Build the Contact section: info block, custom Bengaluru map, sliding enquiry drawer, and Gmail-compose generation.

**Inputs/dependencies**: Phase 1 (shell). `SOURCE_OF_TRUTH.md` §16.

**Components/files**:
- `components/contact/ContactSection.tsx`, `ContactMap.tsx`, `ContactDrawer.tsx`, `ContactSheet.tsx`
- `components/contact/EnquiryFlow.tsx`
- `content/contact/enquiryTypes.ts` (the 4 categories per DEC-003 + conditional field definitions)
- `lib/validation/contactForm.ts` (Zod schemas per enquiry type)
- `lib/email/buildEmailDraft.ts` (one recipient/subject/body source for Gmail and mailto)
- `lib/a11y/useFocusTrap.ts` (shared by the mobile menu and Contact dialogs)

**Implementation tasks**:
1. Build static left-side info block: CONTACT label, "Let's talk." heading, Email (clickable `mailto:`), Phone (tap-to-call `tel:`), "Bengaluru" location line — no full address here.
2. Author the illustrative, non-cartographic Bengaluru map visual per §16 and DEC-026 (**resolves OD-08**) — warm muted inline SVG treatment, Assetly marker, no external map data or third-party embed.
3. Build `ContactDrawer.tsx`: minimal "CONTACT ›" handle on the map edge, slides in (`translateX`, 700–900ms `--eio`) revealing the enquiry flow, map stays partially visible.
4. Build `content/contact/enquiryTypes.ts` with the 4 DEC-003 categories + their conditional field definitions (Operating Lease/Asset Requirement → asset+value; Existing Requirement → reference note; General Enquiry → message).
5. Build the type step in `EnquiryFlow.tsx`: large selectable rows (01–04) + "Something else…" custom field.
6. Build the details step in `EnquiryFlow.tsx`: Name/Company/Email/Phone(optional) always, plus the conditional fields for the selected type; underline-style inputs with focus states (line strengthens, Bottle accent, label shift, no glow/thick border).
7. Build `lib/validation/contactForm.ts`: Zod schema per enquiry type (required vs. optional fields).
8. Build `buildEmailDraft.ts`: template one recipient/subject/body payload, then derive identically encoded Gmail and mailto URLs targeting `finance@assetly.lease`.
9. Wire primary "Open in Gmail →" action and secondary "Use another email app" fallback.
10. Build mobile variant: bottom sheet (not side drawer) with visual grip and explicit Close control, Step 1 → Step 2 → action, full-width fields; no drag gesture.
11. Implement section entrance sequence (label → heading → info stagger → map fade/draw → handle appears last).
12. Factor focus trapping, Escape, focus return, and scroll locking into one shared hook; migrate the mobile menu and reuse it for both Contact panels without changing menu visuals.

**Data/schema changes**: None (no Firestore write on submission — DEC-012).

**Responsive requirements**: Desktop ~40/60 split; mobile full vertical recomposition with bottom sheet per §16.

**Animation requirements**: Drawer slide (700–900ms `--eio`), step transitions (fade + 8–12px movement, 500–700ms), entrance stagger — all reduced-motion-safe.

**Accessibility requirements**: Form fields properly labeled (not placeholder-only labels); step navigation announced to screen readers; drawer/bottom-sheet focus management (focus moves into the panel on open, returns on close); Gmail/mailto links have clear accessible names; tap-to-call/email links use correct `tel:`/`mailto:` schemes.

**Tests**:
- Vitest: `buildGmailUrl`/`buildMailto` produce correctly encoded URLs matching the §16 example for each enquiry type; Zod schemas correctly require/allow the right fields per type.
- Playwright: full flow — select type → fill details → click "Open in Gmail →" → verify constructed URL/window target; fallback "Use another email app" produces a working `mailto:` link; mobile bottom sheet opens/closes correctly with stable scroll behavior; invalid/incomplete form blocks submission with clear messaging.
- Failure testing: Gmail URL construction with edge-case input (special characters, very long asset descriptions) doesn't break encoding.
- Responsive + accessibility passes.

**Exit criteria**: All 4 enquiry types (+ custom) produce correct, correctly-encoded Gmail and mailto drafts; mobile bottom sheet behaves correctly; no full address or excluded content (§16 exclusion list) appears in this section.

**Risks**: URL length limits on `mailto:`/Gmail compose links for very long custom messages — bounded by the approved Zod field limits and covered by encoded-draft tests.

**Open decisions**: None blocking; `OD-08` resolved by DEC-026.

---

## Phase 8 — About page

**Objective**: Build the simple standalone `/about` page.

**Inputs/dependencies**: Phase 1 (Nav/Footer must support About Us` navigation). `SOURCE_OF_TRUTH.md` §4.

**Components/files**:
- `app/(site)/about/page.tsx`, `About.module.css`
- `content/about/copy.ts`

**Implementation tasks**:
1. Build `content/about/copy.ts` with the concise, source-grounded description from §4 (no fabricated stats/timeline/founders content).
2. Build the large hero media treatment (55–65% of section) + DM Serif Display heading + DM Serif Text body. Until `OD-14` is resolved, render the owner-approved, clearly labelled placeholder from DEC-027; keep it out of the accessibility tree and do not invent alt text.
3. Include optional small location/contact line at the bottom (Bengaluru reference, consistent with Contact §16 — not a duplicate full form).
4. Reuse Nav/Footer from Phase 1 unmodified; confirm About Us footer link and Nav About link both resolve correctly to `/about`.
5. Apply very subtle reveal animation only (per DESIGN_SYSTEM.md's general reveal language) — this page is intentionally the least animated in the site.

**Data/schema changes**: None.

**Responsive requirements**: Image/text relationship recomposes sensibly mobile vs. desktop (image above text on mobile, or side-by-side per available width).

**Animation requirements**: Minimal — single subtle reveal on scroll-into-view, reduced-motion-safe trivially (little to neutralize).

**Accessibility requirements**: Hero image has meaningful alt text; heading hierarchy correct (single `h1`); page has correct `<title>`/meta description (ties into Phase 9).

**Tests**:
- Playwright: `/about` renders correctly, Nav/Footer identical component instances to `/`, About Us link from both header and footer navigates correctly, and the responsive media state is valid. While DEC-027 is active, assert the placeholder is explicitly marked and hidden from assistive technology; once `OD-14` is resolved, replace that assertion with intrinsic image dimensions and factual alt text.
- Responsive pass.

**Exit criteria**: `/about` is live, uses the same shell, contains only the approved minimal content, and is reachable from both Nav and Footer. DEC-027 permits Phase 8 to exit with the temporary media slot; the real `next/image` asset remains mandatory before Phase 10 exits or production deployment.

**Risks**: Temptation to over-build this page beyond "simple" — resist per the §4 non-goals (no timeline/stats/founders unless supplied).

**Open decisions**: `OD-14` remains open but no longer blocks the layout/content implementation or Phase 8 commit under DEC-027. It blocks Phase 10 exit and production deployment. Do not substitute stock, generated, logo-based, or abstract artwork.

---

## Phase 8.5 — Hero loader / opening sequence

**Objective**: Build the brand-signature opening loader (DEC-013) that now precedes the Hero's own reveal: a Pitch-background "A" + tagline opening, slow double blink, recede, and settle into the Hero's final "A" position, after which the Hero proposition/tagline/plate reveal (built in Phase 2) fires.

**Inputs/dependencies**: Phase 2 complete (Hero component, its final "A" position/markup, and the plate system already exist). Deliberately scheduled after Phase 8 (About) rather than immediately after Phase 2, per DEC-013 — the rest of the site shell should be stable before this polish layer goes on. `SOURCE_OF_TRUTH.md` §11a.

**Components/files**:
- `components/hero/HeroLoader.tsx`, `HeroLoader.module.css`
- `lib/motion/useHeroLoaderSequence.ts` (state machine: blink → blink → recede → settle → reveal; drives the hand-off to Hero's existing entrance)
- Modify `components/hero/Hero.tsx` to accept a "start reveal" trigger from `HeroLoader` instead of firing its interim mount animation unconditionally

**Implementation tasks**:
1. Build `HeroLoader.tsx`: full-screen Pitch `#21241A` overlay, centered "A" (DM Serif Display, Ivory `#E7E3D4`) + "ACCESS · SCALE · GROW" (Inter Tight, Khaki `#B1AD77`) beneath it. No navbar, no Hero content, no plate visible yet.
2. Implement the slow double blink on the "A" only (visible → dim ~20–30% → visible → pause → dim → visible, ~0.8–1.0s per blink); tagline stays fully static.
3. Implement the recede (scale down + apparent backward movement, no morph/mask/shape transform) immediately following the second blink.
4. Implement the settle: animate the "A" from its opening position to its final Hero-anchored position (central screen axis), stopping completely before anything else appears.
5. Wire the hand-off: once settle completes, trigger Hero's existing proposition/tagline reveal (Phase 2's interim entrance, now gated behind this instead of firing on mount) and let the plate become quietly visible per §11a point 8.
6. Implement `prefers-reduced-motion: reduce` fallback: skip blink and recede entirely, load directly into the final Hero state via a short, subtle fade.
7. Verify no layout shift between the loader's "A" and the Hero's settled "A" (same element/position, not a swap between two different nodes where avoidable).
8. Verify reload and back-navigation behavior (loader should not awkwardly replay on every internal navigation back to `/` — confirm and document the chosen behavior, e.g. session-scoped "seen" flag, in `PROGRESS.md` when implemented).

**Data/schema changes**: None.

**Responsive requirements**: "A" scale/position correct at mobile widths down to 320px; no overflow or clipping during recede/settle on small screens.

**Animation requirements**: Full §11a motion hierarchy (points 1–9); reduced-motion fallback per §11a point 11 — this is mandatory, not optional polish, consistent with §8's standing rule.

**Accessibility requirements**: Loader content is not read as a false "loading" state to screen readers (e.g. avoid `role="status"`/`aria-busy` semantics that imply indefinite loading); once settled, focus/reading order proceeds normally into the Hero; decorative "A"/tagline during the opening are appropriately hidden/exposed to assistive tech so the real Hero heading (`h1`) is what gets announced as page content.

**Tests**: Full §11a "Testing requirements" list — correct Pitch/Ivory/Khaki colors and contrast; exact two-blink count; tagline static during blink; "A" never fully disappears; "A" visibly moves toward its Hero destination; "A" settles before Hero content appears; no navbar during opening; no plate competition during opening; no layout shift between loader and Hero; mobile scale/position; reload behavior; back-navigation behavior; slow-device performance; reduced-motion behavior.

**Exit criteria**: Loader plays correctly on first load, hands off cleanly into the existing Hero reveal with no layout shift, respects reduced-motion, and passes the full §11a test list; old Hero-mounts-directly-into-reveal behavior from Phase 2 is confirmed fully superseded (DEC-013).

**Risks**: Getting the "A" hand-off position pixel-perfect between the loader's coordinate space and the Hero's layout can be fiddly — consider using the same DOM node moved via FLIP/transform rather than two separate elements crossfading. Reload/back-navigation replay behavior is easy to get wrong (annoying repeat plays) — decide and document explicitly rather than leaving it as an accidental default.

**Open decisions**: None blocking — spec is fully locked per DEC-013.

---

## Phase 9 — Legal / basic SEO

**Objective**: Add Privacy Policy, Terms of Use, and site-wide SEO metadata.

**Inputs/dependencies**: Phases 1–8 substantially complete (routes exist to attach metadata to). `SOURCE_OF_TRUTH.md` §22–§23.

**Components/files**:
- `app/(site)/privacy/page.tsx`, `app/(site)/terms/page.tsx`
- `app/sitemap.ts`, `app/robots.ts`
- Per-route `metadata` exports (`app/(site)/page.tsx`, `app/(site)/about/page.tsx`, `app/admin/layout.tsx`)
- `content/legal/privacy.ts`, `content/legal/terms.ts`

**Implementation tasks**:
1. Write generic, non-fabricated Privacy Policy and Terms of Use placeholder copy (resolve/flag OD-09 — mark clearly as placeholder pending real legal text, do not invent entity/jurisdiction specifics beyond what's already established).
2. Wire Footer's Privacy Policy / Terms of Use links to the new routes.
3. Add per-route `metadata` (title, description) for `/` and `/about`.
4. Add canonical tags for public routes.
5. Add Open Graph tags for `/` and `/about`.
6. Build `app/sitemap.ts` covering only `/` and `/about`.
7. Build `app/robots.ts` allowing public routes, disallowing `/admin`.
8. Add `noindex` metadata to `/admin` (and confirm it's excluded from the sitemap — should already be true from step 6).
9. Revisit OD-10 (Cookie Policy) — confirm still not required (no analytics/consent system introduced); if it becomes required, add the page and Footer link at that time.

**Data/schema changes**: None.

**Responsive requirements**: Legal pages use the same simple typographic treatment as About — no special layout needs.

**Animation requirements**: None beyond the standard subtle reveal, if any.

**Accessibility requirements**: Legal pages have correct heading hierarchy; `noindex` on `/admin` doesn't affect its actual accessibility (still reachable/usable, just not indexed).

**Tests**:
- Playwright: `/privacy` and `/terms` render and are linked correctly from the Footer; `/sitemap.xml` and `/robots.txt` return valid content; `/admin` response includes `noindex` meta/header.
- SEO smoke check: verify OG tags render correctly when the homepage URL is inspected (e.g. via a social-preview validator, manually).

**Exit criteria**: Legal pages live with clearly-generic placeholder copy; sitemap/robots/canonical/OG all correct; `/admin` confirmed non-indexable.

**Risks**: Shipping placeholder legal copy that reads as if it were real legal advice — keep language visibly generic/minimal per §23 until real text is supplied.

**Open decisions**: OD-09, OD-10.

---

## Phase 10 — Accessibility, performance, and QA

**Objective**: Full-site audit and regression pass across everything built in Phases 1–9.

**Inputs/dependencies**: Phases 1–9 complete.

**Implementation tasks (audit checklist, not new features)**:
0. Resolve `OD-14`: replace the About placeholder with the real, usage-approved `next/image` asset and its supplied factual alt text before this phase can exit.
1. Keyboard: tab through the entire site (`/`, `/about`, `/admin`) confirming logical order, visible focus, no traps (especially Compare's scroll-focus effect and Contact's drawer/bottom-sheet).
2. Focus management: verify drawer/overlay/bottom-sheet components (Nav mobile menu, Compare drawer, Contact drawer/sheet) correctly move and restore focus.
3. Screen reader pass (at least one of NVDA/VoiceOver) across all sections, confirming: alt text, ARIA states (`aria-expanded`, `aria-pressed`), no doubled marquee announcements, form labels.
4. Touch targets: confirm all interactive controls meet ~44px effective hit area on mobile, especially the Compare/Contact drawer handles and Sectors' (non-interactive, passive) rotation.
5. Reduced motion: verify every animated component (Nav, Hero plate, Compare drawer/focus/plates, Why Us flip, Sectors rotation, Trusted By marquee, Contact drawer) correctly neutralizes under `prefers-reduced-motion: reduce`.
6. Layout stability (CLS): verify Trusted By, Compare mobile calculator, and Why Us flip cards never cause unexpected jumps.
7. Mobile browser behavior: real-device or emulated pass on iOS Safari and Android Chrome for scroll-driven components (Compare drawer, Sectors rotation, Contact bottom sheet).
8. Animation performance: profile Compare's RAF loop and Hero's ambient drift for dropped frames during scroll.
9. Firebase failure states: re-verify Trusted By's silent-degradation behavior (Phase 3 tests) still holds after full-site integration.
10. Essential Playwright journey suite: one representative critical path per homepage feature, About,
    admin auth, responsive/reduced-motion behavior, and Contact drafting. Keep detailed calculations
    and state logic in Vitest; do not multiply E2E cases across nearby widths, animation micro-timings,
    or browser engines (DEC-063).
11. Lighthouse pass on `/` and `/about` (performance, accessibility, best practices, SEO scores) — record scores in `PROGRESS.md`.

**Tests**: This phase *is* the test pass — see tasks above. All results recorded in `PROGRESS.md` per the root testing mandate (bugs found, fixes applied, retested, recorded).

**Exit criteria**: `OD-14` is resolved with the approved About photograph and factual alt text; no critical accessibility failures; no reduced-motion gaps; no CLS regressions; Lighthouse scores recorded and any sub-90 performance/accessibility score has a documented reason or follow-up task; the essential Playwright journey suite is green.

**Risks**: This phase tends to surface issues that require revisiting earlier phases' components — budget time for fixes, not just findings. Do not mark Phase 10 complete on "found issues" alone; issues must be fixed and retested.

**Open decisions**: None new — this phase should surface whether any `OPEN DECISION` from `SOURCE_OF_TRUTH.md` §25 is now blocking and needs escalation.

---

## Phase 11 — Deployment

**Objective**: Ship to production via Firebase App Hosting.

**Inputs/dependencies**: Phase 10 passed. OD-05 (Firebase project/env split) and OD-12 (domain) resolved.

**Implementation tasks**:
1. Finalize environment configuration for staging and production Firebase projects (or environment-scoped config within one project, per OD-05's resolution).
2. Deploy to staging first; run the Phase 10 regression checklist against staging.
3. Connect production domain (OD-12).
4. Finalize production `firestore.rules`/`storage.rules` (confirm no debug/permissive rules leaked from development).
5. Deploy to production via Firebase App Hosting.
6. Run one final smoke test against the live production URL: home page loads, all 8 sections render, About loads, admin login works, Trusted By reflects current admin state, Contact produces a correct Gmail draft.

**Data/schema changes**: None beyond what Phase 3 already defined; confirm production Firestore/Storage are seeded appropriately (even if empty — Trusted By must degrade correctly with zero logos, per §12).

**Responsive requirements**: Final smoke test includes a real mobile-device check, not just emulation.

**Animation requirements**: None new — confirm production build doesn't strip/break any animation (e.g. due to CSS purging or bundling differences from dev).

**Accessibility requirements**: Re-run a quick keyboard/screen-reader spot check on production (configuration differences between environments can sometimes affect asset loading/behavior).

**Performance requirements**: Production Lighthouse run — should match or exceed staging scores from Phase 10.

**Tests**: Full smoke test (manual + Playwright against the production URL where feasible); security-rules verification in production (attempt an unauthenticated write, confirm rejection).

**Exit criteria**: Production site live at the final domain, passes the smoke test, security rules verified, Lighthouse scores recorded.

**Risks**: Environment variable drift between staging and production; DNS/domain propagation delays; production security rules accidentally left permissive.

**Open decisions**: OD-05, OD-12 must be resolved before this phase can complete.
