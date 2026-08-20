# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 8.5 — Hero loader / opening sequence: **complete on `phase/hero-opening-loader`, pending later merge**. Phases 0, 1, 2, 4, 5, 6, 7 and 8 remain complete on `main`. Phase 3 remains blocked on `OD-05`/`OD-06`.

## Current Task

`LOADER-001` through `LOADER-009` are complete. The next unblocked phase after this branch is merged is Phase 9, beginning with `LEGAL-001`; its legal wording decisions remain owner work and must not be invented.

## Status

The homepage now opens with the approved Pitch brand signature before handing off to the existing Hero. The work is isolated on `phase/hero-opening-loader`; it has not been merged into `main`.

## Completed This Cycle

### Hero opening and hand-off

- Added a full-viewport Pitch opening with the current `a.` brand glyph in Ivory and `ACCESS · SCALE · GROW` in Khaki/Inter Tight. The overlay sits above the fixed Nav, the plate remains undrawn, and body scrolling is locked during the opening.
- Kept one persistent mark node through the whole sequence. Its final Hero anchor is measured from the rendered layout, so desktop and mobile use the actual destination instead of duplicating a guessed coordinate.
- Replaced the Phase 2 mount-triggered entrance with an explicit hand-off. Hero proposition, subline and plate begin only after settle; the Hero's older 1.7s mark entrance is suppressed after the loader so the landed mark cannot drift a second time.
- Moved the Hero's scroll-exit plate fade onto `useScrollTick`, removing its independent scroll/resize listener.

### Smoother, shorter motion (DEC-031)

- The double blink is one continuous 1.7s eased curve with two 25%-opacity dips and only a brief breath between them. The tagline has no animation and does not move or dim during the signature.
- Recede is 650ms and settle is 850ms. Once the mark reaches its measured anchor it holds completely still for 320ms, then the Pitch overlay clears over 420ms while the mark changes Ivory to Olive. No movement occurs after landing.
- Total standard-motion choreography is approximately 4.1 seconds including the 150ms preparation frame, down from the first implementation's approximately 4.8 seconds.
- Reduced motion skips blink, recede and settle and reaches the final Hero through the existing 120ms maximum fade.

### Replay and navigation

- The loader plays on every full document load of `/` only. A module-scope completion flag survives App Router navigation without using storage or introducing a hydration branch.
- `/about` never shows the loader. `/about` → `/` and browser back navigation within the same document do not replay it; a true reload of `/` does.
- The mobile menu overlay now explicitly uses `100vw`, keeping it full-width while loader and menu scroll locks exchange ownership.

### Accessibility and review

- Opening visuals are decorative and do not use status, progress or busy semantics; the real Hero `h1` remains the page content exposed to assistive technology.
- The project owner reviewed the live desktop/mobile preview, approved the direction, then requested the smoother blink and still post-settle hold now recorded in DEC-031.
- The branch uses the same supplied `a.` glyph as the shipped Hero so the opening never swaps shape. `OD-01` remains open for the eventual vector logo/favicon asset; no replacement was fabricated.

## Decisions

- **DEC-031** — the Hero opening is document-scoped and holds after a continuous double blink.

## Tests Run

| Check | Result |
|---|---|
| `npm install` | Pass — dependencies current; existing six moderate Firebase advisories remain |
| Loader-path ESLint | Pass — all files included in this phase commit |
| `npm run typecheck` | Pass |
| `npm run test -- --maxWorkers=1` | Pass — 93/93 |
| Loader Chromium/WebKit suite | Pass — exact blink definition, static tagline, settle/hold, replay, mobile, reduced motion and CPU throttling |
| `npm run build` | Pass — all routes generated |
| Visual review | Pass — opening and final Hero at 1440×900 and 390×844; owner approved, then motion was tightened per feedback |
| Clean-commit verification | Pass — install, lint, typecheck, 93/93 unit tests and production build; targeted loader coverage passed in Chromium and WebKit |

The shared working directory also contains concurrent, uncommitted Compare, Why Assetly, Sectors and scroll-focus edits plus scratch scripts that are not part of this phase. They are intentionally excluded from the loader commit. A diagnostic full Chromium run against that mixed working tree passed all loader/Hero tests and 116/121 overall; its Compare sizing, Why Assetly overflow and related failures belong to those excluded edits, not this branch commit. Install, lint, typecheck, unit tests and production build were rerun from the clean commit tree before push.

## Issues / Blockers

1. `OD-14` — the real, rights-cleared About photograph and factual alt description remain required before Phase 10 exits or deployment. The current media slot is an explicit placeholder (DEC-027), not a substitute.
2. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — the logo remains raster and no favicon exists. The loader reuses the current shipped glyph so it can hand off without a shape swap.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Merge `phase/hero-opening-loader` only after branch review. Then begin Phase 9 planning without inventing legal wording: resolve the required owner decisions for privacy/terms content and domain metadata before implementation.

## Notes for Next Cycle

- `SOURCE_OF_TRUTH.md` §11a and DEC-031 jointly define the final loader timing and replay behavior.
- The shipped Hero headline remains `The lighter balance sheet.` (DEC-018), and its subline remains `Access . Scale . Grow` in DM Serif Text. Only the opening signature uses the uppercase Inter Tight tagline.
- Playwright reduced-motion coverage must continue using `page.emulateMedia({ reducedMotion: "reduce" })`.
- The loader's target must continue to be measured from `[data-hero-mark-target]`; do not parse the `clamp()` token as a number.
- Keep the branch separate until the owner explicitly asks to merge it.
