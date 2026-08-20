# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6. Keep it operational and concise — a future agent should be able to read only this file plus `EXECUTION_ORDER.md` and know exactly where to pick up.

---

## Current Phase

Phase 1 — Shared site shell: **complete**. Every exit criterion is met and verified in a browser. Phase 2 (Hero and plate system) is unblocked.

Phase 0 is now **fully** complete: its one outstanding verification item (`FOUND-009`, the Google Fonts build fetch) was closed this cycle. `OD-05` remains deliberately deferred to Phase 3 per DEC-014 and blocks nothing before then.

## Current Task

`PLATE-001` — build the generic `Plate.tsx` (Phase 2, Hero and plate system)

## Status

The public site now has real chrome. `/` and `/about` render a fixed navigation and a three-zone footer, both driven by shared primitives and a single set of typed content constants. The homepage body is a deliberate placeholder — six section landmarks so that every nav and footer anchor resolves to something real and can be tested — which Phases 2 and 4–7 replace in the fixed §3 order.

Everything green: lint, typecheck, `next build`, 14 unit tests, 36 Playwright tests.

Two Phase 0 leftovers were resolved rather than carried forward:

1. **The font question is settled.** `npm run build` was re-run on this networked machine and succeeded, downloading all three families. DEC-015's self-hosting proposal is **Withdrawn**; `next/font/google` stays exactly as §7 specifies.
2. **`_to_delete/` is gone.** It held a 25MB partial `node_modules` that ESLint was crawling (1252 spurious errors) and that made Vitest time out waiting on a worker. Both symptoms were the folder, not the code. Verified no tracked file was inside it before deleting, and removed the now-pointless `.git/info/exclude` entry.

## Completed This Cycle

**Phase 0 close-out.** `FOUND-009` verified end to end and marked `[x]`; DEC-015 withdrawn; `_to_delete/` removed; `turbopack.root` pinned in `next.config.ts` so Turbopack stops walking up past the repository and picking up an unrelated `package-lock.json` from the user's home directory; `data-scroll-behavior="smooth"` added to `<html>` so Next.js knows the smooth scrolling in `globals.css` is deliberate and route transitions still jump rather than animate.

**`NAV-001` / `NAV-002` / `NAV-003` — navigation.** Fixed bar, transparent over the Hero, cross-fading to a Pitch pill after 24px of scroll over `--dur-toggle` with `--eio` — background, border and radius transition together so the pill condenses rather than switching on. The scroll listener coalesces to one read per frame via rAF. Mobile (≤700px) collapses to a two-stroke hamburger that rotates into an X and opens a full-width Pitch overlay per DEC-004, with staggered link entrance.

The overlay's accessibility work is the substantive part: `aria-expanded`/`aria-controls` on the toggle, focus moved to the first link on open, Tab cycled between the toggle and the links so focus cannot escape behind the panel, Escape closing and restoring focus to the toggle, `inert` while closed so the links are unreachable by keyboard as well as invisible, body scroll locked while open, and an automatic close if the viewport grows past the breakpoint.

**`FOOT-001` / `FOOT-002` — footer.** Three zones (brand / two nav groups / official information) on Pitch, recomposing to a single column under 900px with the dividing rules §17 asks for. Contact email and phone are real `mailto:`/`tel:` links; the full postal address appears here and nowhere else on the site, which is asserted by a test rather than left to convention. Copyright year is computed. Privacy Policy and Terms of Use render as labels, not anchors — Phase 9 (`LEGAL-002`) turns them into links once the routes exist, and shipping anchors to 404s in the meantime would be worse than shipping text.

**`SHELL-001` / `SHELL-002` — primitives.** `RevealOnScroll` implements the §8 reveal; its classes (`rv`, `rv-u`, `rv-d1..3`) are global rather than module-scoped because §8 defines one primitive shared across unrelated sections, and they are prefixed so single-letter names cannot collide with section markup. It writes the `in` class straight to the node instead of holding it in state — revealing is a one-way visual change, so routing it through React would re-render every section on scroll for no reason.

Also `Container` (the §9 page gutter), `Eyebrow` (the §7 label voice), `SerifHeading` (the three approved clamp sizes; heading level and visual size are separate props so document structure is never distorted to get a size), `LogoMark`, and `SiteLinkAnchor`.

**The brand mark is real, not a placeholder.** `assests/logo_2048 (1).png` is a genuine Assetly asset — a lowercase serif "a." — and is now served from `public/brand/assetly-mark.png`. `LogoMark` draws it as a CSS mask rather than an `<img>`, so it takes its colour from `currentColor`: Olive on Paper, Ivory on the two dark surfaces, from one file. See "Issues" for what this does *not* resolve.

