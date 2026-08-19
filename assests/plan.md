webplan
----
1.NavBar
-
## Navigation Bar — Final Version

### Desktop

**Left**

* Assetly logo mark
* **Assetly Leasing**

**Right**

* **Compare**
* **Sectors**
* **About**
* **Contact**

### Mobile

**Left**

* Assetly logo mark
* **Assetly**

**Right**

* Hamburger icon

On open:

* Compare
* Sectors
* About
* Contact

The mobile menu opens as a **full-width top overlay/dropdown**, not a side drawer.

### Typography

Use the uploaded design-system UI font:

* **Inter Tight**
* Uppercase
* `9–11px` desktop navigation labels
* Wide tracking: roughly `0.17em–0.26em`
* Medium or regular weight

This keeps the nav distinct from the serif editorial content used elsewhere. 

### Colors

**Transparent hero state**

* Background: transparent
* Logo/text adapted for contrast with hero

**Scrolled state**

* Background: **Pitch — `#21241A`**
* Wordmark/logo: **Ivory — `#E7E3D4`**
* Secondary navigation text: **Khaki — `#B1AD77`**
* Interactive accent: **Bottle Green — `#25453A`**

These roles follow the uploaded design system. 

### Structure

The navbar is:

* fixed to the top
* horizontally spacious
* visually lightweight
* aligned to the site gutter: `clamp(20px, 5vw, 60px)`
* compact rather than a large conventional header

Desktop visual structure:

`[ logo + Assetly Leasing ]                         [ Compare  Sectors  About  Contact ]`

### Scroll behavior

At the top:

**Transparent navigation over the Hero**

After scrolling:

**Transitions into a dark floating/pill-style navigation surface**

Use the existing slow transition language:

* approximately `0.7s`
* easing: `cubic-bezier(.65,0,.35,1)`

No sudden snapping. 

### Link interaction

For Compare, Sectors, About, Contact:

**Default**

* restrained khaki/light text

**Hover**

* subtle opacity increase
* thin bottle-green underline
* underline animates horizontally

**Click**

* smooth scroll to section

No oversized hover effects, scale jumps, or bright color changes.

### Logo behavior

Logo + name acts as one clickable unit.

Click:

* scrolls back to Hero

Hover:

* only a subtle opacity shift

No decorative logo animation.

### Mobile menu interaction

Hamburger:

* minimal 2–3 line icon
* thin strokes
* transforms into an **X**

Transition:

* about `0.5–0.7s`
* same smooth easing language as the rest of the site

Menu panel:

* full-width
* opens from the top
* dark `#21241A` surface
* links stacked vertically
* large touch spacing
* Ivory/Khaki typography
* subtle staggered fade/slide entrance

### Responsive behavior

**Desktop / tablet**
Logo + full navigation links.

**Mobile**
Logo left + hamburger right.

The navbar stays visually quiet so the Hero remains the dominant first impression.

### Final design principle

The navbar should feel:

**minimal, premium, editorial, financial, quiet, and precise**

It should function as **supporting chrome**, not as a visual section of its own. 
---
2.Hero Slide
-
For the **Hero**, I’d keep the same core structure you defined, but make the plate motif do more than decorate the background.

## Hero — Planned Structure

**1. Logo / Brand mark**
At the top of the hero content stack.

**2. Main line**
One strong serif statement. This should be the dominant message on the page.

**3. Subline**
A shorter supporting sentence explaining what Assetly enables.

**4. Dynamic Plate**
Large traced-line SVG behind the content, using the existing `.hero .plate` behavior from the design system. 

The visual order should feel like:

**Logo**
↓
**Main statement**
↓
**Supporting line**

with the plate acting as a spatial layer behind all three.

---

## Plate Direction — Dynamic + Meaningful

The existing design system already defines the plate as a recurring traced-line motif, with the hero version large and faint at around **16% opacity**, and the argument-slide version smaller and stronger. It also defines the drawing animation through `.plate [stroke]`, transitioning from `stroke-dashoffset:2200` to `0` over about **2.6 seconds**. 

We should preserve that mechanic.

What changes is **what the plate represents**.

Instead of using an arbitrary technical drawing, the hero plate should communicate the Assetly idea:

**Access → Asset → Growth**

### Recommended Hero Plate

Use one continuous line illustration that subtly combines:

* an asset / equipment form
* a financial-flow or leasing path
* an upward expansion / scale gesture

It should not literally look like an infographic.

Think more like an **architectural/engineering drawing** where the meaning becomes apparent gradually.

For example:

A line begins as a simple rectangular asset/module → develops into equipment / infrastructure geometry → extends into a larger network/grid → ends with an upward or outward expansion.

This visually represents:

**Access → Scale → Grow**

without writing those words inside the illustration.

---

# Dynamic Behaviour

The hero plate should have **three stages**.

### Stage 1 — Entry

When the page loads:

* plate begins almost invisible
* SVG starts drawing itself
* approximately `2.6s`
* existing easing: `cubic-bezier(.65,0,.35,1)`
* opacity gradually settles around `16%`

This follows the existing design-system behavior. 

### Stage 2 — Living Plate

After the drawing completes, it should not become completely static.

Use extremely subtle movement:

* selected lines drift by about `2–5px`
* one or two nodes/sections slowly expand or reposition
* perspective shifts very slightly with cursor movement on desktop
* very slow cycle, approximately `8–12s`

The goal is to make the illustration feel **alive**, not animated.

No looping “drawing again” effect.

### Stage 3 — Scroll Transition

As the visitor begins leaving the Hero:

* hero plate slowly fades
* a specific portion of its geometry can visually remain or transform
* that geometry leads into the plate used by the first **Lease vs Loan vs Purchase** argument

This gives us a visual connection between sections instead of each screen feeling independent.

---

# Plate System Across the Site

This is where the motif becomes meaningful.

Rather than using unrelated plates, create a **family of drawings**.

### Hero Plate

Represents the overall Assetly system:

**Access → Scale → Grow**

Large background illustration.

### Compare / Argument Plates

Each plate represents the idea being discussed.

For example:

**Lease**
A flexible modular form / open framework.

**Loan**
A more constrained structure or layered financial stack.

**Purchase**
A solid, closed asset block.

They should not become literal icons. They should remain **technical line drawings**, consistent with the existing visual language.

### Why Us

Plate can represent connection/structuring:
multiple components intelligently connected into one system.

### Sectors

Each sector can derive its plate from real asset geometry:

