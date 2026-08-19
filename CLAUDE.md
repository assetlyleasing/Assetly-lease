# Working in this repository

Before doing any planning or implementation work, read `planning/LOOP.md` first, then `planning/SOURCE_OF_TRUTH.md`, `planning/MASTER_PLAN.md`, `planning/EXECUTION_ORDER.md`, `planning/DECISIONS.md`, and `planning/PROGRESS.md` — in that order. `PROGRESS.md` says where the project currently stands and what the next task is.

## Git and push workflow

- **Branch**: work directly on `main`. No feature branches, no PR review cycle.
- **Remote**: `origin` is already configured (`https://github.com/sujeth-dev/Assetly.git`). Push with a plain `git push`.
- **Commit granularity**: one commit per completed `MASTER_PLAN.md` phase (once its exit criteria are met and `PROGRESS.md`/`EXECUTION_ORDER.md` are updated), not one commit per individual task. Small supporting/tooling changes (docs, config) may get their own commit outside that rule when they aren't part of a phase.
- **Commit messages**: plain, professional prose describing what changed and why, written the way an engineer documents their own work — the kind of message that's still useful to someone reading `git log` months later. No internal task-ID shorthand (e.g. `FOUND-001`). No tool or automation attribution of any kind — nothing referencing AI, assistants, or code-generation tooling — anywhere: not in commit messages, not in commit trailers, not in code comments, not in branch names.
- Confirm `.env.local` and any other secrets are excluded (see `.gitignore`) before committing.
