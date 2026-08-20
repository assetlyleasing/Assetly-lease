# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6. Keep it operational and concise — a future agent should be able to read only this file plus `EXECUTION_ORDER.md` and know exactly where to pick up.

---

## Current Phase

Phase 4 — Compare experience: **complete**, with one item honestly partial (`COMPARE-010`: the four plate artworks ship, but `OD-03` stays open for design review — the same standing `HERO-002` has). Phases 0, 1 and 2 are complete.

Phase 3 (Trusted By) remains **blocked** on `OD-05`/`OD-06`. Phase 5 (Why Us) is unblocked and is the recommended next phase — it depends only on Phase 1's `RevealOnScroll`.

## Current Task

`WHY-001` — build `content/why-us/values.ts` with the locked T/F/S/P front and back copy from §14 (Phase 5)

## Status

The homepage now has real chrome, a real Hero, and the highest-complexity section in the project. `/` renders the navigation, the Hero, the four-argument Compare sequence with its scroll-scrubbed calculator, three placeholder landmarks, and the footer; `/about` renders the same shell around a placeholder.

Everything green: lint, typecheck, `next build`, 68 unit tests, 76 Playwright tests.

## Completed This Cycle

### Phase 4 — the Compare experience

**One scroll loop, not two.** §8 and §13 both call for a single `requestAnimationFrame` loop, and `lib/motion/useScrollTick.ts` is it: one frame request, one scroll listener and one resize listener shared by every subscriber, module-scoped. Subscribers supply a `read` and a `write` rather than one callback, and the loop runs **all** reads before **any** writes — a task that measures the DOM after another task has written to it forces a synchronous layout, and doing that once per subscriber per frame is exactly the jank Phase 4 asked to profile for. The manual-override tween advances on time rather than scroll, so it pumps the same loop itself while it is still moving.

**The math is separate from the DOM.** `lib/motion/drawerOpenness.ts` and `lib/motion/scrollFocus.ts` are pure functions of numbers — no React, no elements — because `MASTER_PLAN.md` required the zone boundaries, easing bands and override behaviour to be unit-tested "independent of DOM". They are, in 40 assertions that never open a browser.

**The openness model.** The panel is open for exactly as long as the Compare section owns the whole screen, easing in over the last 40vh before it does and out over the first 40vh after it stops. Both ramps are bounded by the section's own edges reaching the far side of the viewport. That boundary was chosen deliberately and is the subject of the first defect below.

**Manual override behaves as §13 describes.** Clicking the tab tweens over 500ms cubic ease-out and then holds — auto-sync goes silent permanently, so a panel the visitor closed stays closed while they read all four arguments, and the reading inside it keeps following them. Reopening starts from wherever the previous tween had reached, not from a snap.

**Desktop drawer and mobile sheet are separate components** sharing all of their data and state, per §9's recomposition principle and `MASTER_PLAN.md`'s explicit instruction — the mechanisms travel on different axes and are not one component under a media query. Which one renders is decided by `useMediaQuery`, built on `useSyncExternalStore` so there is no hydration mismatch and no `set-state-in-effect` contortion; it returns `null` until the client knows the viewport, and neither variant renders in that frame rather than the wrong one rendering and swapping.

**Mobile height is fixed in CSS, never derived from content**, and the argument slides reserve it as padding. A test asserts the sheet and the slides are the same height to the pixel across all four arguments, and that the sheet's top edge never crosses the copy's bottom.

**`Plate` was reused unmodified**, which Phase 2 made an exit criterion. The four artworks pass geometry only and share the hero plate's drafting conventions — a ground datum and a left-hand drawing edge — so the set reads as one continuous drawing. §11's Stage 3 allows hero geometry to carry into the first Compare plate, and slide 01 opens with the same datum, the same edge and the same open modular frame the hero used for "Access".

**Copy integrity is enforced**, following the Hero's pattern. `tests/unit/compareCopy.test.ts` reassembles the headline segments and asserts all four headlines, all four copy lines and all twelve calculator readings verbatim, that exactly one single word is emphasised per headline, and — specifically — that the obsolescence argument states no percentage, because §13 says "No artificial percentage here" and a plausible-looking figure is exactly the kind of thing added later to make a comparison feel concrete.

### Three defects found by looking, not by testing

The standing rule held again: every one of these passed the whole suite.