* Commercial Interiors → plan/furniture geometry
* Manufacturing → machinery
* Construction → structural/crane geometry
* Hospitality → spatial/interior objects
* Healthcare → medical equipment
* IT Infrastructure → rack/server/network geometry

This creates an entire **Assetly visual vocabulary**, rather than generic icons.

---

# Typography

Following the uploaded design system: 

### Main line

**DM Serif Display**

Approximate sizing:

`clamp(31px, 6.4vw, 76px)`

Use a maximum of **2 lines**.

One important word can be italicized and set in:

**Moss — `#5C5C46`**

That is already an established recurring heading treatment.

### Subline

**DM Serif Text**

Smaller, editorial, restrained.

Approximately:

`clamp(17px, 1.8vw, 22px)`

Keep it to roughly 1–2 lines.

### Small labels

If any are needed:

**Inter Tight**
uppercase
wide tracking.

---

# Color

Primary hero surface:

**Paper — `#F6F4EC`**

Primary headline:

**Ink — `#26261B`**

Italic/emphasis:

**Moss — `#5C5C46`**

Plate:

**Olive — `#40402D`**

at approximately **16% opacity**.

Interactive accents, if any:

**Bottle — `#25453A`**

This stays completely aligned with the uploaded design system. 

---

# Hero Motion Sequence

The complete entry can feel choreographed:

**0.0s**
Plate starts drawing.

**0.2s**
Logo fades/settles in.

**0.4–1.4s**
Main headline lines rise through masks.

**1.0–1.8s**
Subline fades upward.

**2.6s**
Plate completes drawing.

**After ~3s**
Plate enters its almost-imperceptible ambient movement.

Everything uses the existing slow, confident Assetly motion language rather than quick SaaS-style transitions. 

---

## Core Hero Principle

The hero should not be:

**logo + headline + decorative drawing.**

It should be:

**logo + proposition + a living technical illustration of what Assetly does.**

And the plate system should continue throughout the site so that every traced drawing **means something about the section it belongs to**.

We should next lock the **actual Hero main line and subline** before designing the exact plate artwork.
---
3.Lease vs. Loan vs. Purchase
-
## Lease vs. Loan vs. Purchase — Final Section Plan

This section stays as the **core comparison narrative** and becomes a 4-step scroll sequence:

1. **Upfront Cash**
2. **Risk of Obsolescence**
3. **Tax Treatment**
4. **Leverage Impact**

The content is based on the existing Assetly one-page slide, while the interaction model follows the uploaded design system.  

### Desktop structure

Each point gets its own near-full-screen argument slide.

**Left side**

* dynamic plate
* index number
* headline
* short supporting copy

**Right side**

* Lease vs. Loan vs. Purchase calculator drawer

When the section begins, the calculator automatically slides in from the right. As it opens, the left content narrows to make room for it instead of being covered.

The calculator stays open throughout all four slides and automatically changes context based on whichever slide is currently in focus.

---

## 01 — Upfront Cash

**Plate meaning**
A technical drawing representing retained capital: a small portion is accessed while the larger reserve remains intact.

**Headline**
**Preserve capital.
Keep your business moving.**

**Supporting copy**
Access the assets you need without a large upfront outlay. An operating lease preserves working capital, while a loan may require a 10–25% margin and outright purchase requires 100% upfront. 

**Calculator state**

| Lease   | Loan              | Purchase         |
| ------- | ----------------- | ---------------- |
| **Low** | **10–25% margin** | **100% upfront** |

---

## 02 — Risk of Obsolescence

**Plate meaning**
A traced asset lifecycle: use → ageing → replacement, showing that the ownership burden changes over time.

**Headline**
**Use the asset.
Not the ownership risk.**

**Supporting copy**
With an operating lease, Assetly bears the resale and obsolescence risk. With a loan or outright purchase, that risk stays with you. 

**Calculator state**

| Lease                | Loan            | Purchase        |
| -------------------- | --------------- | --------------- |
| **Assetly bears it** | **You bear it** | **You bear it** |

No artificial percentage should be introduced here.

---

## 03 — Tax Treatment

**Plate meaning**
A financial-ledger style drawing that resolves into one clean recurring rental line.

**Headline**
**A simpler path
to deduction.**

**Supporting copy**
Full rentals are deductible, without depreciation block-rate limits or the 180-day usage restriction. GST input credit continues to apply. 

**Calculator state**

| Lease                      | Loan                        | Purchase              |
| -------------------------- | --------------------------- | --------------------- |
| **Full rental deductible** | **Depreciation + interest** | **Depreciation only** |

---

## 04 — Leverage Impact

**Plate meaning**
A progressively heavier balance-sheet structure, visually showing added financial weight.

**Headline**
**Keep leverage light.
Keep capacity available.**

**Supporting copy**
Preserve bank credit lines and collateral capacity while keeping a lighter impact on Debt/Equity and Debt/EBITDA compared with loan-funded acquisition. 

**Calculator state**

| Lease       | Loan                   | Purchase        |
| ----------- | ---------------------- | --------------- |
| **Minimal** | **Raises Debt/Equity** | **Drains cash** |

---

## Typography

This section is now **serif-led**.

**DM Serif Display**

* slide headlines
* index numbers
* major financial figures
* key calculator outcomes

**DM Serif Text**

* all supporting copy
* explanatory statements
* short contextual notes

**Inter Tight**

* only small UI chrome
* `LEASE / LOAN / PURCHASE`
* calculator mode labels
* tiny metadata
* drawer controls

So the visual voice is primarily **DM Serif**, with Inter Tight only supporting the interface. 

---

## Color system

Use the existing design tokens:

* **Paper:** `#F6F4EC`
* **Field:** `#E7E2CE`
* **Ink:** `#26261B`
* **Olive:** `#40402D`
* **Moss:** `#5C5C46`
* **Bottle:** `#25453A`
* **Line:** `rgba(38,38,27,.15)` 

The left narrative stays on Paper.

The calculator uses Field.

Bottle green is reserved for active controls and emphasis.

---

## Calculator behavior

The calculator is automatic and context-aware.

As the user scrolls:

**Slide 01 → Upfront Cash**
**Slide 02 → Risk of Obsolescence**
**Slide 03 → Tax Treatment**
**Slide 04 → Leverage Impact**

The drawer itself stays in position. Only the internal content transitions.

Use:

* fade
* slight `4–8px` vertical movement
* approximately `700–900ms`
* easing `cubic-bezier(.22,1,.36,1)`

The section should feel like **one analytical instrument changing perspective**, not four separate calculators. 

---

## Drawer button

Keep it extremely minimal.

Desktop:

