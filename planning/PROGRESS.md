# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6. Keep it operational and concise — a future agent should be able to read only this file plus `EXECUTION_ORDER.md` and know exactly where to pick up.

---

## Current Phase

Phase 2 — Hero and plate system: **complete**, with one item honestly partial (`HERO-002`: the plate artwork ships, but `OD-02` stays open for design review). Phases 0 and 1 are fully complete.

Phase 3 (Trusted By) is **blocked** on `OD-05`/`OD-06`. Phase 4 (Compare) is unblocked and is the recommended next phase — `MASTER_PLAN.md` notes Phases 2 and 3 are parallel-safe, and Phase 4 depends only on Phase 2.

## Current Task

`COMPARE-001` — build `content/compare/slides.ts` with the exact locked copy for all four slides (Phase 4)

## Status

The site has real chrome and a real Hero. `/` renders the navigation, the Hero, four placeholder section landmarks, and the footer; `/about` renders the same shell around a placeholder. The plate system that Phases 4 and 6 depend on exists and is generic.

Everything green: lint, typecheck, `next build`, 18 unit tests, 46 Playwright tests.

## Completed This Cycle

Two full phases landed this cycle. Phase 1 is described in the commit history; what follows is the state that matters going forward.

### Phase 1 — shared site shell

**Navigation.** Fixed bar, transparent over the Hero, cross-fading to a Pitch pill after 24px of scroll over `--dur-toggle` with `--eio` — background, border and radius transition together so the pill condenses rather than switching on. Scroll reads are coalesced to one per frame with rAF. Below 700px it collapses to a two-stroke hamburger that rotates into an X and opens a full-width Pitch overlay (DEC-004).

The overlay's accessibility work is the substantive part: `aria-expanded`/`aria-controls`, focus moved to the first link on open, Tab cycled between the toggle and the links so focus cannot escape behind the panel, Escape closing and restoring focus to the toggle, `inert` while closed so links are unreachable by keyboard as well as invisible, body scroll locked, and an automatic close if the viewport grows past the breakpoint.

**Footer.** Three zones on Pitch, recomposing to one column under 900px. Real `mailto:`/`tel:` links; the full postal address appears here and nowhere else, asserted by a test rather than left to convention. Computed copyright year. Privacy Policy and Terms of Use are labels, not anchors — Phase 9 (`LEGAL-002`) turns them into links once the routes exist.

