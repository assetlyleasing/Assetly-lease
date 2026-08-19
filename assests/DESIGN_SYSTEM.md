# Assetly — Design System Blueprint

Extracted from `home-2.html` (the live homepage). This is a **content-agnostic**
reconstruction guide: colors, type, spacing, motion, layout patterns, and the
calculator's interaction model — not the copy. Use it to build new pages/decks
that feel like the same product.

---

## 1. Brand feel

Warm, paper-toned, editorial-financial. Serif display type carries authority;
a small sans (Inter Tight) handles all UI chrome (labels, nav, buttons) in
uppercase with wide tracking. Motion is slow, eased, and confident — nothing
snaps. One accent color (bottle green) is used sparingly (<4% of surface) as
the "click here / this matters" signal. Two dark surfaces (nav-on-scroll,
footer) puncture an otherwise light, cream page.

---

## 2. Color tokens

```css
--paper:  #F6F4EC;  /* page base — warm, never white */
--field:  #E7E2CE;  /* recessed/contrast sections (e.g. calculator panel) */
--ink:    #26261B;  /* primary text */
--olive:  #40402D;  /* logo mark + icon fills on light surfaces */
--moss:   #5C5C46;  /* italic emphasis words, eyebrows, secondary labels */
--line:   rgba(38,38,27,.15);  /* hairline borders/dividers everywhere */
--bottle: #25453A;  /* THE accent — CTAs, active states, hover underlines */
--pitch:  #21241A;  /* dark surface — nav-on-scroll bg, footer bg (Dark Olive) */
--khaki:  #B1AD77;  /* accent text/underline ON dark surfaces (Muted Khaki) */
--ivory:  #E7E3D4;  /* logo/wordmark text ON dark surfaces (Warm Ivory) */
--soot:   #1D1D14;  /* unused reserve, near-black */
```

**Rule of thumb:** on the light `--paper` background, brand marks/icons use
`--olive`; the one interactive accent is always `--bottle`. On dark surfaces
(`--pitch`), the logo/wordmark switches to `--ivory` and everything secondary
(nav links, dividers, taglines) uses `--khaki`.

## 3. Typography

```css
--d: "DM Serif Display", serif;              /* headlines, numerals, eyebrighted "n" indices */
--s: "DM Serif Text", serif;                 /* body copy, lede paragraphs, italics */
--u: "Inter Tight", system-ui, sans-serif;   /* ALL UI: nav, buttons, labels, footer */
```

- Google Fonts load: `DM+Serif+Display:ital@0;1&family=DM+Serif+Text:ital@0;1&family=Inter+Tight:wght@400;500`
- Headline sizing is always `clamp()` — never a fixed px value. Typical range:
  hero `h1` = `clamp(31px,6.4vw,76px)`, section `h2` = `clamp(24-27px, 4.4-5.4vw, 48-64px)`.
- Italic (`<i>`) spans inside headings are always `color:var(--moss)` — the
  single recurring emphasis device across every heading in the site.
- UI text (`--u`) is uniformly: small (9–11px), uppercase, letter-spacing
  `.17–.26em`. This is the site's "label" voice — distinct from the serif
  "content" voice.
- Numeric indices (`01`, `02`, price figures) use `--d` with
  `font-variant-numeric:tabular-nums`.

## 4. Spacing system

No fixed spacing scale — everything is `clamp(min, vw/vh-preferred, max)` so
sections compress gracefully instead of hard-breakpointing. Recurring bands:

| Use | Pattern |
|---|---|
| Section vertical padding | `clamp(56px,11vh,120px)` |
| Slide (argument) vertical padding | `clamp(50px,9vh,90px)` |
| Card internal padding | `clamp(22–28px, 3–4vh, 32–48px)` |
| Heading-to-body gap | `16–20px` fixed, or `clamp(26px,4.4vh,44px)` for larger jumps |
| Horizontal page gutter | `clamp(20px,5vw,60px)` (the `.pad` utility class) |

Borders are always `1px solid var(--line)` — grids are built by having
adjacent cards share a border-top/border-left on the container and
border-right/border-bottom on each cell (no gap, no gutters — a drawn
ledger-line look).

## 5. Motion primitives

Two easing curves cover the entire site:

```css
--e:   cubic-bezier(.22,1,.36,1);   /* entrances — fast start, soft settle */
--eio: cubic-bezier(.65,0,.35,1);   /* toggles/hovers — symmetric ease-in-out */
```

**Reusable animation classes:**

- `.m > span` — line-mask reveal: text sits in an `overflow:hidden` wrapper,
  spans start `translateY(105%)` and rise into place (`1.25s var(--e)`).
  Used for hero headline lines, staggered via `nth-of-type` delays.