* small triangle / chevron on drawer edge
* visually around `10–14px`
* no text
* larger invisible hit area for usability

Closed: `›`
Open: `‹`

It should look like a subtle mechanical control rather than a CTA.

If the visitor manually closes the calculator, it should stay closed until they reopen it.

---

## Plate animation

Each argument slide gets its own meaningful traced plate.

When a slide becomes active:

`stroke-dashoffset: 2200 → 0`

Duration:
**2.6s**

The plate draws itself once and stays visible at approximately the established argument-slide opacity.

The plate should visually represent the financial idea of that slide rather than act as generic decoration. 

---

## Left content transition

The active argument becomes:

* fully opaque
* sharp
* aligned at rest

Previous/next arguments become:

* slightly faded
* subtly blurred
* slightly vertically displaced

The focus should remain on **one argument per screen**. 

---

# Mobile Structure

Mobile should be specifically recomposed rather than shrinking the desktop layout.

### Top

* plate
* index
* headline
* compact supporting copy

### Bottom

* calculator bottom sheet

The calculator remains context-aware but stays physically stable while moving between the four arguments.

Recommended expanded height:
**34–42svh**

Maximum around the existing:
**42vh** 

### Mobile drawer control

A tiny centered triangle at the top edge of the bottom sheet.

Expanded: `▼`
Collapsed: `▲`

Visually small, but with an approximately 44px invisible touch target.

No text label.

### Mobile interaction rule

When a new argument becomes active:

1. content settles
2. plate draws
3. calculator values transition
4. calculator height remains stable

Do not keep pushing the content up and down on every slide.

This is especially important on small screens.

---

## Section entry and exit

**Entry from Hero / previous section**
Calculator is initially hidden.

As Slide 01 approaches:

* drawer begins opening
* left layout makes room
* Slide 01 plate draws
* calculator shows Upfront Cash

**Exit after Slide 04**
As the user approaches **Why Us**:

* calculator gradually slides away
* narrative content returns to full width
* next section enters cleanly

The calculator should exist only where it has narrative relevance.

---

## Final visual principle

This section should feel like:

**Editorial financial storytelling on the left + a live analytical instrument on the right.**

Not:

**text beside a dashboard.**

The DM Serif typography, meaningful plates, slow motion, and contextual calculator should make the entire sequence feel like one premium financial presentation.  
---
4.Why Us
-
## Why Us — Final Planning Direction

This section should use a **2×2 interactive grid**, with one Assetly value per card:

| T                          | F                           |
| -------------------------- | --------------------------- |
| **Tailored Structuring**   | **Fast Turnaround**         |
| **S**                      | **P**                       |
| **Multi-Sector Expertise** | **Strong Funding Partners** |

These four values come directly from the existing Assetly material. 

Each card should behave like a **physical two-sided object**.

### Front face

Keep it extremely minimal:

**T**
Tailored Structuring

**F**
Fast Turnaround

**S**
Multi-Sector Expertise

**P**
Strong Funding Partners

The letter should be oversized and dominant, with the value name secondary.

### On click

The card performs a **180° flip** and reveals the explanation on the back.

The flip should feel slow and deliberate, not playful:

* `rotateY(0deg) → rotateY(180deg)`
* duration around `0.8–1.0s`
* easing: `cubic-bezier(.65,0,.35,1)`
* proper `perspective`
* front and back use `backface-visibility:hidden`

The reverse face should contain only enough copy to explain the value.

### Back-face content

**T — Tailored Structuring**
Lease structures shaped around the asset, tenure, cash-flow needs, and business context rather than forcing every requirement into a standard template.

**F — Fast Turnaround**
A focused structuring and execution process designed to move from requirement to lease solution quickly.

**S — Multi-Sector Expertise**
Experience across commercial interiors, manufacturing, construction, hospitality, healthcare, and IT infrastructure helps Assetly understand different asset requirements.

**P — Strong Funding Partners**
A strong funding network supports the ability to structure and execute leasing requirements across different asset categories.

The first-level value names are source-derived; the explanatory copy above is an expansion of those values for the flip interaction rather than text explicitly present in the slide. 

### Typography

Keep the section strongly serif-led.

**Large T / F / S / P**
DM Serif Display

**Value name**
DM Serif Display

**Back-face explanation**
DM Serif Text

Use **Inter Tight** only for a tiny interaction label such as:

**CLICK TO EXPLORE**

or preferably an even quieter symbol/indicator if we want the cards to remain cleaner. 

### Grid design

Use the existing **ledger-style bordered grid** from the design system rather than four floating SaaS cards.

Desktop:

```text
┌─────────────────────┬─────────────────────┐
│ T                   │ F                   │
│ Tailored            │ Fast                │
│ Structuring         │ Turnaround          │
├─────────────────────┼─────────────────────┤
│ S                   │ P                   │
│ Multi-Sector        │ Strong Funding      │
│ Expertise           │ Partners            │
└─────────────────────┴─────────────────────┘
```

No large gaps between cards.

Use shared borders:

`1px solid rgba(38,38,27,.15)`

This preserves the editorial/financial character documented in the design system. 

### Front-face visual design

Base:
**Paper `#F6F4EC`**

Text:
**Ink `#26261B`**

Large letter:
**Olive `#40402D`**

Optional small accent:
**Moss `#5C5C46`**

Each front face should have generous empty space so the oversized letter feels architectural rather than like an icon.

### Back-face visual design

I would make the back subtly different so the flip has meaning.

Recommended:

**Field `#E7E2CE`** background

with:

* Ink copy
* Olive letter/marker
* Bottle `#25453A` used only for a tiny interaction detail

This makes the reverse feel like the **information layer** behind the principle.

### Interaction detail

Do not flip on hover.

Use **click/tap only**.

Hover on desktop can simply:

* slightly raise contrast
* move the card inward by `1–2px`
* reveal a tiny arrow or rotation indicator

That tells the visitor it is interactive without triggering unwanted movement.

On click:

* one card flips
* the others remain still

Click again:

* flips back

I would also allow multiple cards to remain flipped simultaneously rather than forcing an accordion behavior. The user can compare the explanations naturally.

### Entry animation

When the Why Us section enters:

* eyebrow/title fades in
* the four cells reveal with a subtle stagger
* around `0.12s` between cells
* `opacity:0 → 1`
* `translateY(16px) → 0`

Use the existing `.rv/.u` reveal language. 

The cards should **not flip automatically** during entrance. The flip must remain a deliberate user interaction.

### Mobile

On mobile, switch from 2×2 to **1-column**:

**T**
**F**
**S**
**P**

Each becomes a wide rectangular flip card.

The same 180° interaction works, but mobile requires one important adjustment: the back and front should have a consistent minimum height so the page does not jump when a card flips.

Tap the card → flip.
Tap again → return.

No hover-dependent behavior.

### Section heading

Keep this simple:

**WHY US**

small Inter Tight eyebrow

then a serif heading such as:

**Built around the way
businesses actually acquire assets.**

Or, if we want to stay even more restrained:

**Why Assetly**

The grid itself should carry most of the storytelling.

### Core principle

The front shows **what Assetly stands for**.

The flip reveals **what that value means for the customer**.

That gives T / F / S / P a real interaction purpose instead of displaying them as four static feature cards. 
---
5.Sectors We Serve
-
## Sectors We Serve — Final

### Sector Pool

* Commercial Interiors
* Manufacturing
* Construction
* Hospitality
* Healthcare
* IT Equipment & IT Infrastructure

### Desktop Structure

Use a **2×2 connected grid** with **4 sectors visible at once**:

```text
[ Sector 1 ] [ Sector 2 ]
[ Sector 3 ] [ Sector 4 ]
```

The grid should use the existing Assetly ledger-style treatment:

* shared `1px` borders
* no floating cards
* no heavy shadows
* no gaps between cells
* generous internal spacing
* equal card heights

This follows the bordered-grid language already defined in the design system. 

### Mobile Structure

Use a **vertical 1×4 connected grid**, still showing **4 sectors at once**:

```text
[ Sector 1 ]
[ Sector 2 ]
[ Sector 3 ]
[ Sector 4 ]
```

Mobile cards should be more compact:

* smaller plate
* sector name
* optional tiny index
* no long supporting paragraph

### Auto-Rotation

The section uses a continuous **one-out-one-in cycle**.

Final behavior:

* total sector pool: **6**
* visible sectors: **4**
* one card changes every **2.5 seconds**
* only one grid position updates at a time
* fade out over about **450ms**
* slight `translateY(10px)`
* replace content
* fade back in
* proceed to the next slot

The whole grid should never refresh together.

No carousel arrows.
No pagination dots.
No slider controls.

The underlying interaction comes from the existing Assetly auto-rotating card system, with the timing changed from 3.8s to 2.5s. 

### Card Content

Each card contains:

**Index / small label**
Inter Tight

**Sector name**
DM Serif Display

**Optional descriptor on desktop**
DM Serif Text

Example:

**01**
**Commercial Interiors**

Workplace, fit-out and interior assets.

Descriptions should remain very short and can be omitted entirely where the plate already provides enough context.

### Sector Plates

Each sector gets a meaningful traced-line plate rather than a generic icon:

* **Commercial Interiors** — floor plan / furniture / workspace geometry
* **Manufacturing** — machinery / production-line geometry
* **Construction** — structural / site / equipment geometry
* **Hospitality** — interior / furniture / operational-equipment geometry
* **Healthcare** — medical-equipment geometry
* **IT Equipment & IT Infrastructure** — server rack / hardware / network geometry

The plates should remain technical, abstract, and consistent with the Assetly visual language.

### Plate Animation

When a new sector enters a grid position, its plate draws once:

`stroke-dashoffset: 2200 → 0`

Duration:
**2.6s**

Use the same established Assetly plate animation and easing. 

The text can complete its 450ms swap while the plate continues drawing.

### Typography

The section remains serif-led.

**DM Serif Display**

* sector names

**DM Serif Text**

* short descriptions

**Inter Tight**

* indexes
* small labels
* UI metadata

### Colors

Use the existing design-system tokens:

* **Paper** — `#F6F4EC`
* **Field** — `#E7E2CE`
* **Ink** — `#26261B`
* **Olive** — `#40402D`
* **Moss** — `#5C5C46`
* **Bottle** — `#25453A`
* **Line** — `rgba(38,38,27,.15)` 

Recommended application:

* grid background → Paper
* sector name → Ink
* plate → Olive
* supporting text → Moss
* Bottle Green only for genuine interactive emphasis

### Section Entrance

When the user reaches the section:

1. section heading fades in
2. four cards reveal with a slight stagger
3. the initial four plates draw
4. automatic rotation starts after the entrance settles

### Desktop Hover

On hover:

* pause rotation
* slightly increase plate opacity
* keep the card physically stable

No scale-up effect.

### Mobile Behavior

No hover-dependent interaction.

The four vertically stacked cells remain passive while the same one-card-at-a-time **2.5s rotation** continues automatically.

### Locked Direction

**Desktop:** 2×2 grid
**Mobile:** 1×4 vertical grid
**Sector pool:** 6
**Visible at once:** 4
**Swap interval:** 2.5s
**Swap transition:** ~450ms + `translateY(10px)`
**Plate animation:** 2.6s traced draw
**Style:** connected editorial ledger grid
**Typography:** DM Serif-led
**Controls:** none

This is the final locked plan for **Sectors We Serve**. 
---
6.Contact
-
## Contact — Complete Final Draft

### Section Purpose

The Contact section should feel **functional, minimal, and creative**, not like a conventional contact form.

Its job is to do three things:

1. Show the primary ways to reach Assetly.
2. Give a simple Bengaluru location context.
3. Let a visitor quickly prepare an enquiry and continue it through their own email.

The **full office address is intentionally excluded from this section** and will be reserved for the Footer. The official email and phone come from the supplied Assetly visiting card. 

---

## 1. Main Layout

### Desktop

Use a roughly **40 / 60 split**.

**Left**

* Contact heading
* Official email
* Phone
* Minimal location reference

**Right**

* Large Bengaluru map/location visual
* Minimal Contact slider attached to the edge of the map

