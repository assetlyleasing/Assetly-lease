# LOOP — Continuation Protocol for Assetly Website

This is how any future coding or planning agent resumes work on this project without needing this conversation's context. Never rely on conversational memory — always re-read the documents below at the start of a cycle.

---

### 1. READ

Read, in this order:

1. `SOURCE_OF_TRUTH.md` — what's approved, locked, and non-negotiable
2. `MASTER_PLAN.md` — the phase this work belongs to, and its full spec
3. `EXECUTION_ORDER.md` — the granular task checklist and current status markers
4. `DECISIONS.md` — why things are the way they are; don't reopen `Active` decisions without a new material constraint
5. Latest `PROGRESS.md` — what actually happened last cycle, not just what was planned
6. `docs/plot.md` — the structural map: layers, module responsibilities, load-bearing conventions

Then query the Codebase Memory graph to locate the code before reading source — see `CLAUDE.md`.

### 2. ORIENT

From the above, determine:

- **Current phase** — the lowest-numbered phase in `MASTER_PLAN.md` that isn't fully exited (i.e., its exit criteria aren't all met).
- **Last completed task** — the highest-ID `[x]` entry in `EXECUTION_ORDER.md` within or before the current phase.
- **Next unblocked task** — the first `[ ]` or `[~]` task in `EXECUTION_ORDER.md` whose dependencies (per its phase's "Inputs/dependencies" in `MASTER_PLAN.md`) are satisfied. Skip `[!]` blocked tasks unless you can resolve the blocker.
- **Dependencies** — check the current phase's "Inputs/dependencies" line in `MASTER_PLAN.md`; confirm the prerequisite phase's exit criteria actually passed (per its last `PROGRESS.md` record), not just that its tasks are checked off.
- **Relevant approved spec** — the matching numbered section in `SOURCE_OF_TRUTH.md` (e.g. Compare work → §13).

If `EXECUTION_ORDER.md` and `PROGRESS.md` disagree about what's actually done (e.g. a task is checked `[x]` but `PROGRESS.md` recorded a failing test), trust `PROGRESS.md` and correct the checklist.

### 3. PLAN

Before writing any code, state explicitly:

- **Task ID** (from `EXECUTION_ORDER.md`, e.g. `COMPARE-005`)
- **Files expected to change** (from the matching phase's "Components/files" list in `MASTER_PLAN.md` — deviations are fine but should be intentional, not accidental scope creep)
- **Acceptance criteria** (from the phase's exit criteria / the task's role in it)
- **Test method** (which of Vitest/Playwright/responsive/accessibility/performance/failure testing applies, per the phase's "Tests" list)

Do not redesign unrelated sections while doing this. If something in `SOURCE_OF_TRUTH.md` seems wrong or outdated, do not silently change it — flag it as a proposed decision, get it confirmed (with the user, or noted clearly as a proposal in `PROGRESS.md`), and only then update `SOURCE_OF_TRUTH.md` + add a `DECISIONS.md` entry.

### 4. EXECUTE

Implement only the current task or tightly-coupled prerequisite work it genuinely can't be separated from. Preserve, unless a new approved decision says otherwise:

- Design tokens (`SOURCE_OF_TRUTH.md` §6–§7)
- Motion language (§8) — including the mandatory `prefers-reduced-motion` neutralization on anything new
- Responsive recomposition principles (§9) — mobile is recomposed, not shrunk
- Accessibility rules (§20)
- The Firestore-scoped-to-Trusted-By-only boundary (DEC-011) — don't casually add new remote-managed content without a decision entry

### 5. VERIFY

Run whatever the task's phase specifies under "Tests" in `MASTER_PLAN.md`. At minimum, for any code change:

- Type check + lint
- Relevant Vitest unit tests
- Relevant Playwright flow(s) if the task touches interactive/user-facing behavior
- Responsive check if the task touches layout
- Accessibility check (keyboard + reduced-motion at minimum) if the task touches anything animated or interactive
- Firebase failure-state check if the task touches Firestore/Storage/Auth

**A task is not complete because it compiles.** It's complete when its acceptance criteria (from step 3) actually pass. If a test fails, fix and retest before marking anything `[x]` — per the project's `Implement → Test → Fix → Retest → Record` mandate.

### 6. UPDATE

After verification passes (or partially passes — be honest):

- Update `EXECUTION_ORDER.md`: mark the task `[x]` if fully done and verified, `[~]` if genuinely partial, `[!]` with an inline note if blocked (name the blocker, ideally an `OD-xx` from `SOURCE_OF_TRUTH.md` §25).
- Write/update `PROGRESS.md` (overwrite it each cycle — it reflects the *current* state, not a running log; see its template) recording: what was completed, files changed, tests run and their results, unresolved problems, decisions needed, and the next recommended task.
- Update `SOURCE_OF_TRUTH.md` **only** when an approved product/design decision actually changed (not for routine implementation details).
- Update `DECISIONS.md` whenever a meaningful technical/product decision is made or changed — new entry, don't edit history. If an `OPEN DECISION` (§25) got resolved, remove it from that table and, if it materially affected the approved spec, add a `DECISIONS.md` entry documenting what was decided and why.
- If the *structure* changed, update `docs/plot.md` and re-index Codebase Memory — see `CLAUDE.md`.

### 7. LOOP

Start the next cycle by returning to step 1 and re-reading the documents — do not carry assumptions forward from working memory alone, since a new agent (or a compacted context) needs the files to be self-sufficient.

---

## Git workflow

- **Branch**: work directly on `main` (trunk-based). No feature branches, no PR review cycle for this solo-cycle project.
- **Commit granularity**: one commit per completed `MASTER_PLAN.md` phase, made once that phase's exit criteria are met and `PROGRESS.md`/`EXECUTION_ORDER.md` are updated — not one commit per individual task.
- **Commit messages**: plain, professional, human-readable prose describing what shipped and why it matters, the way a developer would write it. No internal task-ID shorthand (`FOUND-001`, `HERO-003`, etc.), no AI/tool attribution or generated-by trailers, anywhere in the commit id or message. Write it as if a human engineer is describing their own work.
- Before any commit, confirm `.env.local` and other secrets are excluded (gitignored) — see Phase 0's risk note in `MASTER_PLAN.md`.

## Guardrails

- Never reopen an `Active` decision in `DECISIONS.md` without a new, material constraint — if you think one exists, state the constraint explicitly before proposing a change.
- Never invent business facts (statistics, partner names, legal wording, pricing) to fill a gap — use `OPEN DECISION` in `SOURCE_OF_TRUTH.md` §25 instead and flag it in `PROGRESS.md`.
- Never mark a later phase's tasks as unblocked while an earlier phase's exit criteria are unmet, unless `MASTER_PLAN.md` explicitly notes the phases can run in parallel (currently only Phase 3 vs. Phase 2 are noted as parallel-safe).
- Never skip the "Record" step of `Implement → Test → Fix → Retest → Record` — an untested or unrecorded change is not progress the next agent can trust.