- `.fi` — simple fade-in (`1.1s var(--e)`), used for lede text, tags, with
  manual `animation-delay` staggering (e.g. 0.8s, 1.3s, 1.75s in the hero).
- `.rv .u` — scroll-triggered reveal: `opacity:0;translateY(16px)` →
  `opacity:1;translateY(0)` on `1s var(--e)`, gated by IntersectionObserver
  adding `.in` to the parent `.rv`. Stagger via `.d1/.d2/.d3`
  (`transition-delay: .12s/.24s/.36s`).
- `.hero .mark` — settle-in: `opacity:0 translateY(20px) scale(.95)` →
  identity, `1.7s var(--e)` with a small delay.
- `.plate [stroke]` — SVG line-drawing effect via `stroke-dasharray:2200` →
  `stroke-dashoffset:0` over `2.6s var(--eio)` when `.go` class is added
  (typically alongside `.rv.in`).
- `prefers-reduced-motion: reduce` — every animation above is neutralized
  (final state applied instantly, transitions clamped to `.12s`). Always
  carry this block forward.

**Continuous scroll-scrubbing** (not transition-based — driven every frame):
the `.arg .body` focus effect and the calculator drawer both use a single
`requestAnimationFrame` loop keyed off `scroll`/`resize`, reading
`getBoundingClientRect()` and writing inline `style.opacity/transform`
directly each tick. This is reserved for effects that must track scroll
position exactly (parallax focus, drawer openness) — everything else uses
IntersectionObserver + CSS transitions, which is cheaper and simpler.

## 6. Slide-by-slide layout structure

The homepage is a vertical "deck" — each section is a full (or near-full)
viewport-height beat, in this order:

1. **Hero** (`min-height:100svh`) — centered mark icon → serif h1 (2-line
   mask reveal) → lede paragraph → bottom-anchored tag row. A faint
   line-drawn "plate" SVG sits behind everything at 16% opacity as texture.
2. **Trust strip** — thin horizontal band, infinite auto-scrolling logo
   marquee (`animation:scroll-logos 32s linear infinite`, duplicate the
   logo set once to loop seamlessly at `translateX(-50%)`).
3. **Argument sequence** — 3× `.arg` slides (`min-height:104svh` each),
   each: small plate icon → tabular-num index (`01/02/03`) → serif h2 with
   one italicized word → serif body paragraph. This is the "one idea per
   screen" spine of the page — each slide is a single, large, centered
   claim.
4. **Value grid** — `.rv` reveal section, 2×2 (collapsing to 1-col under
   640px) bordered card grid, eyebrow label above it.
5. **Instrument / calculator** — see §8. In `home-2.html` this is no longer
   in-flow; it's a persistent drawer that auto-opens across the hero + the 3
   argument slides (see §7).
6. **Sectors** — bordered 4-up card grid (2-up / 1-up responsive), auto-
   rotating content (see §7).
7. **Close** — centered final CTA slide, serif h2 + p + bottle-bordered
   button.
8. **Footer** — dark (`--pitch`) bar, centered horizontal link row, small
   uppercase khaki text, ivory wordmark.

Pacing: hero and the 3 argument slides are the "attention" beats — each
demands ~one full scroll of dwell time before the next reveals. Value
grid/sectors/close are comparatively denser, browsed-not-read sections.

## 7. Interactive / navigation behavior

- **Nav**: fixed, transparent over the hero, cross-fades to a solid dark
  pill (`nav.solid`, `rgba(pitch,.92)`) once scrolled — `.7s` ease on both
  background and border-color. Nav links themselves fade/slide in
  (`opacity 0→1, translateY -6px→0`) only once solid (i.e., they're hidden
  over the hero image, not just low-contrast).
- **Scroll-linked focus**: within the argument sequence, a single `tick()`
  RAF loop computes each `.arg .body`'s distance from viewport-center and
  maps it to opacity/blur/translateY — the on-screen slide is sharp, its
  neighbors dim and blur. This is what makes the "one idea per screen"
  structure read as directed attention rather than a plain scroll.
- **Auto-rotating cards** (Sectors): `setInterval` every 3.8s swaps one
  card's content at a time (fade to `.swap` opacity 0 for 450ms, refill
  text, fade back) — a slow one-out-one-in cycle across a pool of 6 sector
  entries feeding 4 visible slots, not a full-grid paginator.
- **Mobile nav**: under 660px, all links except `.only` (Contact) hide;
  remaining chrome stays static (no hamburger — deliberately minimal).

## 8. Calculator: structure, integration, and scroll-scrubbing

This is the site's signature interactive element — a financial position
calculator (Lease vs Loan vs Purchase) delivered as a **persistent,
scroll-scrubbed side drawer**, not an in-flow section.

**Markup** (fixed chrome, sits after `</footer>`, outside all `.rv` reveal
gating since its own transform is its reveal):