```text
┌────────────────────────────────────────────────────────────┐
│                                                            │
│ CONTACT US                  BENGALURU                      │
│                                                            │
│ Let's talk.                 ┌───────────────────────────┐  │
│                             │                           │  │
│ EMAIL                       │                           │  │
│ sankar@assetly.lease        │          ●                │  │
│                             │       Bengaluru           │  │
│ PHONE                       │                           │  │
│ +91 96204 71985             │                      [›]  │  │
│                             └───────────────────────────┘  │
│ BENGALURU                                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

No full postal address here.

---

# 2. Left-Side Content

Small UI label:

**CONTACT**

Main heading:

### **Let's talk.**

Keep the headline short. This section does not need another large marketing statement.

Then:

**EMAIL**
[sankar@assetly.lease](mailto:sankar@assetly.lease)

**PHONE**
+91 96204 71985

**LOCATION**
Bengaluru

The email should be clickable.

The phone number should also be tap-to-call on supported devices. 

---

# 3. Right Side — Location

Use a large, simplified **Bengaluru map visual** rather than displaying the full address.

The map should visually establish:

**Assetly — Bengaluru**

It should feel designed into the Assetly system rather than appearing like a default Google Maps embed.

Preferred treatment:

* warm muted map
* minimal street/detail noise
* Assetly location marker
* subtle Olive line work
* Paper / Field tones
* no unnecessary map information cards

A tiny label can read:

**BENGALURU**

No detailed address needs to be repeated.

---

# 4. Contact Slider

Place a very small control on the edge of the map.

Closed state:

**CONTACT  ›**

Or, if we want it even quieter:

**CONTACT** + a tiny triangular `›`

The control should not resemble a large CTA button.

It acts more like a **drawer handle**.

### On click

A contact panel slides across part of the map.

Use:

* approximately `700–900ms`
* easing `cubic-bezier(.65,0,.35,1)`
* no hard pop-up
* map remains partially visible underneath/beside the drawer

The existing Assetly motion system supports this slower, physical transition language. 

---

# 5. Contact Flow — Step 1

### What can we help with?

Present four common choices:

**01 — Operating Lease**
**02 — Existing Requirement**
**03 — Partnership**
**04 — General Enquiry**

Below:

**Something else?**
A small custom enquiry-type field.

Keep these as large selectable rows rather than traditional radio buttons.

Example:

```text
WHAT CAN WE HELP WITH?

01   Operating Lease              →
02   Existing Requirement         →
03   Partnership                  →
04   General Enquiry              →

Something else...
```

The enquiry categories above are recommended interface categories; the uploaded Assetly materials do not define official departments for them.

---

# 6. Step 2 — Minimal Details

Once an enquiry type is selected, ask only what is necessary.

### Always ask

**Name**

**Company**

**Email**

**Phone**
Optional

That is the base form.

Do not ask again:

**“What do you need?”**

because the visitor already selected that in Step 1.

---

## Conditional Fields

Only reveal extra questions when the selected category genuinely needs them.

### Operating Lease

Add:

**Asset / equipment**

**Approx. asset value**
Optional

That's all.

### Existing Requirement

Optional:

**Reference / short note**

### Partnership

Optional:

**Short note**

### General Enquiry / Custom

Show:

**Message**

Keep it as one short text area.

This keeps most enquiries extremely fast to complete.

---

# 7. Form Design

Avoid conventional boxed inputs.

Use **underline-style fields**:

```text
YOUR NAME

Rahul Sharma
────────────────────────
```

On focus:

* line becomes slightly stronger
* subtle Bottle accent
* label shifts gently
* no glow
* no thick input border

Use generous spacing so even a minimal form still feels premium.

---

# 8. Final Action

Once the required fields are complete:

### **Open in Gmail →**

This is the primary action.

The website generates an email draft based on:

* selected enquiry type
* name
* company
* email
* optional phone
* relevant conditional details

The destination is:

**[sankar@assetly.lease](mailto:sankar@assetly.lease)** 

---

# 9. Generated Email Example

If the visitor chooses:

**Operating Lease**

and enters:

Name: Rahul Sharma
Company: ABC Manufacturing
Asset: CNC machinery
Approx. value: ₹80 lakh

The generated draft becomes:

**Subject**

Operating Lease Enquiry — ABC Manufacturing

**Body**

> Hi Assetly,
>
> I'm Rahul Sharma from ABC Manufacturing and I'm reaching out regarding an operating lease requirement.
>
> Asset / equipment: CNC machinery
> Approx. asset value: ₹80 lakh
>
> You can reach me at [email] or [phone].
>
> Regards,
> Rahul Sharma

The visitor's Gmail compose window opens with this pre-filled.

Nothing is automatically sent.

They can review, edit, and send the message themselves.

---

# 10. Email Fallback

Under the primary action, include a very subtle secondary option:

**Use another email app**

This generates the same recipient, subject, and body through the visitor's default mail client.

So:

**Primary**
Open in Gmail →

**Secondary**
Use another email app

---

# 11. Typography

Keep the established Assetly hierarchy. 

### DM Serif Display

* “Let's talk.”
* Bengaluru / major location text
* large panel headings where appropriate

### DM Serif Text

* email
* phone
* form input values
* supporting information

### Inter Tight

* CONTACT
* EMAIL
* PHONE
* LOCATION
* enquiry category indexes
* form labels
* drawer controls
* CTA microcopy

The section should still feel **serif-led**, with Inter Tight acting as the interface layer.

---

# 12. Colors

Use the existing Assetly design tokens. 

**Page**
`#F6F4EC` — Paper

**Map / contact drawer**
`#E7E2CE` — Field

**Primary text**
`#26261B` — Ink

**Map lines / graphics**
`#40402D` — Olive

**Secondary information**
`#5C5C46` — Moss

**Active / interaction**
`#25453A` — Bottle

**Borders**
`rgba(38,38,27,.15)`

---

# 13. Animation

### Section entrance

1. CONTACT label fades in.
2. Main heading reveals.
3. Email / phone / Bengaluru appear with a subtle stagger.
4. Map fades/draws into place.
5. Contact handle becomes visible last.

### Drawer

`translateX()` with a slow physical easing.

Approximately:
**700–900ms**

### Internal steps

When going from:

**Enquiry type → Details**

use:

* fade
* `8–12px` horizontal/vertical movement
* approximately `500–700ms`

Do not create a dramatic carousel movement.

---

# 14. Mobile

Recompose vertically.

```text
CONTACT

Let's talk.

EMAIL
sankar@assetly.lease

PHONE
+91 96204 71985

LOCATION
Bengaluru

[ MAP ]

[ CONTACT › ]
```

When Contact is tapped:

Use a **bottom sheet**, not a side drawer.

Inside:

**Step 1**
Choose enquiry type

↓

**Step 2**
Minimal details

↓

**Open in Gmail →**

The bottom sheet should:

* be scrollable where necessary
* have a visible close/drag handle
* avoid taking over the screen unnecessarily
* keep fields full width
* maintain generous touch spacing

---

# 15. What We Deliberately Do Not Show Here

Do not include:

* website URL
* full postal address
* long company description
* social links unless later supplied
* large generic contact form
* unnecessary fields
* generic “Submit” button

The **full office address moves to the Footer**.

---

## Locked Contact Model

**Left:**
Contact heading + official email + phone + Bengaluru

