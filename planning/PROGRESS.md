# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6. Keep it operational and concise — a future agent should be able to read only this file plus `EXECUTION_ORDER.md` and know exactly where to pick up.

---

## Current Phase

Phase 0 — Repository and project foundation: **complete**, with one item deliberately deferred (`OD-05`) and one environment-bound check outstanding (Google Fonts). Phase 1 is unblocked.

## Current Task

`NAV-001` — Build `Nav.tsx` (Phase 1, shared site shell)

## Status

The repository is a working Next.js 16 / React 19 / TypeScript project. Design tokens, the global reset, base typography, the route skeleton, env-driven Firebase initialisation, and both test runners are all in place and verified. `npm run dev` serves `/`, `/about`, and `/admin`; `npm run test` and `npm run test:e2e` pass; `npm run lint` and `npm run typecheck` are clean.

Two things are knowingly incomplete, both recorded as decisions rather than silently patched:

1. **No Firebase project exists** (`OD-05` deferred — `DECISIONS.md` DEC-014). The SDK reads from environment variables and stays uninitialised when they are absent. Nothing in Phase 1 or Phase 2 needs it.
2. **The `next/font/google` download is unverified** (`DECISIONS.md` DEC-015). Everything else about font wiring is done and type-checks; only the build-time fetch is unproven, for an environment reason.

## Completed This Cycle