1. **The calculator opened beside the Hero.** The first openness model keyed both ramps to the viewport's bottom edge, which is symmetric and wrong: with the Hero's proposition still centred on screen the panel was already half open. DESIGN_SYSTEM §8 is emphatic that the calculator is invisible during the Hero "no matter what". Both the ramp and `computeActive` now key to the section's edges reaching the *far* side of the viewport, so the panel finishes opening a few pixels before Slide 01 reaches the centre line. Four unit tests now pin the Hero end of that window explicitly.
2. **The argument column was capped at roughly 390px on a 1440px screen.** `max-width: 46ch` on the body resolves `ch` against the *body* font while the headline is set two and a half times larger, so every headline ran four and five lines deep in a third of the space it had. The measure is now a `clamp()` sized for the narrowed column, and the headline uses DESIGN_SYSTEM §9's statement-slide range rather than `SerifHeading`'s section step, whose upper end is set against the full page width and overshoots badly once the drawer has taken 44% of it.
3. **The fixed nav covers the top of any section scrolled to from a nav link.** Not a Compare bug — a real defect in Phase 1's chrome that Compare exposed. `--nav-h` is the bar's height, but the header renders that plus a 10px inset above and below, so sections reserved 20px too little. `tests/e2e/shell.spec.ts` had been passing this by catching a frame mid-scroll. Fixed properly with `--nav-pad`/`--nav-block` (DEC-020); the section top now lands exactly at the header's bottom edge, measured.

### Decisions taken this cycle

- **DEC-019.** The calculator ships no bars, no magnitudes and no asset-value input, and its mode row jumps to an argument rather than switching the reading. §13 supplies qualitative outcomes and says "No artificial percentage here"; a bar has a height, and no supplied Assetly material contains a number to derive one from. The prototype's figures were illustrative placeholders and shipping them as a financial comparison would be fabrication.
- **DEC-020.** `--nav-block` is what sections clear; `--nav-h` remains the bar's own height. See defect 3.
- **`OD-13` opened** in `SOURCE_OF_TRUTH.md` §25: whether Compare needs a disclaimer line. §13's approved copy states tax outcomes as fact and the prototype carried an "illustrative disclaimer" element, but no wording has been supplied and none may be invented.

## Files Changed

New: `content/compare/slides.ts`; `content/plates/compare-plates.tsx`; `components/compare/` (`CompareSection`, `ArgumentSlide`, `CalculatorDrawer`, `CalculatorSheet`, `CalculatorPanel`, `Compare.module.css`, `Calculator.module.css`); `lib/motion/` (`drawerOpenness.ts`, `scrollFocus.ts`, `useDrawerOpenness.ts`, `useScrollFocus.ts`, `useScrollTick.ts`, `useMediaQuery.ts`); `tests/unit/` (`compareCopy.test.ts`, `drawerOpenness.test.ts`, `scrollFocus.test.ts`); `tests/e2e/compare.spec.ts`.

Modified: `app/(site)/page.tsx` (Compare replaces its placeholder), `app/globals.css` (the `.sr-only` primitive; `scroll-margin-top` now `--nav-block`), `styles/tokens.css` (`--nav-pad`, `--nav-block`), `components/nav/Nav.module.css`, `components/nav/MobileMenu.module.css`, `components/hero/Hero.module.css` (all three now clear `--nav-block`), and the planning documents.

No new dependencies. `zod` and `motion` (§19) are still **not** installed — Phase 7 is the first phase that needs `zod`, and nothing so far has needed `motion`.

## Tests Run

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass — 0 problems |
| Type check | `npm run typecheck` | Pass — clean |
| Unit | `npm run test` | Pass — 68/68 |
| End-to-end | `npm run test:e2e` | Pass — 76/76 |
| Production build | `npm run build` | Pass — all routes |
| RAF frame rate | scripted scroll through the section | Median 19.1ms, p95 25.6ms, 1 frame of 190 over 32ms, none over 50ms |
| Visual review | dev server, screenshots | Pass — desktop and mobile, all four arguments, entry, exit, manually closed, reopened, reduced motion |

The Compare suite covers: the four locked headlines with exactly one Moss italic each; plates `aria-hidden`, without an image role, drawing to `stroke-dashoffset: 0`; the calculator absent for the whole of the Hero; open by the time argument 01 is read; its reading, its mode row and its live region in sync scrolling both down and back up; the drawer gone before Why Us is properly on screen; manual close persisting across all four arguments and reopening; keyboard operation with a visible focus ring; the 44px touch minimum; the mode row jumping; the column narrowing without ever overlapping the panel; the focus effect sharp at centre and blurred either side; the mobile sheet using a triangle handle, holding a pixel-stable height, staying inside §13's 34–42svh band and never covering the copy; no horizontal overflow from 320px to 1920px; the RAF loop's frame rate; and under reduced motion — arguments present, sharp and unmoved, openness never fractional, plates drawn with `stroke-dasharray: none`, drawer still usable.

