# PLOT — Structural Map of the Assetly Site

Persistent orientation context: how this codebase is *shaped*. It exists so an agent can find the
right file without grepping the tree.

It is deliberately **not** a second copy of the planning documents. `planning/` remains authoritative
for product spec, phase state, and decision history; this file names the structure and links out.

| For | Read |
|---|---|
| What's approved and locked | `planning/SOURCE_OF_TRUTH.md` |
| Phase specs and exit criteria | `planning/MASTER_PLAN.md` |
| Task checklist and status markers | `planning/EXECUTION_ORDER.md` |
| Why something is the way it is | `planning/DECISIONS.md` |
| Where the project stands right now | `planning/PROGRESS.md` |
| How to run a work cycle | `planning/LOOP.md` |

---

## Architecture

Next.js 16 App Router, React 19, TypeScript, CSS Modules, Firebase (client + admin SDKs). Vitest for
units, Playwright for flows.

Four layers, confirmed against the dependency graph — dependencies point downward only:

```
app/            routes and shells      app/(site)/{page,layout,about}, app/admin, app/layout
components/     section components     hero compare why-us sectors contact nav footer brand
components/primitives  +  components/plate     ← core, high fan-in, no outbound deps
lib/            hooks and pure logic                                ← core, high fan-in
content/        copy and artwork data (no behaviour)
```

**`components/primitives/`** (fan-in 23) — `Container`, `Eyebrow`, `SerifHeading`, `RevealOnScroll`,
`SiteLinkAnchor`. Every section composes these; changing one touches the whole site.

**`lib/motion/`** (fan-in 16) — the motion system, and the densest cluster in the repo. Scroll
(`useScrollTick`, `useScrollFocus`, `scrollFocus`), drawers (`useDrawerOpenness`, `drawerOpenness`),
draw-on-enter (`useDrawOnEnter`), rotation (`sectorRotation`, `useOneOutOneIn` — `paused` stops the
grid, `holdSlot` steps past one slot), media queries
(`useMediaQuery`, incl. `usePrefersReducedMotion`), and the Hero opening
(`useHeroLoaderSequence`, `homeOpeningReplay`).

**`content/`** holds copy and plate artwork as data — `content/plates/*` are SVG plate definitions,
`content/site/*` and `content/{about,compare,contact,sectors,why-us}/*` are copy. Copy changes belong
here, not in components. `ABOUT_CONTENT.paragraphs` is an ordered, owner-verbatim array rather than a
single body string; the About route maps it without rewriting it (DEC-050).

One file there is **generated, not authored**: `content/plates/bengaluru-map.ts` is OpenStreetMap
geometry for the six kilometres around the office, projected and simplified into static paths
(DEC-033). Its header carries the bounding box, projection and simplification tolerances. Regenerate
it from Overpass to change the window; hand-editing the numbers makes the map geographically wrong,
which is the one thing it exists to prevent.

**`lib/firebase/`** splits `client.ts` and `admin.ts`, each behind an `isFirebaseConfigured()` guard so
the site renders without credentials. Firestore is scoped to Trusted-By content only (DEC-011).

### Section anatomy

Sections follow one shape: `XSection.tsx` (composition) + `X.module.css` (style) + optional
interactive children. Compare and Contact each carry a responsive pair — `CalculatorDrawer` /
`CalculatorSheet`, `ContactDrawer` / `ContactSheet` — desktop drawer, mobile sheet, not one component
reflowed.

### The homepage chain

```
HomePage → HeroOpening → HeroLoader          (opening overlay)
                       → Hero                (hands off to the Hero mark)
         → CompareSection → WhyUsSection → SectorsSection → ContactSection
```

`HeroOpening` owns the loader/Hero hand-off; `useHeroLoaderSequence` drives phases and calls
`completeHomeOpening`. Replay is module-scope state in `homeOpeningReplay.ts` — not storage — so the
opening plays on every full document load of `/` and never on client-side navigation.

---

## Load-bearing conventions

Constraints that are invisible in the code but break things when violated. Full reasoning in
`DECISIONS.md`; these are the ones that change how you write a patch.

- **Reduced motion is mandatory.** Anything animated neutralizes under `prefers-reduced-motion`
  (SOURCE_OF_TRUTH §8).
- **Mobile is recomposed, not shrunk** (§9) — hence the drawer/sheet pairs.
- **Section blocks size against viewport height, not width** (DEC-028). Width-capped grid cells were
  the defect the automated suite could not see.
- **Use `--nav-block`, never `--nav-h`, to clear the fixed nav** (DEC-020).
- **Never invent business facts.** Missing copy becomes an `OPEN DECISION` in §25, not a plausible
  placeholder.
- **`overflow: clip`, never `hidden`, on a box that hides something parked outside it** (DEC-036).
  `hidden` makes a scroll container, and anything — focus, find-in-page, script — will scroll it to
  reach what is parked there. That was the contact drawer appearing to shove the whole composition
  sideways.
- **The document reserves its scrollbar gutter** (DEC-036), so a fixed box laid out in the initial
  containing block stops short of the window edge. Anything meant to cover the whole window uses
  `100vw`, and never mix `vw` with `%` across that boundary — the Compare column and its drawer both
  read one `--compare-drawer-width` for exactly that reason.
- **Compare's focus effect rests across a band, not at a point** (DEC-034). A slide is sharp for 0.26
  viewport heights either side of centre (0.34 on mobile) before any blur begins.
- **Compare tiers are qualitative.** The shared set is `minimal | low | mid | high`; `minimal` is the
  fourth, 16% presentation step and is used only for Upfront Cash's Lease bar (DEC-048). It is not a
  numeric financing claim.
- **`.face` is `overflow: hidden`** — a flip card shorter than its copy truncates it silently, with no
  test failure. Measure at both breakpoints.

### Testing traps

- `test.use({ reducedMotion })` does not reach the page here. Use `page.emulateMedia({ reducedMotion: "reduce" })`.
- Unregistered custom properties read back as literal `clamp(...)` text and parse as `NaN`. Measure
  elements, don't parse tokens.
- Run Playwright with `--workers=1`; parallel workers produce false failures on the WebKit mobile sheet.
- `playwright.config.ts` sets `reuseExistingServer` — an existing dev server on :3000 is reused.

---

## State

Phases 0–2, 4–8 and 8.5 complete on `main`, together with a refinement pass over the shipped
homepage (DEC-032–DEC-039). `phase/hero-opening-loader` is **merged**; `HeroLoader`, `HeroOpening`,
`useHeroLoaderSequence` and `homeOpeningReplay` are on `main`, and every spec that loads `/` now
loads the ~4.8s opening with it.

Two conventions the opening imposes: `HERO_LOADER_DURATIONS.signature` and the
`loaderDoubleBlink` animation duration in `Hero.module.css` are the same number in two places and
must be changed together; and the loader's Hero destination is measured from
`[data-hero-mark-target]` rather than parsed from its `clamp()` token.

Phase 3 (Firebase) is blocked on `OD-05`/`OD-06`. Open items `OD-01`, `OD-02`, `OD-13`, `OD-14` gate
Phase 10 / deployment.

`planning/PROGRESS.md` is the live record — it is rewritten each cycle and wins over this summary.

---

## Maintaining this file

Update `plot.md` when the **structure** changes: a new module or layer, a dependency direction, a new
load-bearing convention, or a phase moving to done. Do not log routine tasks here — that is
`PROGRESS.md`'s job. Re-index Codebase Memory in the same pass.