`FOUND-002` — **Design tokens** (`styles/tokens.css`). Every colour in §6 (with `--soot` omitted per §6's explicit note), the three font-family tokens from §7, both easing curves and the motion durations/stagger steps from §8, and the spacing clamps from §9. Two judgement calls, both annotated in the file: §9 gives card padding as a *range*, so it is split into `--card-pad` (compact) and `--card-pad-lg` (roomy) rather than collapsing to one midpoint; and §7 fixes the UI label voice but never states a base body size, so `--body-size` / `--body-leading` are document-root implementation defaults that any section with its own scale (e.g. the Hero subline, §11) overrides locally.

`FOUND-003` — **Global reset, base typography, fonts** (`app/globals.css`, `app/layout.tsx`).

- Reset, `--paper` page surface, `--ink` text, and the `--s` serif as the document default. `app/globals.css` imports `styles/tokens.css` once; components consume tokens only.
- Heading defaults use `--d` with `font-variant-numeric: tabular-nums` (§7). The recurring emphasis device — italic spans inside headings rendering in `--moss` — is attached to `h1 i … h4 i` directly, so it holds wherever a heading is authored rather than depending on a utility class.
- The create-next-app `prefers-color-scheme: dark` block is **gone**, and `color-scheme: light` is set explicitly. The approved design is a single light paper surface (§6); there is no dark mode and nothing should be built assuming one.
- Focus is `2px solid var(--bottle)` with offset, per §20's visible-focus requirement.
- The mandatory `prefers-reduced-motion: reduce` block from §8 is in place, clamping animation and transition durations to `--dur-reduced` (0.12s) and disabling smooth scrolling. It is a safety net: per §8 each animated component still owes its own explicit fallback.
- DM Serif Display, DM Serif Text, and Inter Tight load via `next/font/google` with `display: swap`, exposed as CSS variables that `tokens.css` maps onto `--d`/`--s`/`--u`. The token file uses the in-`var()` fallback form (`var(--font-dm-serif-display, "DM Serif Display")`) so a missing variable degrades to Georgia / system-ui instead of invalidating the whole declaration.

`FOUND-004` — **Folder structure**. `app/(site)/page.tsx` (home) and `app/(site)/about/page.tsx`, `app/admin/page.tsx`, plus `components/`, `lib/`, `content/`. Each of those three directories carries a short `README.md` instead of an empty `.gitkeep`, stating the rule that applies inside it — co-located CSS Modules and mandatory reduced-motion fallbacks for `components/`, the DEC-011 "Firestore backs Trusted By only, everything else is a typed constant here" boundary for `content/`. `/admin` already carries `robots: { index: false, follow: false }` (§22) because the route now exists.

`FOUND-005` / `FOUND-006` — **Firebase, wired but unconfigured.** See `DECISIONS.md` DEC-014.

- `lib/firebase/client.ts` — lazy `FirebaseApp` plus `getDb()` / `getStorageClient()` / `getAuthClient()`, all returning `null` when `isFirebaseConfigured()` is false. Reuses an existing app instance so Fast Refresh does not re-initialise.
- `lib/firebase/admin.ts` — the same shape for the Admin SDK, under a named app (`assetly-admin`) so it cannot collide with a default app, restoring escaped newlines in the service-account private key.
- `.env.local.example` committed and confirmed **not** matched by `.gitignore`'s `.env*.local` pattern; no real `.env.local` exists.
- `firebase.json` (Firestore/Storage rules paths + emulator ports), `firestore.indexes.json`, and **deny-by-default** `firestore.rules` / `storage.rules`, so a project created later is closed rather than open until `TRUST-004` writes the real rules against §18.

`FOUND-007` — **Test runners.** Vitest (`vitest.config.mts`, jsdom, `@/` alias, `tests/unit/setup.ts` with a `matchMedia` stub so reduced-motion branches are testable from Phase 2 onward) and Playwright (`playwright.config.ts`, Chromium, dev-server `webServer`). Scripts added: `typecheck`, `test`, `test:watch`, `test:e2e`. The config file is `.mts` because Vite warns on ESM-in-CJS for a `.ts` config.

One portability note in `playwright.config.ts`: if `PLAYWRIGHT_CHROMIUM_EXECUTABLE` is set it is used as the browser `executablePath`, otherwise Playwright uses its own download. That exists because this build environment ships a preinstalled Chromium at a revision older than Playwright 1.62 expects. On a normal machine the variable is simply unset and nothing changes.

`FOUND-008` — **Closed as not applicable** (`DECISIONS.md` DEC-016). No `.html` file exists in the working tree, and `git log --all --diff-filter=A` confirms none has ever been committed. No `reference/` folder was created. `DESIGN_SYSTEM.md` is now the only surviving description of the `home-2.html` prototype's motion and token behaviour.

`FOUND-009` — **Verification.** Results in the table below.

## Files Changed

New: `styles/tokens.css`; `app/(site)/page.tsx`, `app/(site)/about/page.tsx`, `app/admin/page.tsx`; `components/README.md`, `lib/README.md`, `content/README.md`; `lib/firebase/client.ts`, `lib/firebase/admin.ts`; `.env.local.example`, `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `storage.rules`; `vitest.config.mts`, `playwright.config.ts`, `tests/unit/setup.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`, `tests/e2e/responsive.spec.ts`.

Modified: `app/layout.tsx`, `app/globals.css`, `package.json` (scripts + deps), `package-lock.json`, `planning/EXECUTION_ORDER.md`, `planning/DECISIONS.md`, `planning/PROGRESS.md`.

Removed: `app/page.tsx` (moved into the `(site)` route group).

Dependencies added: `firebase`, `firebase-admin`; dev: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`.

## Tests Run

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass — 0 errors, 0 warnings |
| Type check | `npm run typecheck` | Pass — clean, including both Firebase modules |
| Unit | `npm run test` | Pass — 3/3 (runner, jsdom, `matchMedia` stub) |
| End-to-end | `npm run test:e2e` | Pass — 14/14 |
| Production build | `npm run build` | Pass on all 4 routes (`/`, `/about`, `/admin`, `/_not-found`) **when the font fetch is taken out of the picture**; fails on exactly 3 `next/font/google` fetch errors and nothing else when it is not — see below |
| Visual render | screenshots at 320 / 768 / 1920px | Pass — `--paper` surface, `--ink` text, serif heading, no overflow, type scale visibly grows with viewport |

The e2e suite covers: root route 200 + `<title>Assetly</title>` + `<h1>`; `--paper` resolving to `#f6f4ec` and actually painting the body; the heading font chain reaching the browser; `/about` and `/admin` rendering; no horizontal overflow at 320, 375, 414, 640, 768, 1024, 1280, 1440, 1920px; `--gutter` pinned to 20px at 320px and 60px at 1920px and fluid between; body type scaling 15px → 17px across that range.

**How the build was verified, stated plainly.** With `next/font/google` in `app/layout.tsx`, `npm run build` fails in this environment with three errors, all of them `Failed to fetch <font> from Google Fonts` — `fonts.googleapis.com` and `fonts.gstatic.com` are both blocked at the egress proxy (`CONNECT tunnel failed, 403`). Lint and typecheck pass unaffected. To prove nothing *else* in Phase 0 was broken, the build, the e2e suite, and the screenshots were run once against a temporary local stub of `app/layout.tsx` with the font imports removed; that stub was then discarded and the committed file loads the fonts exactly as §7 specifies. Two consequences worth knowing: the screenshots show Georgia, the fallback, rather than DM Serif; and the e2e assertion that the heading font chain contains "DM Serif Display" passed via the token fallback chain, not via a downloaded font. Re-running `npm run build` on a networked machine is what actually closes this out.

## Issues / Blockers

1. **`OD-05` — no Firebase project.** Deferred by DEC-014. Blocks `TRUST-001`–`TRUST-004` (Phase 3) and `DEPLOY-001` (Phase 11). Blocks nothing in Phase 1 or Phase 2.
2. **Google Fonts build fetch unverified.** DEC-015 proposes the `next/font/local` fallback but is deliberately **not applied**. Try `npm run build` on a networked machine first; if it succeeds, mark DEC-015 `Withdrawn`.
3. **`npm audit` reports 6 moderate advisories**, all from one transitive `uuid` dependency reached only through `firebase-admin`. `npm audit fix --force` would downgrade `firebase-admin` from 14.x to 10.x — a breaking change to fix a vulnerability in code nothing currently calls. Left alone deliberately. Re-evaluate at Phase 3, when it becomes clear whether `admin.ts` is needed at all: Phase 3's own file list uses the client SDK plus security rules, so `firebase-admin` may turn out to be removable rather than upgradable.
4. **`OD-01` — no vector logo/wordmark.** Phase 1 can build Nav and Footer structurally with a placeholder mark, but must not be called visually final. No favicon ships either; it should come from the same brand asset.

## Decisions Needed

- `OD-05` — Firebase project ID(s), dev/staging/production split, custom domain. Needed before Phase 3 starts.
- `OD-01` — Vector Assetly logo/wordmark SVG, plus a favicon source. Needed before Phase 1 is visually final.
- `DEC-015` — confirm or withdraw, after one build attempt on a networked machine.
- `OD-06` — admin auth method and authorised accounts. Not urgent, but pairs naturally with `OD-05`.

## Next Recommended Task

`NAV-001` — build `components/nav/Nav.tsx` per §10: fixed, transparent over the Hero, cross-fading to the `--pitch` surface on scroll over `--dur-toggle` (0.7s) with `--eio`, logo + "Assetly Leasing" as one clickable unit, desktop link row (Compare · Sectors · About · Contact) in the §7 UI label voice.

Phase 1's dependency line in `MASTER_PLAN.md` is "Phase 0 complete", which is satisfied: the two outstanding Phase 0 items are a deferred Firebase project and an unverified font download, and neither is an input to Nav, Footer, or the shared primitives. Build with a placeholder mark and keep the logo swap to a single component (`OD-01`).

## Working-copy Housekeeping

Two things about the checkout itself, not about the code:

- **`_to_delete/` exists and should be deleted by hand.** This working copy was reached through a sandbox that can create and rename files but cannot unlink them, so anything that needed removing was moved into `_to_delete/` instead: three stray `.gitkeep` files, a file-transfer archive, and a pile of leftover `.git/objects/*/tmp_obj_*` temporaries and stale `.git/index.lock` files. None of it is tracked, and `.git/info/exclude` carries a local-only entry so it does not show up in `git status`. Delete the folder, then drop that entry; nothing in the project references either.
- **`node_modules/` was moved into `_to_delete/` too, so a fresh `npm install` is required before anything runs.** It contained a partial install (2 entries) left behind by a second session that was building Phase 0 into this same folder in parallel. That session's partial work — a leaner `tokens.css`, `.gitkeep` placeholders, a `firebase.json` without the emulator block, `.env.local.example` using `FIREBASE_*` rather than `FIREBASE_ADMIN_*` names, and no test setup — was replaced wholesale by the verified tree recorded above, at the user's direction. If any of it was wanted, it is recoverable only from that session, not from this repository's history.

## Notes for Next Agent

- Read `LOOP.md` before doing anything — it defines the read → orient → plan → execute → verify → update cycle this project runs on.
- Run `npm install` first; `node_modules` is gitignored.
- Run `npm run build` (or `npm run dev`) once on a clean checkout before `npm run typecheck`. Next.js 16 generates route types into `.next/types`, and `tsc --noEmit` fails with `TS2304: Cannot find name 'LayoutProps'` until they exist.
- Do **not** remove `agentRules: false` from `next.config.ts` — it stops Next.js 16 from generating `AGENTS.md` and overwriting this repository's `CLAUDE.md`.
- Consume design values through the tokens in `styles/tokens.css`. If a section needs a value that is not there, check whether `SOURCE_OF_TRUTH.md` actually specifies it before inventing one.
- Every animated component owes its own `prefers-reduced-motion` fallback (§8). The blanket rule in `globals.css` is a backstop, not a licence to skip it.
- Treat `getDb()`, `getStorageClient()`, `getAuthClient()` and their admin equivalents as nullable — they return `null` until `OD-05` is resolved, and §12/§18/§21 require silent degradation rather than a visible error.
- `DESIGN_SYSTEM.md` is a valid source for tokens, motion primitives, and patterns but is **not** authoritative on section order or mobile nav behaviour — see `DECISIONS.md` DEC-004 and DEC-005.
- Do not fabricate any business fact, statistic, partner name, or legal wording not already in `SOURCE_OF_TRUTH.md` — open an `OPEN DECISION` in §25 instead.
