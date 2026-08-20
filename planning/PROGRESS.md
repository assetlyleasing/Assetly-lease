# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 4 — Compare experience: **complete**, including the project-owner-directed plate and graph correction. Phases 0, 1 and 2 are complete. Phase 3 remains blocked on `OD-05`/`OD-06`; Phase 5 is unblocked.

## Current Task

`WHY-001` — build the locked T/F/S/P content for Phase 5, then the Why Assetly flip-card grid.

## Status

The homepage renders the shared shell, Hero, and corrected four-argument Compare sequence. Compare now uses the approved prototype-derived plate set and one persistent qualitative bar graph. Green after the correction: lint, typecheck, production build, 69 unit tests, and 78 Chromium Playwright tests.

## Completed This Cycle

### Phase 4 correction

- Archived the two late-arriving prototypes as `reference/home-2.html` and `reference/2-duty-cycle.html`, outside the application build. DEC-021 supersedes DEC-016's missing-files premise.
- Replaced the initial interpreted Compare drawings with a 200×130 set: three plates adapted from `home-2.html` for Upfront Cash, Obsolescence, and Leverage, plus a matching Tax Treatment ledger drawing. `OD-03` is resolved (DEC-022).
- Replaced the qualitative ledger rows with one persistent three-column graph. The frame stays mounted while each fill transitions between visual Low/Mid/High tiers (30%/60%/92%) and the approved outcome text changes. There are no prototype coefficients, numeric magnitudes, computed currency values, or asset-value input (DEC-023).
- Set uniformly thicker fills after visual review: 44px desktop and 28px mobile. Lease remains Bottle; Loan/Purchase remain Olive.
- Preserved the drawer/sheet openness model, manual override, scroll-to-slide mode row, fixed mobile height, single shared RAF loop, and exact approved copy.
- Reduced motion now removes graph fill motion entirely rather than inheriting the global 120ms transition clamp.

### Visual defects found and fixed

1. The first pass's 20–34px fills looked too needle-like at full drawer width; fixed with uniform 44px/28px fills after project-owner review.
2. The longest outcome could overrun its grid column; fixed with constrained graph width and balanced, breakable value text.
3. Mobile values extended below the visible 390×844 sheet frame; fixed by tightening internal spacing and the mobile plot clamp without changing sheet height.

## Decisions

- **DEC-021** — archive both prototype HTML files under `reference/`.
- **DEC-022** — approve the compact prototype-derived Compare plate set and resolve `OD-03`.
- **DEC-023** — supersede only DEC-019's no-bars clause with qualitative tier bars; retain its ban on prototype calculator math/value input and retain scroll as the mode source of truth.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test` | Pass — 69/69 |
| `npx playwright test --project=chromium --workers=2` | Pass — 78/78 |
| Compare RAF profile | Pass — p95 below 60ms and worst frame below 200ms in the guarded development-build profile |
| `npm run build` | Pass — all routes |
| Visual review | Pass — centred desktop and 390×844 mobile Compare states; all four plate/graph modes, stable sheet, reduced motion |

The Compare suite now additionally guards exact tier mappings, absence of numeric calculator data, persistent graph identity, tall visible plot dimensions, uniform bar width, reduced-motion transition removal, and all prior drawer/sheet/copy/performance behavior.

## Issues / Blockers

1. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
2. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
3. `OD-01` — the logo is raster, no favicon exists, and Phase 8.5 still needs the loader letterform confirmed.
4. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
5. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
6. `npm audit` still reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Complete Phase 5 in order: `WHY-001` content, `WHY-002` flip card, `WHY-004` locked-height ledger grid, `WHY-003` hover-only micro-feedback, `WHY-005` reveal stagger, `WHY-006` keyboard and active-face-only accessibility, then `WHY-007` Chromium + WebKit verification.

Locked implementation decisions for Phase 5:

- Heading: **Why Assetly**.
- Flip activation: click/tap and native-button Enter/Space only; never hover.
- Screen readers: only the active face is exposed. The value name remains the button label; the explanation is exposed and politely announced only while flipped.
- Front/back share one card-shell `min-height`, so flipping cannot shift the page.

## Notes for Next Cycle

- Run `npm run build` once before `npm run typecheck` on a clean checkout so Next.js route types exist.
- Stop any existing `next dev` before Playwright starts its own server.
- Use `page.emulateMedia({ reducedMotion: "reduce" })`; the fixture option does not reach the page here.
- Reuse `RevealOnScroll` + `rv-u`/`rv-d1..3`, `Container`, `Eyebrow`, `SerifHeading`, `.sr-only`, and `usePrefersReducedMotion`.
- Anything clearing the fixed nav uses `--nav-block`, not `--nav-h`.
- Look at the page in a browser before calling the UI complete; this correction again found defects that automated assertions missed.