```html
<div class="calc-drawer" id="calcDrawer">
  <button class="calc-tab" id="calcTab" aria-expanded="false" aria-controls="calcPanel">
    <span class="calc-tab-arrow">‹</span>
  </button>
  <div class="calc-panel" id="calcPanel">
    <div class="eyebrow u">…</div>
    <h2 class="u">…</h2>
    <div class="modes u" role="group">
      <button aria-pressed="true"  data-m="0">Mode A</button>
      <button aria-pressed="false" data-m="1">Mode B</button>
      <button aria-pressed="false" data-m="2">Mode C</button>
    </div>
    <div class="bars u">
      <div class="bar lead"><div class="track"><i id="b0"></i></div><div class="nm"></div><div class="vl" id="v0"></div></div>
      <div class="bar">…b1…</div>
      <div class="bar">…b2…</div>
    </div>
    <p class="readout u" id="read"></p>
    <div class="ctrl u">
      <label>…<output id="avOut"></output></label>
      <input id="av" type="range" min="50" max="1200" step="10" value="400">
    </div>
    <div class="disc u">Illustrative disclaimer copy.</div>
  </div>
</div>
```

**Visual mechanics:**
- Tab: small circular arrow button (no text label at any breakpoint),
  `background:var(--bottle)`, fixed to the viewport edge (right-center on
  desktop, bottom-center on mobile). Arrow rotates 180° between closed/open.
- Panel: desktop = right-side drawer, `width:clamp(340px,44vw,640px)`,
  `background:var(--field)`, slides via `translateX`. Mobile (≤700px) =
  bottom sheet, `max-height:42vh`, slides via `translateY`, rounded top
  corners.
- Bars: 3-column bar chart, height driven by inline `style.height` (%)
  computed from the active mode's data — `transition:height 1.05s var(--e)`
  gives the classic "counting up" bar-chart feel on mode/value change.

**Integration model — the important part:**
1. **Gated to appear only past the hero.** A body class (`calc-enabled`)
   toggles opacity/pointer-events for the tab+panel — completely invisible
   and non-interactive during the hero slide, no matter what.
2. **Openness is a continuous 0–1 value, not a boolean.** It's recomputed
   every scroll frame as a function of scroll position relative to two
   measured zones (hero bottom → value-grid top), with a soft "band" (~40%
   of viewport height) at each edge over which it eases from 0 to 1 and
   back — so opening/closing feels like a physical panel being scrubbed
   open by the scroll itself, synced to the same RAF tick that drives the
   `.arg` focus effect.
3. **Content reflows with it**: on desktop, the argument slides' width is
   pushed inline (`width:100-openness*44%`) in lockstep with the drawer —
   the page visibly makes room for the panel rather than the panel
   overlaying content.
4. **Mode auto-sync**: whichever `.arg` slide currently has focus (per the
   same distance-from-center calculation) sets the calculator's active mode
   — mode 0 for slide 1, mode 1 for slide 2, mode 2 for slide 3 — so the
   numbers on screen always match the claim currently being read.
5. **Manual override**: clicking the tab (or a "your position" nav link)
   sets an override flag and tweens openness to a target with a cubic
   ease-out over 500ms — this works identically whether the user is inside
   or past the auto-zone, and the auto logic stays silent once overridden.

**Reusable takeaway for a new deck:** any calculator/tool embedded in a
scroll narrative should (a) stay invisible until its context begins, (b)
track scroll position continuously rather than snapping open/shut, (c) sync
its internal state to whichever content beat is currently in focus, and (d)
still support one manual override that a user can trigger from anywhere.

## 9. Reusable slide/section patterns (for new builds)

| Pattern | When to use | Recipe |
|---|---|---|
| **Full-bleed statement slide** | One big claim, nothing else competing | `min-height:100-104svh`, centered flex column, serif h2 `clamp(25-58px)`, one italic word in `--moss`, optional small plate/icon above, body copy below in `--s` |
| **Bordered card grid** | Comparable items (value props, sectors, services) | shared-border grid (`border-top+left` on container, `border-right+bottom` per cell), tabular-num index, serif h3, sans small-caps label |
| **Recessed feature panel** | A tool/calculator/interactive demo | `background:var(--field)`, same border treatment as page sections, mode-switcher row with underline-on-active state |
| **Marquee strip** | Trust logos / partner bar | duplicate content once, `translateX(-50%)` loop, low opacity raised on hover |
| **Dark close band** | Footer / final CTA context switch | `background:var(--pitch)`, text drops to `--khaki`/`--ivory`, everything else (borders, accents) stays the same tokens just recolored for contrast |

---

*Source of truth: `home-2.html`. If tokens or structure drift, re-diff
against that file rather than trusting this document blindly — it's a
snapshot, not a live spec.*
