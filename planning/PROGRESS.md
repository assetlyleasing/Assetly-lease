# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phase 8 — About: **complete under DEC-027's owner-approved temporary media state**. Phases 0, 1, 2, 4, 5, 6, 7 and 8 are complete. Phase 3 remains blocked on `OD-05`/`OD-06`. Phase 8.5 is unblocked. The real About photograph remains required at `QA-000` before Phase 10 can exit or production can deploy.

## Current Task

`LOADER-001` — build the branded Hero opening sequence after re-reading `SOURCE_OF_TRUTH.md` §11a and DEC-013. Do not fold the outstanding About photograph into the loader work.

## Status

The homepage contains every currently unblocked narrative section, and `/about` is now a complete standalone route using the shared public shell. Green at this boundary: lint, typecheck, production build, 89 unit tests, 109 Chromium Playwright tests, and 26 targeted WebKit interaction tests.

## Completed This Cycle

### Phase 8 — About

- Replaced the Phase 1 route scaffold with the approved About heading, exact source-grounded description, Bengaluru line, and linked Assetly email.
- Added typed About content and a route-specific metadata description, document title, and Open Graph title/description.
- Built a restrained 60/40 editorial desktop composition that recomposes to media-above-copy on mobile.
- Cleared the fixed navigation using `--nav-block` and reused the existing public Nav, Footer, Container, Eyebrow, SerifHeading, and one RevealOnScroll instance.
- Added a clearly labelled temporary media slot following direct owner instruction. It is a non-image placeholder, is hidden from the accessibility tree, and receives no invented alt text.
- Confirmed homepage section links from `/about` resolve to `/#compare`, `/#sectors`, and `/#contact`, and confirmed the Footer About Us link reaches `/about`.
- Reduced motion exposes the complete layout immediately with no spatial reveal.
- Removed the obsolete shared placeholder stylesheet after the final public placeholder route was replaced.

### Decisions and planning

- **DEC-027** records the owner-approved temporary About media slot and supersedes only the earlier prohibition on implementing or committing Phase 8 before the image arrives.
- `OD-14` remains open. It now blocks Phase 10 exit and deployment through `QA-000`, rather than the Phase 8 layout/content boundary.
- Phase 8 execution tasks are complete; `QA-000` explicitly owns the final rights-cleared `next/image` swap and factual alt text.

### Visual review

- Reviewed full rendered 1440×900 desktop and 390×844 mobile About pages from a running preview server.
- Confirmed the desktop media slot occupies approximately 60% of the main composition, the mobile media precedes copy, the placeholder reads intentionally rather than as missing content, and neither viewport overflows horizontally.
- Confirmed typography, spacing, closing rule, email treatment, fixed-nav clearance, and transition into the shared Footer on screen.

## Decisions

- **DEC-025** — author the six sector plates inline and stop rotation entirely under reduced motion.
- **DEC-026** — use a non-cartographic code-authored Bengaluru plate without external map data or tracking.
- **DEC-027** — permit a clearly labelled temporary About media slot while retaining the real-photo requirement before final QA/deployment.

## Tests Run

| Check | Result |
|---|---|
| `npm run lint` | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test -- --maxWorkers=1` | Pass — 89/89 |
| `npx playwright test tests/e2e/about.spec.ts --project=chromium` | Pass — 5/5 |
| `npx playwright test --workers=1` | Pass — 135/135 (109 Chromium + 26 targeted WebKit) |
| Compare RAF profile | Pass inside the serial full suite |
| `npm run build` | Pass — all routes statically generated |
| Visual preview | Pass — 1440×900 desktop and 390×844 mobile About compositions |

The Phase 8 suite guards exact copy, absence of invented company history, placeholder semantics, metadata, public-shell reuse, homepage navigation in both directions, desktop media proportion, mobile order, fixed-nav clearance, overflow, and immediate reduced-motion content.

## Issues / Blockers

1. `OD-14` / `QA-000` — replace the About placeholder before Phase 10 exits or production deploys with a genuine, rights-cleared photograph at least 1600px wide, rendered through `next/image`, plus its supplied factual alt description.
2. `OD-13` — no Compare disclaimer wording has been supplied. It remains open; no disclaimer was invented.
3. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
4. `OD-01` — the logo is raster, no favicon exists, and Phase 8.5 still needs the loader letterform confirmed.
5. `OD-05` / `OD-06` — no Firebase project or admin-auth decision; Phase 3 remains blocked.
6. Bottle underline contrast on Pitch remains queued for Phase 10 QA.
7. `npm audit` reports six moderate advisories through `firebase-admin`; re-evaluate with Phase 3.

## Next Recommended Task

Begin Phase 8.5 with the branded Hero opening loader. First reconcile §11a's recorded final hierarchy with the currently shipped DEC-018 Hero copy, then implement the Pitch opening, double blink, recede, settle, and Hero hand-off without changing the completed About route or resolving `OD-14` by substitution.

## Notes for Next Cycle

- Read `SOURCE_OF_TRUTH.md` §11a and DEC-013 in full before touching the Hero; the loader must hand off into the already-shipped Hero rather than duplicate it.
- Decide and record loader replay behavior for reload and back navigation as required by `LOADER-007`.
- Reduced motion skips blink/recede and moves directly to the final Hero state through at most a short subtle fade.
- `OD-14` is deferred, not resolved. Do not replace the placeholder with stock, generated, logo-based, or abstract artwork.
- Phase 3 remains separately blocked on Firebase project and admin-auth decisions.
- Continue using one commit per completed phase and explicit-path staging only.