## Issues / Blockers

1. **`OD-03` — the four Compare plates are authored, not designer-supplied.** They read as: 01 a reserve frame with its retained level ruled across it and one small portion drawn out and dimensioned; 02 three frames on the datum — in service, sunk with a slack top edge, then new and taller — under a long replacement arc; 03 an unequal ledger schedule converging on one node and out into a single evenly ticked line; 04 §13's three forms in order, open framework, layered stack, hatched solid block, with the datum thickening beneath them. Genuine interpretations of §13's direction rather than placeholders, but `COMPARE-010` is `[~]`, not `[x]`, until reviewed.
2. **`OD-13` — no disclaimer under the Compare calculator.** See Decisions Needed.
3. **`OD-02` — the Hero plate is likewise authored, not designer-supplied.** Unchanged from last cycle.
4. **`OD-01` — still open despite a usable mark.** Raster, not vector; no favicon ships. Matters most for Phase 8.5, where the mark appears very large. Note also that the brand mark is a lower-case "a." whereas §11a repeatedly describes the loader's "**A**" — confirm the letterform before building Phase 8.5. **DEC-020 moved the Hero's top padding by 20px**, so the loader's settle target moved with it.
5. **`OD-05` / `OD-06` — no Firebase project, no admin auth decision.** Blocks all of Phase 3 and `DEPLOY-001`. Blocks nothing in Phases 5–8.
6. **A Bottle-green underline on the Pitch surface is nearly invisible.** Unchanged from last cycle; §10 specifies both colours. Hover feedback does not depend on it. Flagged for `QA-005`/`QA-011`.
7. **`npm audit` reports 6 moderate advisories**, all from one transitive `uuid` reached only through `firebase-admin`. Unchanged and still deliberate. Re-evaluate at Phase 3.
8. **Two prototype HTML files have appeared in the working tree, untracked**: `assests/2-duty-cycle.html` and `assests/home-2.html`. `DECISIONS.md` DEC-016 closed `FOUND-008` on the grounds that no `.html` file existed in the repository or its history, so that reasoning now has a material exception — `FOUND-008`'s original intent (archive them under `reference/`, keep them out of the build) is live again and worth reopening as a small task.

   Both were inspected. `2-duty-cycle.html` is a Bodoni Moda / Cormorant Infant draft exploration on a dark ground with an `--ember` accent and no calculator — exactly what DEC-001 characterised as "not candidates for source-of-truth status at all", and it changes nothing.

   `home-2.html` matters more: it is the file `DESIGN_SYSTEM.md` says it was extracted from, and it contains the real `computeAutoOpenness` the Compare drawer is modelled on. **Phase 4 was cross-checked against it after the fact.** The opening ramp implemented here is the same rule the prototype used, arrived at independently after the first attempt opened the panel beside the Hero. The closing ramp is deliberately earlier than the prototype's: the prototype held the panel fully open until Why Us filled the screen, which overlays the section it is handing over to, and §13 asks instead that the calculator slide away "as the visitor approaches Why Us" — where the prototype and the approved spec disagree, the spec wins (DEC-001, DEC-004, DEC-005). This is recorded in the comment on `computeOpenness`. Nothing in Phase 4 needs revisiting because of these files.

   **Neither file is committed** — decide what to do with them before running any `git add -A`.

## Decisions Needed

- `OD-13` — does Compare need a disclaimer line beneath the calculator? §13's copy states tax and finance outcomes as fact. If it does, the wording has to be supplied; it cannot be written here (§24). Not a blocker for Phase 5.
- `OD-03` — review the four Compare plate artworks (see Issue 1). Blocks calling Phase 4 fully exited, nothing else.
- `OD-02` — review the Hero plate artwork.
- `OD-01` — vector logo/wordmark SVG, favicon source, and the loader's letterform.
- `OD-05` / `OD-06` — Firebase project and admin auth. Needed before Phase 3.
- What to do with the two untracked prototype HTML files (see Issue 8) — archive them under `reference/` as `FOUND-008` originally intended, or delete them. Either way DEC-016 needs a superseding entry, since its stated premise no longer holds.

## Next Recommended Task