**Right:**
Large location/map treatment

**Interaction:**
Minimal Contact drawer handle

**Step 1:**
Operating Lease / Existing Requirement / Partnership / General Enquiry / Custom

**Step 2:**
Name + Company + Email + optional Phone

**Conditional:**
Only essential enquiry-specific information

**Action:**
Open in Gmail →

**Fallback:**
Use another email app

**Email destination:**
`sankar@assetly.lease`

**Full address:**
Footer only

This keeps Contact **useful first, creative second**—with the creativity coming from the map + sliding enquiry interface rather than from unnecessary visual complexity.  
---
7.Footer
-
## Footer — Final Planning Direction

The footer should feel like a **continuation of the navigation/header system**, not a separate generic website footer. Use the same dark Assetly surface, typography discipline, restrained borders, and minimal motion defined in the design system. 

### 1. Overall visual treatment

Use:

* **Background:** Pitch `#21241A`
* **Primary logo/wordmark:** Ivory `#E7E3D4`
* **Secondary text:** Khaki `#B1AD77`
* **Dividers:** very subtle khaki/ivory transparency
* **Interactive hover:** restrained Bottle/Khaki treatment
* **Primary serif:** DM Serif
* **UI/navigation:** Inter Tight, uppercase, tracked

No cards, shadows, gradients, or decorative containers.

---

# 2. Footer Structure

Use **three main zones**.

### Left — Brand

Assetly logo

**assetly leasing**

**Access . Scale . Grow**

Keep this visually strong and spacious.

The logo and tagline come from the supplied Assetly visiting card. 

---

# 3. Middle — Navigation

Split links into **two small groups**, separated visually by spacing or a subtle vertical/horizontal rule.

### Explore

**Compare**
**Why Us**
**Sectors**

### Company

**Contact**
**About Us**

This keeps the footer navigation aligned with the page architecture rather than introducing unnecessary links.

On desktop:

```text
EXPLORE                 COMPANY

Compare                 Contact
Why Us                  About Us
Sectors
```

A subtle divider can sit between the two groups.

---

# 4. Right — Official Information

This is where the detailed company information belongs.

### CONTACT

**[sankar@assetly.lease](mailto:sankar@assetly.lease)**

**+91 96204 71985**

### OFFICE

Unit 101, Raheja Chancery
113, Brigade Road
Bengaluru, Karnataka — 560025

These details are directly from the supplied visiting card. 

The full address appears here rather than in the Contact section, as planned.

I would **not repeat the website URL** unless there is a functional reason—the visitor is already on the website.

---

# 5. Bottom Legal Bar

After the main footer content, add one thin divider and a compact final row.

### Left

**© Assetly Leasing**

The implementation can append the current year automatically.

### Right

Keep only policies actually needed.

**Privacy Policy**
**Terms of Use**

Potentially:

**Cookie Policy** — **only if** the website uses non-essential analytics/advertising cookies or a consent system that warrants a separate cookie policy.

Do not fill the footer with:

Refund Policy
Shipping Policy
Cancellation Policy
Accessibility Statement
Disclaimer
etc.

unless Assetly's actual service/legal setup requires them.

The uploaded materials do **not** provide policy documents or official legal-entity wording, so these policy titles are recommended site requirements rather than source-derived Assetly content.

---

# 6. Desktop Layout

Something close to:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [LOGO]                  EXPLORE              COMPANY        CONTACT      │
│  assetly leasing         Compare              Contact        email        │
│                          Why Us               About Us       phone        │
│  Access . Scale . Grow   Sectors                             OFFICE       │
│                                                             full address │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ © Assetly Leasing                       Privacy Policy    Terms of Use    │
└──────────────────────────────────────────────────────────────────────────┘
```

The **brand block should have considerably more visual presence** than the utility links.

---

# 7. Typography

### Logo / Assetly Leasing

Use the actual brand lockup wherever possible.

### Tagline

DM Serif Text or the treatment established in the existing brand asset.

### Navigation headings

Inter Tight
uppercase
small
wide tracking

### Footer links

Inter Tight or restrained DM Serif Text depending on hierarchy.

I would use **Inter Tight for the actual navigation links**, because the footer is fundamentally UI chrome, consistent with the source design system. 

### Address / email / phone

DM Serif Text

That creates a nice distinction:

**UI labels → sans**
**actual information → serif**

---

# 8. Link Interaction

Keep hover very subtle:

* Khaki → Ivory
* thin underline grows from left to right
* approximately `400–600ms`
* no movement larger than 1–2px
* no scale animation

Email:
click → open email client.

Phone:
click/tap → call.

Footer navigation:
smooth scroll to the relevant page section.

Logo:
returns to Hero.

---

# 9. Footer Entrance

The footer does not need a dramatic reveal.

As the visitor enters:

* brand block fades upward
* navigation groups follow with slight stagger
* contact information follows
* legal row appears last

Use the existing slow Assetly reveal easing. 

No plate animation is necessary here. The footer should feel like the **quiet conclusion** of the site.

---

# 10. Mobile Footer

Recompose vertically instead of squeezing the desktop columns.

```text
[ LOGO ]
assetly leasing
Access . Scale . Grow

────────────

EXPLORE
Compare
Why Us
Sectors

COMPANY
Contact
About Us

────────────

CONTACT
sankar@assetly.lease
+91 96204 71985

OFFICE
Unit 101, Raheja Chancery
113, Brigade Road
Bengaluru, Karnataka — 560025

────────────

Privacy Policy
Terms of Use