**`lib/scroll.ts`.** The anchor-versus-route rule in one testable place: a section link is a bare fragment on `/` and becomes `/#section` anywhere else. `SiteLinkAnchor` consumes it so Nav and Footer cannot drift apart. `scrollToSection` returns `false` when the target is absent so the caller falls through to the browser instead of swallowing the click — which matters because §12 lets Trusted By render nothing.

**User-directed design changes (DEC-017).** Reviewed against the running site, three changes to §10: the nav wordmark is "assetly" alone (the Footer keeps the full lockup), set in DM Serif Display to match the Footer's brand treatment rather than the Inter Tight label voice, and the bar is inset by a new `--nav-gutter` so it spans nearly the full display width. `SOURCE_OF_TRUTH.md` §10 was updated and DEC-017 recorded.

**One defect found in browser review and fixed.** The brand mark vanished behind the mobile overlay, so the header stopped reading as a header while the menu was open. Menu state was lifted into `Nav`, which now stamps `data-menu-open` on the header; the brand sits above the overlay and takes the dark-surface colours. This was only visible by looking — every test passed both before and after.

## Files Changed

New: `public/brand/assetly-mark.png`; `app/(site)/layout.tsx`, `app/(site)/placeholder.module.css`; `components/brand/LogoMark.tsx` + `.module.css`; `components/nav/Nav.tsx` + `.module.css`, `components/nav/MobileMenu.tsx` + `.module.css`; `components/footer/Footer.tsx` + `.module.css`; `components/primitives/` — `Container`, `Eyebrow`, `SerifHeading`, `RevealOnScroll`, `SiteLinkAnchor` (with co-located `.module.css` where styled); `content/site/navigation.ts`; `lib/scroll.ts`; `tests/unit/scroll.test.ts`, `tests/e2e/shell.spec.ts`.

Modified: `styles/tokens.css` (`--dur-underline`, `--dur-menu`, `--nav-h`, `--nav-gutter`), `app/globals.css` (anchor `scroll-margin-top`, the shared reveal primitive, its reduced-motion neutralisation), `app/layout.tsx` (`data-scroll-behavior`), `app/(site)/page.tsx` and `about/page.tsx` (section landmarks), `next.config.ts` (`turbopack.root`), and the four planning documents.

Removed: `_to_delete/` (untracked junk) and its `.git/info/exclude` entry.

No new dependencies.

## Tests Run

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass — 0 problems |
| Type check | `npm run typecheck` | Pass — clean |
| Unit | `npm run test` | Pass — 14/14 (11 new, covering `lib/scroll.ts`) |
| End-to-end | `npm run test:e2e` | Pass — 36/36 (22 new shell tests) |
| Production build | `npm run build` | Pass — all routes, **including the Google Fonts fetch** |
| Visual review | dev server, 6 screenshots | Pass — desktop top/scrolled/footer, mobile top/menu/footer |

The shell suite covers: all four §10 links present; transparent-to-Pitch transition asserted on the computed background (`rgba(0,0,0,0)` → `rgb(33,36,26)`); section links scrolling without adding a fragment; the fixed bar never covering a scrolled-to section; About routing, and section links from `/about` resolving to `/#section` and working; the hamburger opening a genuinely full-width panel (measured at exactly the viewport width, `x = 0`); `aria-controls` resolving to a real element; the closed overlay being unfocusable; focus entering, cycling, and returning on Escape; a link closing the overlay; body scroll locked; all three footer zones with correct `mailto:`/`tel:` hrefs; the postal address appearing exactly once and only inside the footer; legal items present but deliberately not links; landmarks; a keyboard-only pass reaching nav then footer; visible focus outlines; and under `prefers-reduced-motion` — transitions collapsed to `0.12s`, revealed content at opacity 1 without waiting on an observer, and the overlay still functional.

## Issues / Blockers