`WHY-001` — build `content/why-us/values.ts` with the four locked T/F/S/P values from §14, front and back copy. Then `WHY-002` (`FlipCard`), `WHY-004` (the 2×2 ledger grid with a locked min-height), `WHY-003` (hover micro-feedback, never a flip), `WHY-005` (`RevealOnScroll` stagger), `WHY-006` (keyboard flip + `aria-pressed`), `WHY-007` (Playwright).

Phase 5 is markedly simpler than Phase 4. Two things to get right: §14 is explicit that the flip is **click/tap only, never hover**, and that front and back faces must share a locked `min-height` so flipping never shifts the page. `MASTER_PLAN.md` Phase 5 also asks you to *decide and document in `PROGRESS.md`* how the back face is exposed to screen readers — whether it is reachable only when flipped, or both faces are announced with clear labelling. Pick one and write down why.

## Notes for Next Agent

- Read `LOOP.md` before doing anything — it defines the read → orient → plan → execute → verify → update cycle this project runs on.
- Run `npm install` first; `node_modules` is gitignored.
- Run `npm run build` (or `npm run dev`) once on a clean checkout before `npm run typecheck`. Next.js 16 generates route types into `.next/types`, and `tsc --noEmit` fails with `TS2304: Cannot find name 'LayoutProps'` until they exist.
- Only one `next dev` can run per directory. If `npm run test:e2e` reports "Another next dev server is already running", stop the other one — Playwright starts its own.
- **The ESLint rule `react-hooks/set-state-in-effect` will reject `setState` called synchronously in an effect body.** Setting state from inside a `requestAnimationFrame` callback or an observer callback is fine; calling it directly in the effect body is not. For "read a media query on mount", use `useSyncExternalStore` — `lib/motion/useMediaQuery.ts` is the pattern.
- **Playwright's `test.use({ reducedMotion: "reduce" })` does not reach the page in this setup.** Use `page.emulateMedia({ reducedMotion: "reduce" })`, as `hero.spec.ts` and `compare.spec.ts` do. A reduced-motion test that silently runs without the preference asserts nothing and passes.
- Do **not** remove `agentRules: false` from `next.config.ts` — it stops Next.js 16 from generating `AGENTS.md` and overwriting this repository's `CLAUDE.md`.
- Reuse what exists rather than rebuilding it: `Plate` for any traced-line artwork, `useDrawOnEnter` to trigger it, `Container`/`Eyebrow`/`SerifHeading` for layout and type, `RevealOnScroll` + `rv-u`/`rv-d1..3` for entrances, `SiteLinkAnchor` for links to homepage sections, `.sr-only` for text only assistive technology should get, `useMediaQuery`/`usePrefersReducedMotion` for preference reads, and `useScrollTick` for anything that must track scroll position continuously — do not add a second scroll listener.
- Give every new homepage section the `id` from `HOME_SECTION_IDS` in `lib/scroll.ts`, and delete its placeholder from `app/(site)/page.tsx` as it lands. When the last one goes, delete `placeholder.module.css` too.
- Consume design values through the tokens in `styles/tokens.css`. If a section needs a value that is not there, check whether `SOURCE_OF_TRUTH.md` actually specifies it before inventing one. Anything that must clear the fixed nav uses `--nav-block`, not `--nav-h` (DEC-020).
- Every animated component owes its own `prefers-reduced-motion` fallback (§8). The blanket rule in `globals.css` is a backstop, not a licence to skip it — and note the standard the Hero set and Compare kept: content must be *present* under the preference, and continuous motion must stop entirely, not merely go faster.
- **Look at the result in a browser before calling a UI task done.** Three real defects this cycle passed every test and were visible only on screen. That is now six across three cycles. The suite is good at catching regressions and bad at catching "this looks wrong".
- Treat `getDb()`, `getStorageClient()`, `getAuthClient()` and their admin equivalents as nullable — they return `null` until `OD-05` is resolved, and §12/§18/§21 require silent degradation rather than a visible error.
- Do not fabricate any business fact, statistic, partner name, or legal wording not already in `SOURCE_OF_TRUTH.md` — open an `OPEN DECISION` in §25 instead. DEC-019 is the worked example: the calculator lost its bars rather than gain invented numbers.
- `DESIGN_SYSTEM.md` is a valid source for tokens, motion primitives, and patterns but is **not** authoritative on section order, mobile nav behaviour, or copy — see DEC-004, DEC-005 and DEC-001. Its §9 pattern table is the best reference for the sections still to build.
