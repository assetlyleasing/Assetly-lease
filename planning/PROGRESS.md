# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Correction pass over Phases 5–7: **complete**. Phases 0, 1, 2, 4, 5, 6, 7 and 8 are complete. Phase 3 remains blocked on `OD-05`/`OD-06`. Phase 8.5 is the next phase and is unblocked.

## Current Task

`LOADER-001` — build the Hero opening loader (§11a, `MASTER_PLAN.md` Phase 8.5).

## Status

The homepage renders the shared shell, Hero, Compare, Why Assetly, Sectors and Contact; `/about` renders with the owner-approved temporary media slot (DEC-027). This cycle corrected the proportions of the three sections built in Phases 5–7 after a visual review found them oversized, and set the sector rotation to 1.2s by owner instruction.

## Completed This Cycle

### Correction pass — section proportions (DEC-028)

A visual review at 1440×900 and 390×844 found a systemic defect the automated suite could not see: grid cells were capped against viewport *width*, so they grew to 356–390px and each 2×2 grid stood 712–780px tall beneath a 150px heading. Neither Why Assetly nor Sectors was ever seen whole on a 900px screen, and `space-between` distributed the surplus as a ~120px void inside every card.

For Sectors that was more than a proportion problem. §15 rotates one of four visible cards at a time, which only reads if the four are simultaneously in view; on a 390×844 phone the 285px stacked cards ran to ~1140px, so two of the four were permanently off-screen and the rotation was invisible.

- Both grids now cap their cell height with a `vh` clamp and share one value, since they sit directly above one another and any mismatch shows.
- The sector plate is sized from the card's height rather than a fixed width, so the artwork and the copy stay in proportion at every window height; the descriptor gained a one-line measure.
- The mobile sector card is recomposed horizontally — small plate beside the sector name, index above it, descriptor still hidden per §15. All four now fit one phone screen.
- Why Assetly's letter was enlarged and its card shortened to match Sectors. The back faces were re-measured: `.face` is `overflow: hidden`, so a card shorter than its copy truncates it silently. The mobile card was 24px short for "S", which names six sectors, and is now tested at both sizes.
- Contact's info column and map shell came down to one shorter shared height, closing the ~200px void beneath "Let's talk.".

### Rotation cadence (DEC-029)

The interval is 1.2s, superseding §15's 2.5s by owner instruction; §15 is amended. The 450ms swap is unchanged. This is the cadence of the grid, not of any one card: with four slots each card still holds for 4.8s, so its plate completes the 2.6s draw before that slot returns.

The rotation test was rewritten to sample consecutive states and assert that no more than one slot changes between them. At 1.2s a single before/after snapshot taken around one swap is a race — a slow frame lands two changes inside the window — so the old test would have failed for timing rather than for behaviour.

### Map marker (DEC-030)

The Contact map is drawn `xMidYMid slice`, so cropping moves the artwork as the container's aspect ratio changes while a percentage-positioned HTML label does not. The pin and its "ASSETLY" label had drifted apart — at 1440×900 the label already sat over the pin's ring — and the mobile `top: 56%; left: 48%` override was a patch for that drift rather than a fix. Both are now anchored to the viewBox centre, the one point `xMidYMid` maps identically at every ratio, and the override is deleted.

### Phase 8 verification

Reviewed `b720cf2` as part of this cycle: the media slot is a labelled, `aria-hidden` placeholder with no invented alt text, the copy is source-derived with no fabricated facts, and DEC-027 records the owner's instruction while keeping `OD-14` open against Phase 10 exit and deployment. Confirmed on screen at 1440×900 and 390×844.

## Decisions

- **DEC-028** — section blocks are sized against viewport height, not viewport width.
- **DEC-029** — sector rotation changes a card every 1.2 seconds.
- **DEC-030** — the map pin and its label share the viewBox centre.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test -- --maxWorkers=1` | Pass — 89/89 |
| `npx playwright test --workers=1` | Pass — 143/143 (113 Chromium + 30 targeted WebKit) |
| `npm run build` | Pass — all routes generated |
| Visual review | Pass — Why Assetly, Sectors, Contact and `/about` at 1440×900 and 390×844, before and after |

One caveat worth recording: run with two parallel workers against a single dev server, the WebKit mobile Contact sheet test failed on a click that never registered. It passes serially, and `--workers=1` is the project's convention, so this is a parallelism artefact rather than a regression — but it is the kind of failure that looks like a real one.

New coverage this cycle: the Sectors grid fits within one screen at both sizes; no Why Assetly back face is clipped at either size; the map pin and label coincide at three aspect ratios; and the rotation changes at most one slot between consecutive samples.

## Issues / Blockers

1. `OD-14` — the real, rights-cleared About photograph and its factual alt description are still required before Phase 10 exits or deployment. The current media slot is an explicit placeholder (DEC-027), not a substitute.
2. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — the logo is raster and no favicon exists. It does **not** block Phase 8.5: §11a point 2 fixes the loader's typeface, and the earlier note that the loader "still needs the letterform confirmed" was over-cautious.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Phase 8.5, `LOADER-001` onward. Two things to settle while building it, both recorded here rather than decided silently:

- **The mark.** §11a calls the opening mark "the 'A'" in DM Serif Display, but the Hero's mark is not a letter — `LogoMark` renders the "a." brand mark as a CSS mask, sized `clamp(46px, 8.5vw, 104px)` in Olive, and `Hero.module.css` already documents that position as the loader's hand-off contract. Plan: move that same node from the loader's centre to its Hero position, Ivory to Olive as the overlay clears — the only route with no layout shift and no swap between two different glyphs. Both candidates occupy the identical position, so switching to a literal DM Serif Display "A" is a change of what one span renders, not a rebuild. Show the owner both at preview.
- **The tagline.** §11a describes "ACCESS · SCALE · GROW" in Inter Tight uppercase and says that is how it appears "elsewhere as the Hero subline". The shipped Hero renders it as "Access . Scale . Grow" in DM Serif Text, Moss (§11, DEC-001). Build the loader tagline per §11a and leave the Hero's subline alone; flag the mismatch for the owner rather than restyling locked Hero copy.

## Notes for Next Cycle

- Replay behaviour is decided: the loader plays on **every full page load of `/` only**. Implement with a module-scope flag, not storage — module state survives client-side navigation but is recreated on every document load, which is exactly that rule with no hydration branch. `/about` → `/` must not replay it, and `/about` itself must never show it.
- The Nav is `z-index: 100`; an opaque overlay above it satisfies §11a's "no navbar during opening" without coupling the loader to the layout. Lock body scroll for the duration — the same two-line lock is already inlined in `lib/a11y/useFocusTrap.ts`.
- Playwright's `test.use({ reducedMotion })` does **not** reach the page in this setup. Use `page.emulateMedia({ reducedMotion: "reduce" })`, as the existing specs do, or the test passes while asserting nothing.
- An unregistered custom property read with `getPropertyValue` returns its literal `clamp(...)` text and parses as `NaN`. Measure elements instead of parsing tokens in tests.
- `playwright.config.ts` sets `reuseExistingServer`, so a dev server already on port 3000 is reused rather than fought over.
- Anything clearing the fixed nav uses `--nav-block`, not `--nav-h` (DEC-020).