**Primitives.** `RevealOnScroll` (§8's reveal; classes `rv`/`rv-u`/`rv-d1..3` are global because §8 defines one primitive shared across sections, and prefixed so single letters cannot collide), `Container`, `Eyebrow`, `SerifHeading`, `LogoMark`, `SiteLinkAnchor`.

**`lib/scroll.ts`.** The anchor-versus-route rule in one testable place: a section link is a bare fragment on `/` and `/#section` anywhere else. Nav and Footer share it, so they cannot drift apart.

**The brand mark is real.** `assests/logo_2048 (1).png` is genuine Assetly artwork — a lowercase serif "a." — served from `public/brand/assetly-mark.png` and drawn as a CSS mask so it takes its colour from `currentColor`: Olive on Paper, Ivory on the dark surfaces, from one file.

### Phase 2 — Hero and plate system

**`Plate.tsx` is genuinely generic**, which `MASTER_PLAN.md` makes a Phase 2 exit criterion. Artwork children pass *geometry only* — no `stroke`, `fill`, `stroke-width` or dash attributes — because the component supplies all of it via CSS to every stroked shape (`path`, `line`, `polyline`, `circle`, …). Props cover settled opacity, stroke width, dash length, and duration. Phases 4 and 6 should need no changes to it; if one seems necessary, prefer a new prop over a fork.

**The Hero.** Mark → headline → subline over the plate. The headline is split across two mask lines with segment-level emphasis so one word carries the §7 Moss italic. The entrance is the §11 sequence — plate draw, headline mask reveal, subline fade — fired one frame after mount so the browser paints the "before" state and actually transitions.

**Stage 2, the living plate.** Ambient drift is pure CSS: an 8–12s `alternate` cycle delayed past the 2.6s draw, with the four nodes staggered so they never move in unison. Cursor parallax is `lib/motion/useCursorParallax.ts`, writing custom properties from a rAF-coalesced `pointermove`; it is inert under reduced motion and on coarse pointers, and is held back until the draw finishes.

**Stage 3, the scroll exit.** `--hero-plate-fade` is recomputed continuously from the Hero's `getBoundingClientRect()` on a rAF-coalesced scroll listener — one of the few cases §8 actually reserves for rAF, since it must track position rather than snap at a threshold.

**Copy integrity is enforced.** Because the headline is stored split across lines and segments, it is easy to change the rendered sentence while every other test still passes. `tests/unit/heroCopy.test.ts` reassembles the segments and asserts the exact locked wording, that there are at most two lines, and that exactly one single word is emphasised.

### Decisions taken this cycle

- **DEC-015 → Withdrawn.** The Google Fonts build fetch succeeds on a networked machine; the sandbox's proxy was the problem, not the project. No fonts vendored.
- **DEC-017.** Nav wordmark is "assetly" alone, set in DM Serif Display to match the Footer's lockup, and the bar uses a new narrower `--nav-gutter` so it spans the display. User-directed, reviewed on screen.
- **DEC-018.** Hero main line is **"The lighter balance sheet."**, superseding DEC-001's main line. The subline is unchanged and remains the "Access . Scale . Grow" tagline.
- **DEC-016 / DEC-014** unchanged.

### Two defects found by looking, not by testing

1. The brand mark vanished behind the open mobile overlay, so the header stopped reading as a header. Menu state was lifted into `Nav`, which now stamps `data-menu-open`; the brand sits above the overlay in Ivory.
2. The Hero's two mask lines are block elements, so their text concatenated in the accessibility tree — the headline announced as "accesswhat". A space is now emitted between lines.

Both passed every test before the fix. Look at the page.

## Files Changed

Phase 1 — new: `public/brand/assetly-mark.png`; `app/(site)/layout.tsx`, `app/(site)/placeholder.module.css`; `components/brand/LogoMark.*`; `components/nav/Nav.*`, `components/nav/MobileMenu.*`; `components/footer/Footer.*`; `components/primitives/` (`Container`, `Eyebrow`, `SerifHeading`, `RevealOnScroll`, `SiteLinkAnchor`); `content/site/navigation.ts`; `lib/scroll.ts`; `tests/unit/scroll.test.ts`; `tests/e2e/shell.spec.ts`.

Phase 2 — new: `components/plate/Plate.tsx` + `.module.css`; `components/hero/Hero.tsx` + `.module.css`; `content/plates/hero-plate.tsx`; `content/site/hero.ts`; `lib/motion/useDrawOnEnter.ts`, `lib/motion/useCursorParallax.ts`; `tests/unit/heroCopy.test.ts`; `tests/e2e/hero.spec.ts`.

Modified: `styles/tokens.css` (`--dur-underline`, `--dur-menu`, `--nav-h`, `--nav-gutter`), `app/globals.css` (anchor `scroll-margin-top`, the shared reveal primitive and its reduced-motion neutralisation), `app/layout.tsx`, `app/(site)/page.tsx`, `app/(site)/about/page.tsx`, `next.config.ts` (`turbopack.root`), `tests/e2e/smoke.spec.ts`, and the planning documents.

Removed: `_to_delete/` (untracked junk) and its `.git/info/exclude` entry.

No new dependencies. Note that `zod` and `motion` (§19) are **not** installed yet — Phase 4 and Phase 7 are the first phases that need them.

## Tests Run

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass — 0 problems |
| Type check | `npm run typecheck` | Pass — clean |
| Unit | `npm run test` | Pass — 18/18 |
| End-to-end | `npm run test:e2e` | Pass — 46/46 |
| Production build | `npm run build` | Pass — all routes, including the Google Fonts fetch |
| Visual review | dev server, screenshots | Pass — desktop and mobile, top/scrolled/menu/footer/hero |

The Hero suite covers: the locked headline as the page's single `h1`; exactly one `<i>` computing to Moss `rgb(92,92,70)`; the entry sequence settling the mask lines and subline; the plate `aria-hidden` with no image role and strokes ending at `stroke-dashoffset: 0`; `--hero-plate-fade` at 1 then dropping on scroll; the ambient drift running `infinite alternate` on an 8–12s cycle; no horizontal overflow and a full-height Hero from 320px to 1920px; no Firebase/network request on load (§21); and under reduced motion — final state instantly, plate drawn with `stroke-dasharray: none`, and drift, node animation and parallax all fully stopped.

## Issues / Blockers

1. **`OD-02` — the Hero plate is authored, not designer-supplied.** `content/plates/hero-plate.tsx` reads left to right as Access (an open modular asset frame), Scale (the lease path rising from it) and Grow (three open frames stepping up, with the rise carried through and past them), in the architectural register §11 asks for. It is a genuine interpretation of the brief rather than a placeholder, but `MASTER_PLAN.md` warns against letting "plate looks fine" substitute for "plate represents Access→Scale→Grow" — so `OD-02` stays open until reviewed. `HERO-002` is marked `[~]`, not `[x]`.
2. **`OD-01` — still open despite a usable mark.** The mark is a 2048px raster, not a vector. Sharp at every size used so far, but a real SVG matters most for Phase 8.5, where it appears very large. Swapping it touches one file, `LogoMark.module.css`. **No favicon ships yet.** Also: the brand mark is a lower-case "a.", whereas §11a repeatedly describes the loader's "**A**" — confirm which letterform the loader uses before building Phase 8.5.
3. **`OD-05` / `OD-06` — no Firebase project, no admin auth decision.** Blocks all of Phase 3 and `DEPLOY-001`. Blocks nothing in Phase 4–7.
4. **A Bottle-green underline on the Pitch surface is nearly invisible.** §10 specifies Bottle for the nav hover underline and Pitch for the scrolled background; `#25453A` on `#21241A` is very low contrast. Implemented as specified rather than silently changed. Hover feedback does not depend on it — link colour also shifts Khaki → Ivory — so this is polish, not an accessibility failure. Flagged for `QA-005`/`QA-011`.
5. **`npm audit` reports 6 moderate advisories**, all from one transitive `uuid` reached only through `firebase-admin`. Unchanged and still deliberate: the fix downgrades `firebase-admin` 14.x → 10.x for a vulnerability in code nothing calls. Re-evaluate at Phase 3, when it becomes clear whether `admin.ts` is needed at all.

## Decisions Needed

- `OD-02` — review the Hero plate artwork (see Issue 1). Not a blocker for Phase 4; is a blocker for calling Phase 2 fully exited.
- `OD-01` — vector logo/wordmark SVG, favicon source, and the loader's letterform.
- `OD-05` — Firebase project ID(s), dev/staging/production split, custom domain. Needed before Phase 3.
- `OD-06` — admin auth method and authorised accounts. Pairs with `OD-05`.
- `OD-03` — the four Compare plate artworks. Needed to *exit* Phase 4, not to start it.

## Next Recommended Task

`COMPARE-001` — build `content/compare/slides.ts` with the four slides from §13 (Upfront Cash, Risk of Obsolescence, Tax Treatment, Leverage Impact). Do not paraphrase the locked headlines, copy, or calculator rows; §13 gives all of it verbatim, and the Hero's copy-integrity test is the pattern to follow for guarding it.

Phase 4 is the highest-complexity phase in the project and `MASTER_PLAN.md` says to budget extra QA. Suggested order: `COMPARE-001` → `COMPARE-002` (`ArgumentSlide`) → `COMPARE-005` (`useDrawerOpenness`, unit-tested as pure math before any DOM) → `COMPARE-003` (`useScrollFocus`) → `COMPARE-004` (desktop drawer) → `COMPARE-006` (mode auto-sync) → `COMPARE-007` (plates, reusing `Plate`) → `COMPARE-008` (mobile bottom sheet) → `COMPARE-009` (entry/exit) → `COMPARE-011`/`012`.

Note that both RAF-driven effects should share **one** loop, per §8 and §13 — not two listeners computing the same rects.

## Notes for Next Agent

- Read `LOOP.md` before doing anything — it defines the read → orient → plan → execute → verify → update cycle this project runs on.
- Run `npm install` first; `node_modules` is gitignored.
- Run `npm run build` (or `npm run dev`) once on a clean checkout before `npm run typecheck`. Next.js 16 generates route types into `.next/types`, and `tsc --noEmit` fails with `TS2304: Cannot find name 'LayoutProps'` until they exist.
- Only one `next dev` can run per directory. If `npm run test:e2e` reports "Another next dev server is already running", stop the other one — Playwright starts its own.
- **The ESLint rule `react-hooks/set-state-in-effect` will reject `setState` called synchronously in an effect body.** This is not a style nit; it fails `npm run lint`. Either subscribe and set state from the callback, write directly to the DOM node (as `RevealOnScroll` does), or drop the branch.
- Do **not** remove `agentRules: false` from `next.config.ts` — it stops Next.js 16 from generating `AGENTS.md` and overwriting this repository's `CLAUDE.md`.
- Reuse what exists rather than rebuilding it: `Plate` for any traced-line artwork, `useDrawOnEnter` to trigger it, `Container`/`Eyebrow`/`SerifHeading` for layout and type, `RevealOnScroll` + `rv-u`/`rv-d1..3` for entrances, `SiteLinkAnchor` for links to homepage sections.
- Give every new homepage section the `id` from `HOME_SECTION_IDS` in `lib/scroll.ts`, and delete its placeholder from `app/(site)/page.tsx` as it lands. When the last one goes, delete `placeholder.module.css` too.
- Consume design values through the tokens in `styles/tokens.css`. If a section needs a value that is not there, check whether `SOURCE_OF_TRUTH.md` actually specifies it before inventing one.
- Every animated component owes its own `prefers-reduced-motion` fallback (§8). The blanket rule in `globals.css` is a backstop, not a licence to skip it — and note the standard the Hero set: content must be *present* under the preference, and continuous ambient motion must stop entirely, not merely go faster.
- Look at the result in a browser before calling a UI task done. Both real defects this cycle passed every test and were visible only on screen.
- Treat `getDb()`, `getStorageClient()`, `getAuthClient()` and their admin equivalents as nullable — they return `null` until `OD-05` is resolved, and §12/§18/§21 require silent degradation rather than a visible error.
- `DESIGN_SYSTEM.md` is a valid source for tokens, motion primitives, and patterns but is **not** authoritative on section order or mobile nav behaviour — see DEC-004 and DEC-005. Its §8 is, however, the most detailed description of the Compare calculator's scroll-scrubbing model and is worth reading before Phase 4.
- Do not fabricate any business fact, statistic, partner name, or legal wording not already in `SOURCE_OF_TRUTH.md` — open an `OPEN DECISION` in §25 instead.
