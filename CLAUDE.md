# Working in this repository

## Mini prompt — apply this on every task

> **Graph first, files second.** Query Codebase Memory MCP before any broad grep or multi-file read:
> `search_graph` to locate symbols → `trace_path` for callers/callees → `get_architecture` to orient →
> `detect_changes` for blast radius. Then open only the files those results name.
> **Read `docs/plot.md`** for structure, `planning/PROGRESS.md` for current state.
> **After structural change**, re-index and update `docs/plot.md`.

Everything below expands on that.

## Understanding the codebase

This repository is indexed into a local knowledge graph by the `codebase-memory` MCP server. Use it as
the first step in understanding anything here — it answers structural questions in one call that
otherwise cost a dozen file reads, and it does not go stale on file layout the way a remembered mental
model does.

Before running a broad `grep`/`Glob` sweep, or opening several files to work out how something fits
together:

1. **Search the graph.** `search_graph` for symbols and concepts; `search_code` for literal strings and
   non-code text, where the graph has nothing to offer.
2. **Identify what matters.** `trace_path` for call paths in either direction, `query_graph` for
   dependency and import relationships, `get_architecture` for a package/layer overview,
   `detect_changes` for the impact set of the current diff.
3. **Read only what those results name.** Open the specific files and line ranges the graph points at,
   not their neighbours.
4. **Re-index after meaningful structural change** — new or deleted modules, moved files, changed call
   or import relationships. Routine copy and style edits do not need it.

Direct file reads remain correct for a file you already know you need, and for prose — the planning
documents, this file, `docs/plot.md`. The rule is about *discovery*, not about every read.

Re-index with:

```
codebase-memory-mcp cli index_repository --repo-path "<repo root>"
```

or by calling `index_repository` through the MCP server.

## Project context

Read `docs/plot.md` early. It is the structural map — layers, module responsibilities, the homepage
component chain, and the load-bearing conventions that are invisible in the code but break things when
violated. It complements the graph: the graph says what calls what, `docs/plot.md` says why it is arranged
that way.

Keep `docs/plot.md` current as the project evolves — architecture and important modules, current
implementation state, major decisions, completed work, remaining work. Update it when the *structure*
changes, in the same pass as the re-index. Keep it concise: no routine task logging, no restating what
the code already makes obvious, no duplicating the planning documents. `planning/` stays authoritative
for spec, phase status, and decision history; `docs/plot.md` points there rather than copying.

## Planning documents

Before doing any planning or implementation work, read `planning/LOOP.md` first, then
`planning/SOURCE_OF_TRUTH.md`, `planning/MASTER_PLAN.md`, `planning/EXECUTION_ORDER.md`,
`planning/DECISIONS.md`, and `planning/PROGRESS.md` — in that order. `PROGRESS.md` says where the
project currently stands and what the next task is.

## Git and push workflow

- **Branch**: work directly on `main`. No feature branches, no PR review cycle.
- **Remote**: `origin` is already configured (`https://github.com/sujeth-dev/Assetly.git`). Push with a plain `git push`.
- **Commit granularity**: one commit per completed `MASTER_PLAN.md` phase (once its exit criteria are met and `PROGRESS.md`/`EXECUTION_ORDER.md` are updated), not one commit per individual task. Small supporting/tooling changes (docs, config) may get their own commit outside that rule when they aren't part of a phase.
- **Commit messages**: plain, professional prose describing what changed and why, written the way an engineer documents their own work — the kind of message that's still useful to someone reading `git log` months later. No internal task-ID shorthand (e.g. `FOUND-001`). No tool or automation attribution of any kind — nothing referencing AI, assistants, or code-generation tooling — anywhere: not in commit messages, not in commit trailers, not in code comments, not in branch names.
- Confirm `.env.local` and any other secrets are excluded (see `.gitignore`) before committing.