© Assetly Leasing
```

The two navigation groups can still sit **side by side on larger mobile widths**, but the official details should remain full-width below them.

---

## Locked Footer Structure

**Dark styling matching the header/navigation**

**Left**
Logo
Assetly Leasing
Access . Scale . Grow

**Navigation group 1**
Compare
Why Us
Sectors

**Navigation group 2**
Contact
About Us

**Official details**
Email
Phone
Full Bengaluru office address

**Final legal row**
Privacy Policy
Terms of Use
Cookie Policy only if technically required
Copyright

The key is to make the footer **complete without becoming crowded**: brand first, navigation second, official information third, legal necessities last.  
---
extra:
-About section

Add About as a simple standalone section between Why Us and Sectors.

Structure:

one large, strong image
one short heading
one concise description
optional small location/contact line at the bottom

Suggested content direction, grounded in the current Assetly material:

About Assetly

Assetly helps businesses access the assets they need through structured operating leases, with a focus on preserving working capital, reducing ownership risk, and maintaining financial flexibility. The current materials also position Assetly around tailored structuring, fast turnaround, multi-sector expertise, and strong funding partners.

Keep it short. No extra timeline, stats, founders section, or company-history storytelling unless that information is supplied later.

Design:

large image occupying roughly 55–65% of the section
text alongside or underneath
DM Serif Display heading
DM Serif Text body
Paper background
very subtle reveal only
Hero copy

Keep the Hero extremely simple.

Main line:
The lighter way to access what your business needs.

Subline / tagline:
Access . Scale . Grow

That tagline is directly established in the visiting-card material.

So the Hero remains:

Logo
The lighter way to access what your business needs.
Access . Scale . Grow

dynamic meaningful plate

No additional paragraph is needed.

Contact enquiry choices

Instead of inventing broad departments, base the choices on what Assetly actually talks about in the supplied material.

Use:

01 — Operating Lease
Primary leasing enquiry.

02 — Asset Requirement
For a specific asset/equipment need.

03 — Existing Requirement
For an ongoing discussion or requirement.

04 — General Enquiry

These are closer to the supplied company proposition than generic categories such as “Partnership.” Assetly’s source material centers on operating leases, asset acquisition structures, and relationship-manager-led requirements.

Then keep the details minimal:

Name
Company
Email
Phone — optional

Conditional:

Operating Lease / Asset Requirement
Asset or equipment
Approx. value — optional

Existing Requirement
Reference / short note — optional

General Enquiry
Short message

Then:

Open in Gmail →

Privacy / Terms

simple and generic

Privacy Policy
Terms of Use
Cookie Policy, only if required

until the final implementation/legal-planning stage.

For now, only reserve Privacy Policy and Terms of Use in the Footer. The supplied material does not contain official policy/legal wording, kepe is genrtic and simple
---
## Trusted By — Complete Final Section Plan

This section sits **directly after the Hero** on the homepage and appears only when enabled from the admin panel.

It should feel like a quiet **trust strip**, not a large content section.

### Purpose

Show the logos of companies, partners, clients, or organizations associated with Assetly.

The section should communicate credibility without interrupting the transition from Hero into the Lease vs. Loan vs. Purchase narrative.

The existing Assetly design system already defines this as a thin horizontal trust band with an infinitely scrolling logo marquee. 

---

## 1. Homepage Position

Final homepage structure:

1. Navigation
2. Hero
3. **Trusted By — conditional**
4. Lease vs. Loan vs. Purchase
5. Why Us
6. Sectors We Serve
7. Contact
8. Footer

If Trusted By is disabled, the page should transition **directly from Hero to Compare** with no empty space.

---

## 2. Section Content

Keep the copy extremely minimal.

Small label:

**TRUSTED BY**

Then only the logos.

No large heading.
No paragraph.
No statistics unless supplied later.

Example:

```text
TRUSTED BY

     Logo    Logo    Logo    Logo    Logo    Logo    →
```

The logos themselves are the content.

---

## 3. Visual Structure

Use a narrow full-width horizontal strip.

Recommended structure:

```text
┌──────────────────────────────────────────────────────────┐
│ TRUSTED BY                                               │
│                                                          │
│  Logo   Logo   Logo   Logo   Logo   Logo   Logo   Logo →│
└──────────────────────────────────────────────────────────┘
```

The section should be significantly shorter than a normal content section.

Recommended vertical padding:

`clamp(24px, 4vh, 44px)`

Use a subtle top and/or bottom hairline to distinguish the band without making it look boxed.

---

## 4. Background

Recommended:

**Paper — `#F6F4EC`**

This keeps the section visually connected to the Hero and Compare section.

Alternative:

**Field — `#E7E2CE`**

only if we need slightly more separation.

I would start with **Paper + borders** rather than changing the entire surface.

---

## 5. Typography

The label:

**Inter Tight**

* uppercase
* around `9–11px`
* tracking around `0.20em`
* Moss or Olive

Example:

**TRUSTED BY**

Do not use a large serif heading here.

This section is supporting evidence, not a narrative beat. 

---

## 6. Logo Treatment

Admin-uploaded logos may have inconsistent colors, proportions, and backgrounds, so the frontend needs a normalization layer.

Each logo should have:

* fixed maximum height
* automatic width
* `object-fit: contain`
* consistent surrounding whitespace
* no card background unless necessary
* no stretching

Recommended visual treatment:

Default:

* monochrome / desaturated where technically appropriate
* reduced opacity around `45–65%`

Hover:

* opacity increases
* optionally restore original logo color

Do not force every logo into the Assetly Olive color if doing so damages the brand mark.

Prefer preserving the actual source logo while controlling visual intensity.

---

## 7. Logo Sizing

Desktop:

Maximum logo height roughly:

`28–40px`

Mobile:

`22–30px`

Spacing between logos should be generous:

`clamp(40px, 6vw, 90px)`

This prevents the strip from looking like a crowded sponsor wall.

---

# 8. Continuous Marquee Animation

This should **not behave like a carousel**.

No:

* arrows
* pagination dots
* discrete slides
* snapping

Instead, the logos continuously flow horizontally.

The uploaded design system already specifies this pattern using a duplicated logo sequence and a continuous `translateX(-50%)` animation. 

### Recommended speed

Approximately:

**30–34 seconds per full loop**

The movement should be slow enough that logos can be recognized.

Use:

`linear`

rather than an easing curve, because the strip must maintain constant velocity.

---

## 9. Seamless Loop

The frontend duplicates the rendered logo collection:

```text
A B C D E F | A B C D E F
```

The track moves from:

`translateX(0)`

to:

`translateX(-50%)`

Then resets invisibly.

If there are too few logos to naturally fill the viewport, repeat the collection enough times to ensure there is never blank space.

This calculation should happen automatically.

---

## 10. Hover Behavior

Desktop:

When the visitor hovers anywhere over the marquee:

**pause the movement**

This gives them time to inspect the logos.

Individual logo hover:

* increase opacity
* optional slight original-color reveal

No scaling larger than roughly `1.02` if any scale is used at all.

Prefer opacity over scale.

---

## 11. Mobile

Keep the **same horizontal marquee concept**.

Do not turn it into:

* a vertical list
* swipe carousel
* grid

Mobile behavior:

* continuous horizontal movement
* same logo order
* slightly smaller logos
* slightly tighter spacing
* potentially slightly slower loop

Recommended:

**34–40 seconds**

to improve readability on narrow screens.

Users do not need to swipe it manually.

---

# 12. Initial Entrance

When the Trusted By section enters after Hero:

1. `TRUSTED BY` label fades in.
2. Logo strip fades in.
3. Continuous movement begins.

Keep the reveal subtle.

No plate animation here.

The moving logos are already enough motion.

---

# 13. Reduced Motion

Respect:

`prefers-reduced-motion: reduce`

In reduced-motion mode:

* stop the automatic marquee
* show the logos as a horizontally scrollable static strip
* allow normal touch/trackpad scrolling

This follows the accessibility philosophy already present in the design system. 

---

# 14. Admin Panel

The admin panel should remain deliberately small.

Its purpose is **only to control the Trusted By section**.

### Admin capabilities

**Section**

* Trusted By ON / OFF

**Logos**

* Upload logo
* Company / organization name
* Alt text
* Enable / disable individual logo
* Reorder
* Delete

No website-wide CMS is required.

---

# 15. Firebase Architecture

Lock this section to Firebase.

### Firebase Authentication

Protect the admin area.

Only authorized Assetly admins can access it.

### Firebase Storage

Stores the logo files.

Example path:

```text
trusted-logos/
    company-a.svg
    company-b.png
    company-c.webp
```

Prefer SVG, WebP, or optimized PNG depending on the supplied source.

### Firestore

Stores configuration and metadata.

Recommended model:

```text
siteSections
    trustedBy
        enabled: true
        updatedAt: timestamp
```

And:

```text
trustedLogos
    logoId
        name: "Company Name"
        alt: "Company Name logo"
        imageUrl: "..."
        active: true
        sortOrder: 1
        createdAt: timestamp
        updatedAt: timestamp
```

---

# 16. Frontend Query Logic

The homepage first reads:

`siteSections/trustedBy`

If:

`enabled === false`

→ render nothing.

If:

`enabled === true`

→ query active logos sorted by `sortOrder`.

Conceptually:

```text
enabled?
    ↓
YES → get active logos → render marquee
NO  → skip entire section
```

---

## 17. Empty-State Logic

Even if the admin has enabled the section, do not render it when there are no active logos.

So the frontend condition should effectively be:

**enabled AND activeLogos.length > 0**

Otherwise:

return nothing.

This prevents an empty “Trusted By” section from appearing.

---

# 18. Reordering

The admin should be able to control display order.

Simplest interface:

Each logo has:

* move up
* move down

or drag-and-drop if we want a slightly nicer admin experience.

Firestore stores:

`sortOrder`

The frontend always sorts ascending before building the marquee.

---

# 19. Upload Validation

Because external logo files can be messy, enforce basic validation.

Recommended:

* SVG
* PNG
* WebP

Set a sensible upload limit, for example around **2 MB per logo**, though actual optimized assets should be much smaller.

The admin should see a preview before/after upload.

---

# 20. Logo Accessibility

Every image needs meaningful alt text.

For example:

`Acme Industries logo`

The admin's company-name field can automatically generate this by default.

Decorative duplicate copies used to create the infinite marquee should be hidden from screen readers to avoid the logo list being announced twice.

---

# 21. Loading Behavior

Avoid the section jumping in height after Firestore responds.

Reserve a small predictable section height only when practical, or fetch the toggle/config early enough that layout shift is negligible.

Logo images should:

* use intrinsic dimensions where available
* lazy load when appropriate
* avoid blocking Hero rendering

The Hero must remain the performance priority.

---

# 22. Failure Behavior

If Firebase is temporarily unavailable:

**hide the Trusted By section.**

Do not display:

* Firebase errors
* empty logo placeholders
* broken UI

This is optional trust content, so failure should degrade silently.

---

# 23. Section Toggle Behavior

Admin:

**Trusted By**
`ON / OFF`

When switched OFF:

* update Firestore
* homepage removes the entire section

When switched ON:

* homepage renders it when valid active logos exist

No deployment should be required.

That is the main benefit of making it remotely controlled.

---

# 24. Design Tokens

Use:

**Background**
`#F6F4EC`

**Primary small text**
`#5C5C46`

**Logo treatment**
Original logo or visually normalized monochrome

**Hairline**
`rgba(38,38,27,.15)`

**Hover emphasis**
`#40402D` where appropriate

Keep Bottle Green out of this section unless there is an actual clickable interaction.

---

# 25. Final Interaction Model

**Admin uploads logos**
↓
**Firebase Storage stores files**
↓
**Firestore stores metadata/order**
↓
**Admin turns Trusted By ON**
↓
**Homepage detects enabled state**
↓
**Active logos appear after Hero**
↓
**Continuous seamless marquee starts**

Admin turns it OFF:

**section disappears completely.**

---

## Locked Trusted By Specification

**Position:** immediately after Hero
**Optional:** yes
**Controlled by:** admin toggle
**Database:** Firestore
**Images:** Firebase Storage
**Admin security:** Firebase Authentication
**Content:** logos only + small `TRUSTED BY` label
**Animation:** continuous horizontal marquee
**Loop:** duplicated/seamless sequence
**Desktop speed:** ~30–34s
**Mobile speed:** ~34–40s
**Hover:** pause + increase logo opacity
**Reduced motion:** static horizontally scrollable logos
**Controls:** none on public site
**Empty/error state:** section hidden
**Style:** quiet, premium, supporting trust strip

This preserves the Trust Strip already defined in the Assetly design language while making the logos and visibility fully manageable without changing or redeploying the website. 
---
So the site architecture is now:

Page 1 — Home
Navigation
Hero
Trusted By — optional / admin-toggleable
Lease vs. Loan vs. Purchase
Why Us
Sectors We Serve
Contact
Footer
Page 2 — About

A separate /about page with its own:

hero / large image
short company description
supporting company information
contact/location details near the end
same navbar and footer system

The navbar About link should navigate to /about, while Compare, Sectors, Contact remain anchors on the homepage.

Likewise, in the footer:

Compare → homepage section
Why Us → homepage section
Sectors → homepage section
Contact → homepage section
About Us → /about

That keeps the product very clean: only two public pages — Home and About.
---
The working stack is now:

Next.js App Router
React + TypeScript
CSS Modules + global design tokens
DM Serif Display
DM Serif Text
Inter Tight
Native CSS + Motion for React + targeted requestAnimationFrame
Inline SVG plate components
Firestore
Firebase Storage
Firebase Authentication
Firebase App Hosting
GitHub
Zod
Vitest + Playwright
Gmail compose + mailto: fallback
Custom static/SVG Bengaluru map initially
No general-purpose CMS yet
No Redux/Zustand
No Tailwind
No GSAP initially
No analytics initially
---