1. **`OD-01` — still open, despite a usable mark.** The mark now on the site is a 2048px raster, not the vector lockup `OD-01` asks for. It is sharp at every size the site uses it, but a real SVG is still wanted for the Hero (Phase 2) and especially the loader (Phase 8.5), where it appears very large. Swapping it touches one file, `LogoMark.module.css`. **No favicon ships yet** — it should come from the same brand asset. Also worth noting for §11a: the brand mark is a lower-case "a.", whereas §11a repeatedly describes the loader's "**A**". Confirm which letterform the loader should use before building Phase 8.5.
2. **`OD-05` — no Firebase project.** Deferred by DEC-014. Blocks `TRUST-001`–`TRUST-004` (Phase 3) and `DEPLOY-001` (Phase 11). Blocks nothing in Phase 2.
3. **A Bottle-green underline on the Pitch surface is nearly invisible.** §10 specifies Bottle for the nav's hover underline and Pitch for the scrolled background; `#25453A` on `#21241A` is a very low-contrast pair. Implemented as specified rather than silently changed. The hover feedback does not depend on it — link colour also shifts Khaki → Ivory — so this is a polish question, not an accessibility failure. Flagged for `QA-005`/`QA-011`; if it should change, that needs a decision entry.
4. **`npm audit` reports 6 moderate advisories**, all from one transitive `uuid` dependency reached only through `firebase-admin`. Unchanged from last cycle and still deliberate: `npm audit fix --force` would downgrade `firebase-admin` 14.x → 10.x to fix a vulnerability in code nothing calls. Re-evaluate at Phase 3, when it becomes clear whether `admin.ts` is needed at all.

## Decisions Needed

- `OD-01` — vector logo/wordmark SVG, plus a favicon source; and which letterform the Phase 8.5 loader uses (see Issue 1).
- `OD-05` — Firebase project ID(s), dev/staging/production split, custom domain. Needed before Phase 3 starts.
- `OD-06` — admin auth method and authorised accounts. Pairs naturally with `OD-05`.
- `OD-02` — Hero plate artwork. Needed to *exit* Phase 2, not to start it; `PLATE-001` and `HERO-001` can proceed first.

## Next Recommended Task

`PLATE-001` — build `components/plate/Plate.tsx` as a genuinely generic traced-line SVG component: props for path data, opacity target, draw duration (default `--dur-draw`, 2.6s) and easing (`--eio`), a `.go` trigger class, and a reduced-motion fallback showing the fully-drawn final state instantly.

Build it for three consumers, not one — Phase 4's four Compare plates and Phase 6's six sector plates reuse it unmodified, and `MASTER_PLAN.md` makes that reuse a Phase 2 exit criterion. Then `PLATE-002` (`useDrawOnEnter`) and `HERO-001`.

Note the Phase 2 scope boundary (DEC-013): the Hero ships a **simple interim entrance** fired on mount. The blink/recede opening loader is Phase 8.5. Do build the Hero's final "A" mark position so Phase 8.5 has a real hand-off target — and see Issue 1 about which letterform that is.

## Notes for Next Agent

- Read `LOOP.md` before doing anything — it defines the read → orient → plan → execute → verify → update cycle this project runs on.
- Run `npm install` first; `node_modules` is gitignored.
- Run `npm run build` (or `npm run dev`) once on a clean checkout before `npm run typecheck`. Next.js 16 generates route types into `.next/types`, and `tsc --noEmit` fails with `TS2304: Cannot find name 'LayoutProps'` until they exist.
- Only one `next dev` can run per directory. If `npm run test:e2e` reports "Another next dev server is already running", stop the other one — Playwright starts its own.
- Do **not** remove `agentRules: false` from `next.config.ts` — it stops Next.js 16 from generating `AGENTS.md` and overwriting this repository's `CLAUDE.md`.
- Reuse the shell rather than rebuilding it: `Container` for the page gutter, `Eyebrow` for label text, `SerifHeading` for headings, `RevealOnScroll` + `rv-u`/`rv-d1..3` for entrances, and `SiteLinkAnchor` for any link to a homepage section.
- Give every new homepage section the `id` from `HOME_SECTION_IDS` in `lib/scroll.ts`. The nav and footer already link to all six, and `app/(site)/page.tsx` holds placeholders to delete as the real ones land.
- Consume design values through the tokens in `styles/tokens.css`. If a section needs a value that is not there, check whether `SOURCE_OF_TRUTH.md` actually specifies it before inventing one.
- Every animated component owes its own `prefers-reduced-motion` fallback (§8). The blanket rule in `globals.css` is a backstop, not a licence to skip it — and note the standard it set: content must be *present* under the preference, not merely revealed faster.
- Look at the result in a browser before calling a UI task done. The one real defect this cycle passed every test and was visible only on screen.
- Treat `getDb()`, `getStorageClient()`, `getAuthClient()` and their admin equivalents as nullable — they return `null` until `OD-05` is resolved, and §12/§18/§21 require silent degradation rather than a visible error.
- `DESIGN_SYSTEM.md` is a valid source for tokens, motion primitives, and patterns but is **not** authoritative on section order or mobile nav behaviour — see `DECISIONS.md` DEC-004 and DEC-005.
- Do not fabricate any business fact, statistic, partner name, or legal wording not already in `SOURCE_OF_TRUTH.md` — open an `OPEN DECISION` in §25 instead.
