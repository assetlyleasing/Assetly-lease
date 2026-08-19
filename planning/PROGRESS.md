# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6. Keep it operational and concise — a future agent should be able to read only this file plus `EXECUTION_ORDER.md` and know exactly where to pick up.

---

## Current Phase

Phase 0 — Repository and project foundation (not yet started)

## Current Task

`FOUND-001` — Scaffold Next.js App Router + TypeScript project (no Tailwind)

## Status

Not started. `SOURCE_OF_TRUTH.md`, `MASTER_PLAN.md`, `EXECUTION_ORDER.md`, `DECISIONS.md`, and `LOOP.md` have just been created from the raw planning material (`plan.md`, `DESIGN_SYSTEM.md`, project baseline). The repository currently contains only static HTML prototypes and planning documents — no Next.js project exists yet.

## Completed This Cycle

- Converted `plan.md` + `DESIGN_SYSTEM.md` + project baseline into the full planning/execution system: `SOURCE_OF_TRUTH.md`, `MASTER_PLAN.md`, `EXECUTION_ORDER.md`, `DECISIONS.md`, `LOOP.md`, `PROGRESS.md`.
- Identified and resolved 7 conflicts between source documents (see `DECISIONS.md` DEC-001 through DEC-007).
- Catalogued 12 open decisions (`SOURCE_OF_TRUTH.md` §25, `OD-01` through `OD-12`) that will block specific phases until resolved.
- Initialized the git repository (`git init` — repo had no VCS before this).
- Incorporated a user-supplied change: the Hero's old choreographed opening (in §11's motion sequence) is superseded by a dedicated brand-signature loader spec (blink → recede → settle into Hero). Added `SOURCE_OF_TRUTH.md` §11a, `DECISIONS.md` DEC-013, and — per the user's explicit sequencing request — inserted a new **Phase 8.5 — Hero loader / opening sequence** into `MASTER_PLAN.md`/`EXECUTION_ORDER.md` (scheduled after Phase 8, not inside Phase 2). Phase 2's Hero tasks were updated to note they ship only the simple interim entrance now; Phase 8.5 owns the full loader.
- Noticed an `assests/` folder (not previously catalogued) containing `plan.md`, `DESIGN_SYSTEM.md`, `ASSETLY VISITING CARD.pdf`, and logo files (`logo_2048 (1).png`, `logo_2048 (1) copy.png`, `logo_editable (1).psd`). These are raster/PSD, not the vector SVG lockup `OD-01` calls for, so `OD-01` is **not** resolved — but a future agent should check this folder before assuming no logo asset exists at all.
- Made the initial commit on `main` (renamed from git's default `master`) and locked the git workflow in `LOOP.md`: trunk-based on `main`, one commit per completed `MASTER_PLAN.md` phase (not per task), commit messages written as plain professional prose with no task-ID shorthand and no AI/tool attribution anywhere.

## Files Changed

- `SOURCE_OF_TRUTH.md` (added §11a, updated §11)
- `MASTER_PLAN.md` (updated Phase 2 scope note + tasks, added Phase 8.5)
- `EXECUTION_ORDER.md` (updated Phase 2 scope note + `HERO-001`/`HERO-003`, added Phase 8.5 task list)
- `DECISIONS.md` (added DEC-013 + index row)
- `LOOP.md` (no change this cycle)
- `PROGRESS.md` (this file)
- `.git/` (repository initialized, no commits yet)

## Tests Run

None — no code exists yet.

## Issues / Blockers

- `OD-05` (Firebase project config/env split) should be resolved before or during `FOUND-005`/`FOUND-006`.
- `OD-01` (vector logo asset) is not blocking for Phase 0 or Phase 1's structural work, but must be resolved before Phase 1 can be considered visually final (a placeholder mark is acceptable to proceed). Raster/PSD logo files exist in `assests/` but are not the vector lockup the spec calls for.

## Decisions Needed

From `SOURCE_OF_TRUTH.md` §25 — the ones relevant soonest:

- `OD-05` — Firebase project ID(s) and environment strategy (blocks Phase 0 exit)
- `OD-01` — Vector Assetly logo/wordmark SVG (blocks Phase 1 visual finality, not its structural build)

## Next Recommended Task

`FOUND-001`: scaffold the Next.js App Router + TypeScript project per `MASTER_PLAN.md` Phase 0. No prerequisites — this is the true starting point.

## Notes for Next Agent

- Read `LOOP.md` before doing anything — it defines the read → orient → plan → execute → verify → update cycle this project runs on.
- The repo root currently has static HTML prototypes (`home-2.html`, `index.html`, `assetly-home.html`, `1-residual.html`, `2-duty-cycle.html`, `3-white-paper.html`, `4-position.html`, `previews.html`). These are references only (see `DECISIONS.md` DEC-001, DEC-008) — `home-2.html`'s headline copy ("The lighter balance sheet.") is **not** the approved Hero copy; the approved copy is in `SOURCE_OF_TRUTH.md` §11. Archive these into `reference/` as part of `FOUND-008`.
- `DESIGN_SYSTEM.md` is a valid source for tokens/motion primitives/patterns but is **not** authoritative on section order or mobile nav behavior — see `DECISIONS.md` DEC-004 and DEC-005 for where it was superseded.
- Do not fabricate any business fact, statistic, partner name, or legal wording not already present in `SOURCE_OF_TRUTH.md` — use `OPEN DECISION` instead.
