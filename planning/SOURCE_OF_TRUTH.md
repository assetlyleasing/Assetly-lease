# SOURCE OF TRUTH — Assetly Website

Status: **Authoritative**. This document overrides informal assumptions, brainstorming, and superseded drafts. If code, prototypes, or older files disagree with this document, this document wins unless a newer, explicitly-approved decision updates it (see `DECISIONS.md`).

Do not add rejected ideas, brainstorming, or "options under consideration" here. If something is undecided, it belongs in §25 as `OPEN DECISION`, not as a tentative answer.

Derived from: `plan.md` (final, 2026-08-19 17:43 revision — takes precedence over earlier passages within itself), `DESIGN_SYSTEM.md` (motion/token/pattern reference extracted from the `home-2.html` prototype — **not** authoritative on copy or section order), and the project baseline supplied directly by the user. See `DECISIONS.md` for how conflicts between these were resolved.

---

## 1. Project scope

Assetly is a B2B operating-lease structuring company. The website's job is to explain the lease-vs-loan-vs-purchase proposition, establish brand credibility, and convert visitor interest into a Gmail-drafted enquiry sent to `sankar@assetly.lease`. Two public pages, one protected internal panel. No general-purpose CMS, no user accounts on the public site, no e-commerce, no blog.

## 2. Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Home — full narrative site | Public |
| `/about` | About — standalone company page | Public |
| `/admin` | Trusted-By logo management | Firebase-Authenticated admins only |

No other public routes exist unless a later decision adds one (e.g. `/privacy`, `/terms` — see §23).

## 3. Homepage section order

Fixed, in this order:

1. Navigation
2. Hero
3. Trusted By — conditional, admin-controlled, renders nothing if disabled or empty
4. Lease vs. Loan vs. Purchase ("Compare")
5. Why Us
6. Sectors We Serve
7. Contact
8. Footer

No section may be inserted between these without a new approved decision. In particular: **no About content on the homepage** (§4), and **no standalone "Close/CTA" band** between Sectors and Contact or between Contact and Footer (see `DECISIONS.md` DEC-005) — Contact is the final narrative beat before the Footer.

## 4. About-page scope

`/about` is a separate, simple page — not a homepage section. Structure:

- One large, strong image (55–65% of the section)
- One short DM Serif Display heading
- One concise DM Serif Text company description (grounded in real Assetly material: structured operating leases, preserving working capital, reducing ownership risk, financial flexibility; Assetly's positioning around tailored structuring, fast turnaround, multi-sector expertise, strong funding partners)
- Optional small location/contact line at the bottom
- Same navigation and footer as the homepage

No timeline, stats, founders section, or company-history storytelling unless that content is supplied later (currently not supplied — do not fabricate).

## 5. Brand identity

- Positioning: warm, paper-toned, editorial-financial. Serif display type carries authority; a small sans (Inter Tight) handles all UI chrome in uppercase with wide tracking.
- Tagline: **Access . Scale . Grow** (sourced from the Assetly visiting card).
- Motion character: slow, eased, confident — nothing snaps.
- Accent discipline: Bottle Green is the one interactive accent color, used sparingly (under ~4% of any surface) as the "this is clickable / this matters" signal.
- Two dark surfaces puncture an otherwise light, paper-toned site: the scrolled navigation and the footer.
- Plate motif: every section's traced-line SVG "plate" must represent something real about that section's content (see §11–§16), never generic decoration.
- Logo/wordmark asset: **OPEN DECISION** — no vector logo file exists in the repo yet (see §25).

## 6. Color tokens

```css
--paper:  #F6F4EC;  /* page base */
--field:  #E7E2CE;  /* recessed/contrast panels (calculator, map, card backs) */
--ink:    #26261B;  /* primary text */
--olive:  #40402D;  /* brand marks, plate strokes, icon fills on light surfaces */
--moss:   #5C5C46;  /* italic emphasis words, eyebrows, secondary labels */
--line:   rgba(38,38,27,.15);  /* hairline borders/dividers */
--bottle: #25453A;  /* the one interactive accent — CTAs, active states, hover underlines */
--pitch:  #21241A;  /* dark surface — scrolled nav bg, footer bg */
--khaki:  #B1AD77;  /* secondary text/underline on dark surfaces */
--ivory:  #E7E3D4;  /* logo/wordmark text on dark surfaces */
```

Rule of thumb: on `--paper`, brand marks/icons use `--olive`; the one interactive accent is always `--bottle`. On `--pitch`, the wordmark switches to `--ivory` and everything secondary uses `--khaki`.

`--soot: #1D1D14` appears in the old prototype as an unused reserve token. It is **not** part of the approved token set — omit it from the design-tokens file unless a future decision assigns it a role.

## 7. Typography

```css
--d: "DM Serif Display", serif;              /* headlines, numerals, indices */
--s: "DM Serif Text", serif;                 /* body copy, supporting paragraphs, italics */
--u: "Inter Tight", system-ui, sans-serif;   /* all UI chrome: nav, buttons, labels, footer */
```

- Google Fonts: `DM+Serif+Display:ital@0;1&family=DM+Serif+Text:ital@0;1&family=Inter+Tight:wght@400;500`
- Headline sizing always via `clamp()`, never a fixed px value.
- Italic (`<i>`) spans inside headings are always `color: var(--moss)` — the recurring emphasis device.
- UI text (`--u`) is uniformly small (9–11px desktop nav labels), uppercase, letter-spacing `0.17em–0.26em`.
- Numeric indices (`01`, `02`, figures) use `--d` with `font-variant-numeric: tabular-nums`.
- The visual voice is DM-Serif-led throughout the site; Inter Tight is interface chrome only, never body copy.

## 8. Motion principles

Two easing curves cover the entire site:

```css
--e:   cubic-bezier(.22,1,.36,1);   /* entrances — fast start, soft settle */
--eio: cubic-bezier(.65,0,.35,1);   /* toggles/hovers/drawers — symmetric ease-in-out */
```

- Line-mask text reveal (`.m > span`): `translateY(105%) → 0`, `1.25s var(--e)`, staggered.
- Fade-in (`.fi`): `1.1s var(--e)`, manually staggered delays.
- Scroll-triggered reveal (`.rv .u`): `opacity:0, translateY(16px) → opacity:1, translateY(0)`, `1s var(--e)`, gated by IntersectionObserver; stagger via `.d1/.d2/.d3` (`.12s/.24s/.36s` delay).
- Hero mark settle: `opacity:0 translateY(20px) scale(.95) → identity`, `1.7s var(--e)`.
- Plate draw (`.plate [stroke]`): `stroke-dasharray:2200 → stroke-dashoffset:0` over `2.6s var(--eio)`.
- Continuous scroll-scrubbed effects (argument-slide focus, calculator drawer openness) use a single shared `requestAnimationFrame` loop reading `getBoundingClientRect()` and writing inline styles directly — reserved only for effects that must track scroll position exactly. Everything else uses IntersectionObserver + CSS transitions.
- `prefers-reduced-motion: reduce` neutralizes every animation above: final state applied instantly, transitions clamped to `.12s`. This block is mandatory on every animated component, not optional polish.
- Overall pacing: animation should feel slow, deliberate, and premium — never quick/SaaS-style.

## 9. Responsive principles

- Mobile is **intentionally recomposed** per section, never a shrunk desktop layout.
- Spacing is `clamp()`-based throughout, not a fixed breakpoint scale. Key bands: section vertical padding `clamp(56px,11vh,120px)`; argument-slide vertical padding `clamp(50px,9vh,90px)`; card padding `clamp(22–28px,3–4vh,32–48px)`; page gutter `clamp(20px,5vw,60px)`.
- Borders are always `1px solid var(--line)`; grids share borders between adjacent cells (border-top/left on container, border-right/bottom per cell) — no gaps, a drawn ledger-line look.
- Breakpoint reference (from approved section specs): mobile bottom-sheet/stacking behavior generally engages ≤700px for drawers/sheets and ≤640px for grid collapse; exact per-component thresholds are set in each section's spec below.

## 10. Navigation specification

**Desktop**

- Left: Assetly logo mark + "**assetly**" (one clickable unit; click scrolls to Hero; hover = subtle opacity shift only, no decorative animation). The wordmark is set in **DM Serif Display**, matching the Footer's brand lockup — see `DECISIONS.md` DEC-017, which supersedes the earlier "Assetly Leasing" / Inter Tight treatment here. The full "assetly leasing" lockup appears in the Footer (§17).
- Right: **Compare · Sectors · About · Contact**.
- Typography: the four nav **links** use Inter Tight, uppercase, `9–11px`, letter-spacing `0.17em–0.26em`, medium/regular weight. This line does not govern the wordmark (DEC-017).
- Fixed to top, horizontally spacious, visually lightweight, compact rather than a large conventional header. The bar is inset by its own `--nav-gutter` (`clamp(12px,1.6vw,26px)`) rather than the page gutter, so it spans nearly the full display width with a small edge gap (DEC-017); page sections continue to align to `clamp(20px,5vw,60px)`.

**Colors**

- Transparent hero state: background transparent, logo/text adapted for contrast with hero.
- Scrolled state: background **Pitch `#21241A`**; wordmark **Ivory `#E7E3D4`**; secondary nav text **Khaki `#B1AD77`**; interactive accent **Bottle `#25453A`**.

**Scroll behavior**: transparent over Hero → dark floating/pill-style surface after scroll. Transition ~`0.7s`, `cubic-bezier(.65,0,.35,1)`. No sudden snapping.

**Link interaction**: default restrained khaki/light text; hover = subtle opacity increase + thin bottle-green underline that animates horizontally; click = smooth scroll to section. No scale jumps or bright color changes.

**Mobile**

- Left: logo + "**assetly**" (the same lockup as desktop — DEC-017 removed the desktop/mobile wordmark split). Right: hamburger icon.
- Hamburger: minimal 2–3 line icon, thin strokes, transforms into an **X**; transition ~`0.5–0.7s` with the site's standard easing.
- On open: full-width top overlay/dropdown (**not** a side drawer) — dark `#21241A` surface, links (Compare, Sectors, About, Contact) stacked vertically, large touch spacing, Ivory/Khaki typography, subtle staggered fade/slide entrance.

This hamburger + full-width overlay behavior is the final, locked mobile nav spec — see `DECISIONS.md` DEC-004 for why it supersedes the older link-hiding prototype behavior.

Final principle: the navbar is supporting chrome — minimal, premium, editorial, financial, quiet, precise — not a visual section of its own.

## 11. Hero specification

**Content stack** (top → bottom): Logo → Main line → Subline, with a large traced-line SVG plate as a spatial background layer behind all three.

**Approved copy** (locked — see `DECISIONS.md` DEC-018 for the main line, DEC-001 for the rest):

- Main line: **"The lighter balance sheet."** — set across two mask lines as "The *lighter*" / "balance sheet.", with `lighter` in Moss italic. DEC-018 supersedes DEC-001's earlier main line ("The lighter way to access what your business needs.").
- Subline / tagline: **"Access . Scale . Grow"**
- No additional paragraph beyond the subline.

**Typography**

- Main line: DM Serif Display, `clamp(31px,6.4vw,76px)`, max 2 lines. One word may be italicized in **Moss `#5C5C46`**.
- Subline: DM Serif Text, `clamp(17px,1.8vw,22px)`, 1–2 lines.
- Any small labels: Inter Tight, uppercase, wide tracking.

**Color**: surface Paper `#F6F4EC`; headline Ink `#26261B`; italic/emphasis Moss `#5C5C46`; plate Olive `#40402D` at ~16% opacity; interactive accents Bottle `#25453A`.

**Plate — meaning and behavior**

The hero plate is a single continuous traced-line illustration representing **Access → Scale → Grow**: it should read gradually, like an architectural/engineering drawing, subtly combining an asset/equipment form, a financial-flow/leasing path, and an upward expansion gesture — never a literal infographic or icon. Actual SVG artwork is not yet produced (`OPEN DECISION`, §25).

Three-stage dynamic behavior:

1. **Entry** — near-invisible on load, draws itself over ~2.6s (`cubic-bezier(.65,0,.35,1)`), opacity settles to ~16%.
2. **Living Plate** — after drawing completes, extremely subtle ambient movement: selected lines drift ~2–5px, one or two nodes slowly expand/reposition, very slight cursor-parallax on desktop, cycle ~8–12s. Must read as "alive," not "animated." No re-drawing loop.
3. **Scroll Transition** — as the visitor leaves the Hero, the plate fades; a portion of its geometry may visually carry into the first Compare-section plate, visually connecting the two sections.

**Hero motion sequence — post-loader** (choreographed entry once the opening loader's "A" has settled into position, §11a): plate continues/starts drawing → headline lines rise through masks → subline fades upward → plate completes → after ~3s plate enters ambient movement. This is **superseded as the first-paint sequence** by §11a's opening loader (DEC-013) — the site no longer goes straight from a blank page into this choreography; the loader's "A" recede-and-settle now precedes it. Phase 2 ships the Hero built to receive this hand-off (final "A" position, deferred plate/copy reveal); the loader itself is built in Phase 8.5.

**Core principle**: the hero is "logo + proposition + a living technical illustration of what Assetly does" — not "logo + headline + decorative drawing."

## 11a. Hero opening loader specification (DEC-013)

**Status**: Approved, supersedes the old first-paint portion of §11's motion sequence. Applies only to the Hero's opening — it does not change navbar behavior, Compare, Why Us, Sectors, Contact, Footer, or the plate system's general design language. Scheduled for implementation in **Phase 8.5** (`MASTER_PLAN.md`), after Phase 8 (About), not inside Phase 2.

**1. Opening screen** — full-screen, centered composition on **Pitch `#21241A`** (the same dark surface as scrolled nav/footer, not Bottle Green). Shows only: the "**A**" brand mark, and "**ACCESS · SCALE · GROW**" beneath it. Nothing else — no navbar, no Hero proposition, no plate, no secondary graphic.

**2. Typography** — the "A" and Hero proposition use the site's primary display typeface (`--d`, DM Serif Display); "ACCESS · SCALE · GROW" uses the established supporting UI type treatment (`--u`, Inter Tight, uppercase, wide tracking) — same as it appears elsewhere as the Hero subline/tagline. No loader-specific font is introduced.

**3. Loader colors** — background Pitch `#21241A`; "A"/brand mark Ivory `#E7E3D4`; tagline Khaki `#B1AD77`. This is the same dark-surface token trio used by nav/footer (§6, §10, §17). Bottle Green `#25453A` is never used as the opening background — it stays reserved for interactive/active-state emphasis elsewhere.

**4. Slow double blink** — only the "A" blinks; the tagline stays static throughout. Sequence: visible → dim → visible → pause → dim → visible. Each blink ~0.8–1.0s, dim floor ~20–30% opacity (never fully disappears), a slight pause between the two blinks. Calm and deliberate — must not read as a notification/loading indicator.

**5. "A" recedes** — after the second blink, the "A" slowly scales down and appears to move backward (a controlled camera pull-back). No morph, no mask expansion, no shape transformation, no additional graphic transition.

**6. "A" settles into Hero** — the "A" moves toward its final Hero position on the central screen axis (not a shrink-in-place); it must read as "opening mark → final Hero composition." It stops completely before any further content appears.

**7. Hero information reveal** — only after the "A" settles: (1) Hero proposition appears, (2) "ACCESS · SCALE · GROW" appears beneath it — soft opacity + tiny upward settle, restrained timing, no second major animation. Final Hero hierarchy: **A** / **"The lighter way to access what your business needs."** / **ACCESS · SCALE · GROW** (copy unchanged from DEC-001 unless a later decision changes it).

**8. Plate integration** — the plate is supporting texture, not part of the opening event. It may appear very softly after the "A" settles, or already exist at extremely low opacity in the final Hero state. It must never compete visually with the blink, the "A" recession, or the Hero proposition reveal. Continues using Olive `#40402D`, low-opacity traced-line treatment, technical/architectural language per §11.

**9. Motion hierarchy (approved order)**:
1. Opening signature — "A" + slow double blink
2. "A" recedes
3. "A" settles into Hero
4. Hero proposition + tagline appear
5. Hero plate becomes quietly visible
6. Rest of site continues with the existing motion system (§8)

The loader is a brand signature, not a loading spinner/progress indicator.

**10. Brand consistency rule** — every loader decision inherits from the existing design system: no loader-specific colors, fonts, easing, border treatments, icon styles, or decorative effects. Dark-surface rule mirrors §10/§17 exactly: background Pitch, primary mark Ivory, secondary/tagline Khaki; interactive Bottle Green stays reserved for UI accents/active controls elsewhere on the site.

**11. Reduced motion** — `prefers-reduced-motion: reduce` skips the blink and recession entirely; load directly into the final Hero state via a short, subtle fade (per the standing §8 mandate that this is never optional polish).

**Testing requirements** (in addition to the standard §8/§20 reduced-motion and accessibility rules): correct Pitch/Ivory/Khaki colors and contrast; exact two-blink count; tagline stays static during blink; "A" never fully disappears; "A" visibly moves toward its Hero destination; "A" fully settles before Hero content appears; no navbar visible during opening; plate never competes with the opening choreography; no layout shift between loader and Hero; mobile scale/position; reload behavior; back-navigation behavior; slow-device performance; reduced-motion behavior (per §11 point 11 above).

## 12. Trusted By specification

**Position**: immediately after Hero, homepage §3. Purely optional — controlled by an admin toggle. If disabled or if there are zero active logos, render nothing and transition directly from Hero to Compare (condition: `enabled === true AND activeLogos.length > 0`).

**Content**: small Inter Tight eyebrow label "**TRUSTED BY**" (uppercase, ~9–11px, tracking ~0.20em, Moss or Olive) + logos only. No heading, no paragraph, no stats.

**Layout**: narrow full-width horizontal strip, vertical padding `clamp(24px,4vh,44px)`, subtle top/bottom hairline. Background **Paper** (Field only if more separation is later needed).

**Logo treatment**: fixed max height (desktop `28–40px`, mobile `22–30px`), automatic width, `object-fit: contain`, consistent whitespace, no card background, no stretching. Default opacity `45–65%`, optionally desaturated; hover raises opacity (and may restore original color). Never force every logo into Olive if that damages the source brand mark. Spacing between logos `clamp(40px,6vw,90px)`.

**Marquee animation**: continuous horizontal flow via duplicated logo sequence + `translateX(0) → translateX(-50%)`, reset invisibly (no carousel arrows/dots/snapping). Linear timing only (constant velocity). Desktop loop **~30–34s**; mobile loop **~34–40s** (slower for readability). If too few logos to fill the viewport, repeat the collection automatically until there's never blank space.

**Hover**: desktop hover anywhere over the marquee pauses movement; individual logo hover increases opacity (max scale ~1.02 if any scale is used — prefer opacity only).

**Mobile**: same horizontal marquee concept, not a vertical list/swipe carousel/grid. Slightly smaller logos, tighter spacing, slower loop.

**Entrance**: label fades in → strip fades in → continuous movement begins. No plate animation in this section.

**Reduced motion**: stop automatic marquee; render as a static, horizontally scrollable strip using normal touch/trackpad scroll.

**Failure behavior**: if Firebase is temporarily unavailable, hide the section entirely — no error UI, no broken placeholders.

## 13. Compare specification ("Lease vs. Loan vs. Purchase")

Four-step scroll sequence, each a near-full-screen argument slide:

1. **Upfront Cash** — Plate: retained capital, small portion accessed while a larger reserve stays intact. Headline: "Preserve capital. Keep your business moving." Copy: access needed assets without a large upfront outlay; operating lease preserves working capital; loan may require 10–25% margin; outright purchase requires 100% upfront. Calculator row: Lease **Low** / Loan **10–25% margin** / Purchase **100% upfront**.
2. **Risk of Obsolescence** — Plate: asset lifecycle (use → ageing → replacement). Headline: "Use the asset. Not the ownership risk." Copy: operating lease means Assetly bears resale/obsolescence risk; loan/purchase means the customer bears it. Calculator row: Lease **Assetly bears it** / Loan **You bear it** / Purchase **You bear it**. No artificial percentage here.
3. **Tax Treatment** — Plate: ledger-style drawing resolving into one clean recurring rental line. Headline: "A simpler path to deduction." Copy: full rentals deductible without depreciation block-rate limits or the 180-day usage restriction; GST input credit continues to apply. Calculator row: Lease **Full rental deductible** / Loan **Depreciation + interest** / Purchase **Depreciation only**.
4. **Leverage Impact** — Plate: progressively heavier balance-sheet structure. Headline: "Keep leverage light. Keep capacity available." Copy: preserves bank credit lines and collateral capacity, lighter impact on Debt/Equity and Debt/EBITDA vs. loan-funded acquisition. Calculator row: Lease **Minimal** / Loan **Raises Debt/Equity** / Purchase **Drains cash**.

**Desktop structure**: left side = plate + index number + headline + supporting copy; right side = the Lease/Loan/Purchase calculator drawer. Drawer auto-opens as the section begins; left content narrows (not covered) to make room. Drawer stays open through all four slides and its content auto-syncs to whichever slide is in focus.

**Typography**: serif-led — DM Serif Display for slide headlines, index numbers, major figures, key calculator outcomes; DM Serif Text for all supporting copy; Inter Tight only for small UI chrome (`LEASE / LOAN / PURCHASE` labels, mode labels, metadata, drawer controls).

**Color**: left narrative on Paper; calculator on Field; Bottle reserved for active controls/emphasis. Full token set per §6, plus `--line: rgba(38,38,27,.15)`.

**Calculator behavior**: automatic and context-aware, tied to scroll position — not four separate calculators but "one analytical instrument changing perspective." The visual is one persistent three-column bar graph whose Lease/Loan/Purchase fills transition between qualitative `low` / `mid` / `high` tiers as the focused argument changes. These tiers are presentation categories only, mapped to 30% / 60% / 92% height; they are not financial quantities. The approved outcome text remains visible beneath each bar. Internal text and bar transitions run for 800ms with `cubic-bezier(.22,1,.36,1)`. Reduced motion applies the destination tier immediately.

**Qualitative tier mapping**: Upfront requirement (lower is lighter) = Lease Low / Loan Mid / Purchase High; Customer ownership risk (lower is lighter) = Lease Low / Loan High / Purchase High; Deduction breadth (higher is broader) = Lease High / Loan Mid / Purchase Low; Capacity pressure (lower is lighter) = Lease Low / Loan High / Purchase High. No prototype coefficients, currency calculations, asset-value slider, or numeric magnitudes are used.

**Drawer control**: extremely minimal — small triangle/chevron on the drawer edge (~10–14px), no text, larger invisible hit area. Closed `›` / open `‹`. If the visitor manually closes it, it stays closed until reopened.

**Openness model**: openness is a continuous 0–1 value (not boolean), recomputed every scroll frame relative to two measured zones (hero-bottom → value-grid-top) with a soft ~40vh easing band at each edge — a physically scrubbed panel, not a snap. Manual override (clicking the tab) sets an override flag and tweens to target over ~500ms cubic ease-out; auto-sync logic goes silent once overridden.

**Plate animation**: each argument slide's plate draws once on activation, `stroke-dashoffset: 2200 → 0` over 2.6s, stays visible at the argument-slide opacity level. The approved 200×130 set adapts `reference/home-2.html`'s building/capital plate for Upfront Cash, asset/lifecycle plate for Obsolescence, and balance-scale plate for Leverage; Tax Treatment uses a matching ledger-to-recurring-line drawing authored in the same compact drafting language. All four are inline geometry rendered by the shared `Plate` component.

**Left content focus effect**: active argument = fully opaque, sharp, aligned at rest; previous/next = slightly faded, subtly blurred, slightly displaced. One argument in focus per screen, driven by a single RAF loop computing distance-from-viewport-center.

**Mobile structure**: recomposed, not shrunk. Top = plate + index + headline + compact copy. Bottom = calculator bottom sheet, context-aware but physically stable across the four arguments (expanded height `34–42svh`, max `42vh`). Mobile drawer control: tiny centered triangle at the sheet's top edge (`▼` expanded / `▲` collapsed), ~44px invisible touch target, no text label. On argument change: content settles → plate draws → calculator values transition → calculator height stays stable (do not repeatedly push content up/down).

**Section entry/exit**: calculator hidden before the section; as Slide 01 approaches, drawer opens, layout makes room, Slide 01 plate draws, calculator shows Upfront Cash. As the visitor approaches Why Us after Slide 04, the calculator slides away and narrative content returns to full width.

**Final principle**: "editorial financial storytelling on the left + a live analytical instrument on the right" — never "text beside a dashboard."

## 14. Why Us specification

2×2 interactive grid (desktop), one Assetly value per card, values sourced from existing Assetly material:

| T | F |
|---|---|
| **Tailored Structuring** | **Fast Turnaround** |
| **S** | **P** |
| **Multi-Sector Expertise** | **Strong Funding Partners** |

**Front face**: oversized dominant letter (T/F/S/P) + secondary value name. Minimal.

**Back face** (revealed on click, not hover):

- **T** — Tailored Structuring: lease structures shaped around asset, tenure, cash-flow needs, and business context rather than a standard template.
- **F** — Fast Turnaround: a focused structuring and execution process to move from requirement to lease solution quickly.
- **S** — Multi-Sector Expertise: experience across commercial interiors, manufacturing, construction, hospitality, healthcare, and IT infrastructure.
- **P** — Strong Funding Partners: a strong funding network supports structuring and execution across asset categories.

(These four values are source-derived; the back-face explanatory copy is an expansion written for the flip interaction, not verbatim source text.)

**Flip mechanics**: 180° `rotateY(0) → rotateY(180deg)`, `0.8–1.0s`, `cubic-bezier(.65,0,.35,1)`, proper `perspective`, `backface-visibility: hidden` on both faces. Click/tap only — never hover-triggered. Multiple cards may stay flipped simultaneously (no accordion). Hover on desktop only raises contrast slightly, nudges the card 1–2px inward, and may reveal a tiny arrow/rotation indicator — no flip on hover.

**Typography**: large T/F/S/P and value name in DM Serif Display; back-face explanation in DM Serif Text; a tiny Inter Tight interaction cue only (e.g. "CLICK TO EXPLORE" or a quiet symbol).

**Grid design**: shared-border ledger-style grid (`1px solid rgba(38,38,27,.15)`), no gaps, no floating SaaS cards.

**Color**: front — Paper base, Ink text, Olive large letter, optional Moss accent. Back — Field background, Ink copy, Olive letter/marker, Bottle reserved for a tiny interaction detail only.

**Entry animation**: eyebrow/title fades in; four cells reveal with ~0.12s stagger, `opacity:0→1`, `translateY(16px)→0` (the standard `.rv/.u` reveal). Cards never auto-flip on entrance.

**Mobile**: 1-column stack (T, F, S, P), each a wide rectangular flip card with a consistent min-height on front/back so flipping never causes page jump. Tap to flip / tap again to return. No hover-dependent behavior.

**Heading**: small Inter Tight eyebrow "WHY US" + serif heading **"Why Assetly"**.

**Screen readers**: expose only the active face (DEC-024). The visual 3D faces are hidden from the accessibility tree; the native button keeps the value name and `aria-pressed` state. Its explanation exists as a polite description only while flipped and is removed again on return.

## 15. Sectors specification

**Sector pool (6)**: Commercial Interiors, Manufacturing, Construction, Hospitality, Healthcare, IT Equipment & IT Infrastructure. **Visible at once: 4.**

**Desktop**: 2×2 connected ledger grid (shared 1px borders, no gaps, no floating cards, no heavy shadows, equal card heights).

**Mobile**: vertical 1×4 connected grid, still 4 sectors visible at once. Cards more compact: smaller plate, sector name, optional tiny index, no long paragraph.

**Auto-rotation**: continuous one-out-one-in cycle. One card position updates every **2.5 seconds**: fade out ~450ms with slight `translateY(10px)`, content replaced, fade back in, then proceed to the next slot. The whole grid never refreshes together. No arrows, no pagination dots, no slider controls.

**Card content**: small Inter Tight index/label; DM Serif Display sector name; optional short DM Serif Text descriptor on desktop (can be omitted where the plate provides enough context). Example: "01 / Commercial Interiors / Workplace, fit-out and interior assets."

**Sector plates** (meaningful, not generic icons — artwork not yet produced, `OPEN DECISION` §25):

- Commercial Interiors → floor plan/furniture/workspace geometry
- Manufacturing → machinery/production-line geometry
- Construction → structural/site/equipment geometry
- Hospitality → interior/furniture/operational-equipment geometry
- Healthcare → medical-equipment geometry
- IT Equipment & IT Infrastructure → server rack/hardware/network geometry

**Plate animation**: on entering a grid position, draw once — `stroke-dashoffset: 2200 → 0`, 2.6s, same easing as elsewhere. Text swap (450ms) can complete while the plate continues drawing.

**Color**: grid background Paper; sector name Ink; plate Olive; supporting text Moss; Bottle only for genuine interactive emphasis.

**Entrance**: heading fades in → four cards reveal with slight stagger → initial four plates draw → automatic rotation starts after entrance settles.

**Desktop hover**: pauses rotation, slightly raises plate opacity, card stays physically stable — no scale-up.

**Mobile**: no hover-dependent interaction; the four stacked cells passively continue the same 2.5s one-card-at-a-time rotation.

## 16. Contact specification

**Purpose**: show primary ways to reach Assetly, give simple Bengaluru location context, and let a visitor quickly prepare an enquiry continued through their own email client. The full postal address is intentionally **excluded** from this section — reserved for the Footer.

**Contact details** (from the Assetly visiting card): Email `sankar@assetly.lease` (clickable); Phone `+91 96204 71985` (tap-to-call on supported devices); Location "Bengaluru" only (no full address here).

**Desktop layout**: ~40/60 split. Left: "CONTACT" label, heading "Let's talk.", Email, Phone, Location line. Right: large simplified Bengaluru map visual (warm muted tones, minimal street/detail noise, Assetly marker, subtle Olive line work, Paper/Field tones, no default-Google-Maps look, no extra info cards) with a "BENGALURU" micro-label, and a minimal contact drawer handle (**"CONTACT ›"**) attached to the map's edge — styled as a drawer handle, not a large CTA button.

**Drawer transition**: contact panel slides across part of the map (map stays partially visible), ~700–900ms, `cubic-bezier(.65,0,.35,1)`, no hard pop-up.

**Enquiry flow — Step 1 (type selection)**, large selectable rows, not radio buttons:

- 01 — Operating Lease
- 02 — Asset Requirement
- 03 — Existing Requirement
- 04 — General Enquiry
- "Something else…" custom field

(This is the final, revised category list — see `DECISIONS.md` DEC-003 for the resolution of the earlier "Partnership" category being dropped.)

**Step 2 — minimal details, always asked**: Name, Company, Email, Phone (optional). Do not re-ask what the visitor already selected in Step 1.

**Conditional fields**:
- Operating Lease / Asset Requirement → Asset/equipment (required-ish), Approx. asset value (optional)
- Existing Requirement → Reference/short note (optional)
- General Enquiry / custom → Message (single short textarea)

**Form design**: underline-style fields (no boxed inputs). On focus: line strengthens, subtle Bottle accent, label shifts gently, no glow, no thick borders. Generous spacing.

**Final action**: primary **"Open in Gmail →"** generates a Gmail compose draft (recipient `sankar@assetly.lease`, subject and body built from the selected type + fields) — nothing sends automatically, the visitor reviews/edits/sends themselves. Secondary, subtle fallback: **"Use another email app"** (same recipient/subject/body via `mailto:` and the visitor's default mail client).

**Typography**: DM Serif Display for "Let's talk.", Bengaluru/major location text, large panel headings. DM Serif Text for email, phone, form input values, supporting info. Inter Tight for all labels (CONTACT, EMAIL, PHONE, LOCATION), enquiry indexes, form field labels, drawer controls, CTA microcopy.

**Color**: page Paper; map/drawer Field; primary text Ink; map lines/graphics Olive; secondary info Moss; active/interaction Bottle; borders `rgba(38,38,27,.15)`.

**Animation**: entrance — CONTACT label fades → heading reveals → email/phone/Bengaluru stagger in → map fades/draws in → contact handle appears last. Drawer: `translateX()`, ~700–900ms, slow physical easing. Step transitions (type → details): fade + `8–12px` movement, ~500–700ms — no dramatic carousel motion.

**Mobile**: vertical recomposition (Contact label → heading → email/phone/location → map → "CONTACT ›" handle). Tapping Contact opens a **bottom sheet** (not a side drawer) containing Step 1 → Step 2 → "Open in Gmail →", scrollable where necessary, visible close/drag handle, full-width fields, generous touch spacing.

**Explicitly excluded from this section**: website URL, full postal address, long company description, social links (unless later supplied), a large generic contact form, a generic "Submit" button.

## 17. Footer specification

Feels like a continuation of the nav/header system (same dark surface, typography discipline, restrained borders, minimal motion) — not a generic website footer. No cards, shadows, gradients, or decorative containers.

**Visual treatment**: background Pitch `#21241A`; primary logo/wordmark Ivory `#E7E3D4`; secondary text Khaki `#B1AD77`; dividers very subtle khaki/ivory transparency; interactive hover restrained Bottle/Khaki; primary serif DM Serif; UI/navigation Inter Tight uppercase tracked.

**Structure — three zones**:

- **Left (Brand)**: Assetly logo, "**assetly leasing**", tagline "**Access . Scale . Grow**" — visually strong and spacious.
- **Middle (Navigation)**, two groups:
  - Explore: Compare, Why Us, Sectors
  - Company: Contact, About Us
- **Right (Official information)**:
  - CONTACT: `sankar@assetly.lease`, `+91 96204 71985`
  - OFFICE (full address, appears **only** here): Unit 101, Raheja Chancery, 113, Brigade Road, Bengaluru, Karnataka — 560025
  - No repeated website URL.

**Bottom legal bar**: left "© Assetly Leasing" (current year appended automatically); right — Privacy Policy, Terms of Use, and Cookie Policy only if the site actually uses non-essential cookies/analytics that require it (currently: no analytics, so Cookie Policy is not required — `OPEN DECISION` if that changes, §25). Do not add Refund/Shipping/Cancellation/Accessibility/Disclaimer policies unless Assetly's actual legal setup requires them.

**Typography**: logo/wordmark uses the real brand lockup where possible; tagline in DM Serif Text (or the established brand-asset treatment); navigation headings Inter Tight uppercase small wide-tracked; footer links Inter Tight (footer is UI chrome); address/email/phone in DM Serif Text (UI labels = sans, actual information = serif).

**Link interaction**: Khaki → Ivory on hover, thin underline grows left-to-right, ~400–600ms, no movement over 1–2px, no scale. Email click opens mail client; phone click/tap calls; footer nav links smooth-scroll to the relevant homepage section (or navigate to `/about` for About Us); logo returns to Hero.

**Entrance**: brand block fades upward → navigation groups stagger in → contact information follows → legal row appears last. No plate animation in the footer — it is the quiet conclusion of the site.

**Mobile**: recompose vertically (Logo/brand block → dividing rule → Explore + Company nav groups, which may sit side by side on wider mobile widths → dividing rule → full-width Contact + Office details → dividing rule → Privacy Policy / Terms of Use → © line).

## 18. Firebase / admin architecture

**Scope**: Firebase is used only for what genuinely needs remote control without a redeploy — currently, the Trusted By section. No general-purpose CMS.

**Firebase Authentication**: protects `/admin`. Only authorized Assetly admins can sign in. Exact auth method (email/password vs. Google SSO) and the list of authorized admin accounts: `OPEN DECISION` (§25).

**Firebase Storage** — logo files, e.g.:
```
trusted-logos/
    company-a.svg
    company-b.png
    company-c.webp
```
Prefer SVG/WebP/optimized PNG. Upload limit ~2MB per logo (actual optimized assets should be much smaller). Accepted formats: SVG, PNG, WebP.

**Firestore** — configuration and metadata:
```
siteSections/trustedBy
    enabled: boolean
    updatedAt: timestamp

trustedLogos/{logoId}
    name: string            // "Company Name"
    alt: string              // "Company Name logo" (auto-generated default from name)
    imageUrl: string
    active: boolean
    sortOrder: number
    createdAt: timestamp
    updatedAt: timestamp
```

**Frontend query logic**: read `siteSections/trustedBy`. If `enabled === false` → render nothing. If `enabled === true` → query active logos sorted by `sortOrder` ascending; render the section only if that result is non-empty (`enabled AND activeLogos.length > 0`).

**Admin capabilities** (scope is deliberately narrow — Trusted By only):
- Section: Trusted By ON/OFF toggle
- Logos: upload, set company/organization name, alt text (auto-default from name, editable), enable/disable individual logo, reorder (move up/down or drag-and-drop), delete
- Preview of a logo before/after upload

**Reordering**: `sortOrder` field in Firestore; frontend always sorts ascending.

**Accessibility**: every logo needs meaningful alt text; the duplicated copies used to build the seamless marquee are hidden from screen readers (not double-announced).

**Loading/failure behavior**: avoid layout shift — fetch the toggle/config early or reserve predictable section height. Logo images use intrinsic dimensions where available and lazy-load; Hero rendering is never blocked by this section. If Firebase is temporarily unavailable, the section hides silently — no error UI, no broken placeholders, no empty logo cards.

**Toggle behavior**: switching OFF updates Firestore and the homepage removes the section entirely; switching ON renders it once valid active logos exist. No redeploy required for either.

**Admin panel visual design**: functional requirements only are specified above; the actual UI layout/styling of `/admin` is `OPEN DECISION` (§25) — keep it deliberately small and utilitarian, consistent with "no general-purpose CMS."

## 19. Technical stack

- Next.js (App Router)
- React + TypeScript
- CSS Modules + global CSS design tokens
- Firebase: Firestore, Storage, Authentication, App Hosting
- Inline SVG plate components
- Native CSS animation + Motion for React (component animation) + targeted `requestAnimationFrame` (continuous scroll-linked interactions only)
- Zod (validation, where useful — e.g. the Contact form and admin inputs)
- Vitest (logic/unit) + Playwright (user flows/interactions)
- Gmail compose generation + `mailto:` fallback for Contact
- GitHub (source control)
- Custom static/SVG Bengaluru map initially (no third-party map embed)

**Explicitly not used** (see §24): Redux/Zustand, Tailwind, GSAP (initially), general-purpose CMS, analytics tooling (initially).

## 20. Accessibility rules

- Keyboard: every interactive element (nav, hamburger, plate-adjacent controls, calculator drawer/tab, Why Us flip cards, Sectors — passive so N/A, Contact drawer/form, admin panel) must be reachable and operable via keyboard, with visible focus states.
- Why Us cards: flip must be triggerable via keyboard (Enter/Space on a focusable card), not click/tap only in practice.
- ARIA: calculator drawer uses `aria-expanded`/`aria-controls` on its tab per the established pattern; mode-switch buttons use `aria-pressed`; form fields have associated labels; decorative marquee duplicates are `aria-hidden`.
- Screen reader: meaningful alt text on all logo images; no content conveyed by color alone.
- Touch targets: minimum effective hit area ~44px even where the visible control is smaller (calculator tab, mobile drawer handles).
- `prefers-reduced-motion: reduce` must be respected everywhere motion is used — see §8. This is a requirement, not optional polish.
- Layout stability: no unexpected content jumps — particularly Trusted By (§18), Compare's mobile calculator height (§13), and Why Us flip cards' consistent min-height (§14).

## 21. Performance rules

- Hero rendering is the top performance priority; nothing (Trusted By fetch, logo images, etc.) may block it.
- Lazy-load below-the-fold images/logos; use intrinsic dimensions to avoid layout shift.
- Prefer IntersectionObserver + CSS transitions over `requestAnimationFrame` wherever scroll-exact tracking isn't required (§8).
- Firestore reads for optional/remote-controlled content (Trusted By) must degrade silently on failure/latency rather than blocking or erroring visibly (§12, §18).

## 22. SEO rules

- Per-route metadata (title, description) for `/` and `/about`.
- Canonical tags on public routes.
- Open Graph tags for `/` and `/about`.
- `sitemap.xml` covering public routes only.
- `robots.txt` allowing public routes.
- `/admin` must be `noindex` (and excluded from the sitemap).

## 23. Legal-page placeholders

Only **Privacy Policy** and **Terms of Use** are reserved (Footer links) for now. No official legal wording has been supplied — pages must use simple, generic, non-fabricated placeholder language until real legal text is provided, and must not invent business/legal facts (entity name details, jurisdiction specifics, etc.) beyond what's already established (e.g. Bengaluru office address). Cookie Policy is added only if the site actually introduces non-essential analytics/advertising cookies or a consent system — not currently the case (§24).

## 24. Explicit non-goals

- No About content injected into the homepage — About is `/about` only (§4; DEC-002).
- No standalone "Close/CTA" band as a homepage section (DEC-005).
- No carousel arrows, pagination dots, or slider controls anywhere rotation/marquee is automatic (Trusted By, Sectors).
- No hover-triggered flips on Why Us cards — click/tap only.
- No full postal address in the Contact section — Footer only.
- No "Partnership" as a Contact enquiry category (superseded — DEC-003).
- No general-purpose CMS.
- No Redux/Zustand.
- No Tailwind.
- No GSAP initially.
- No analytics initially.
- No third-party map embed for the Bengaluru map (custom static/SVG initially).
- No fabricated company claims, statistics, partner names, or legal facts anywhere on the site.

## 25. Open decisions

| ID | Open decision | Blocks |
|---|---|---|
| OD-01 | Vector Assetly logo/wordmark lockup (SVG) not yet in the repo | Nav, Footer, Hero (Phase 1–2) |
| OD-02 | Hero plate SVG artwork ("Access → Scale → Grow" line drawing) — direction defined, asset not produced | Phase 2 exit |
| OD-04 | Sector plate artwork ×6 — direction defined, assets not produced | Phase 6 exit |
| OD-05 | Firebase project config: project ID, environment variables, staging vs. production project split, custom domain | Phase 0 exit, Phase 11 |
| OD-06 | Admin authentication method (email/password vs. Google SSO) and the list of authorized admin accounts | Phase 3 |
| OD-07 | Admin panel (`/admin`) visual layout/styling beyond the functional capability list in §18 | Phase 3 |
| OD-08 | Bengaluru custom map visual — data source/base artwork for the "warm muted map" treatment | Phase 7 |
| OD-09 | Real Privacy Policy / Terms of Use legal wording (currently generic placeholder only) | Phase 9 |
| OD-10 | Whether/when a Cookie Policy becomes required (depends on future analytics/consent decisions — none planned currently) | Phase 9 |
| OD-11 | Trusted By actual partner/client logo assets and names (populated via admin after launch, not a build blocker) | Post-launch content |
| OD-12 | Production/staging domain name(s) | Phase 11 |
| OD-13 | Whether the Compare section needs a disclaimer line beneath the calculator. §13's approved copy states tax and finance outcomes as fact ("Full rentals deductible", "180-day usage restriction", "GST input credit continues to apply") and the prototype DESIGN_SYSTEM describes carried an "illustrative disclaimer" element, but no wording has been supplied and none may be invented (§24) | Phase 4 polish / Phase 9 legal |
