# DECISIONS — Assetly Website

Every important technical or product decision, including conflict resolutions found while converting the raw planning material (`plan.md`, `DESIGN_SYSTEM.md`, the visiting card, and the static HTML prototypes) into `SOURCE_OF_TRUTH.md`. Status `Active` decisions should not be reopened without a new, material constraint — record any change as a new entry that supersedes the old one rather than editing history.

---

### DEC-001 — Hero headline/subline: use plan.md's final locked copy, not the prototype's

- **Date**: 2026-08-19
- **Decision**: The Hero main line is "The lighter way to access what your business needs." with subline/tagline "Access . Scale . Grow." No additional paragraph.
- **Reason**: `plan.md`'s final "extra" section (timestamp 2026-08-19 17:43, the newest planning content in the repo) explicitly locks this copy and says to keep the Hero extremely simple. It postdates and supersedes the earlier in-file "Hero Slide" brainstorm section, which discussed structure/motion but deferred locking copy ("We should next lock the actual Hero main line and subline before designing the exact plate artwork").
- **Alternatives considered**: The static prototype `home-2.html` (and its copies `index.html`, `assetly-home.html`), committed as "the live homepage" per git history, use a different headline: "The lighter balance sheet." Files `1-residual.html`, `2-duty-cycle.html`, `3-white-paper.html`, `4-position.html` are earlier internal-review draft explorations (see `previews.html`: "Working versions for review. Nothing here is final") using an entirely different, non-approved type system (Bodoni Moda / Cormorant Infant) — not candidates for source-of-truth status at all.
- **Why rejected**: Those are pre-`plan.md` prototypes/explorations, not the final approved planning document. `plan.md` is the authoritative, explicitly-labeled planning source supplied for this conversion and is chronologically newer.
- **Consequences**: The Next.js Hero component uses the `plan.md` copy. `DESIGN_SYSTEM.md` and the static HTML files remain valid as **motion/token/pattern references only** — never as copy or section-order authorities.
- **Status**: Active

---

### DEC-002 — About is a separate `/about` route, not a homepage section

- **Date**: 2026-08-19
- **Decision**: About is a standalone `/about` page. It is never inserted into the homepage between Why Us and Sectors.
- **Reason**: `plan.md`'s own final site-architecture statement ("So the site architecture is now: Page 1 — Home ... Page 2 — About: A separate /about page...") and the user's explicit PROJECT BASELINE instructions both lock this. The baseline is unambiguous: "About must remain a separate page and must NOT be inserted into the homepage."
- **Alternatives considered**: An earlier passage in `plan.md`'s "extra" section says "Add About as a simple standalone section between Why Us and Sectors."
- **Why rejected**: Superseded by `plan.md`'s own later, more complete architecture statement, and independently overridden by the explicit user baseline for this task, which takes precedence over any informal in-document draft.
- **Consequences**: Homepage section order is the 8 items in `SOURCE_OF_TRUTH.md` §3, with no About beat. The Nav "About" link and Footer "About Us" link both navigate to `/about` (not an anchor scroll).
- **Status**: Active

---

### DEC-003 — Contact enquiry categories: drop "Partnership," add "Asset Requirement"

- **Date**: 2026-08-19
- **Decision**: Contact Step 1 categories are: 01 Operating Lease, 02 Asset Requirement, 03 Existing Requirement, 04 General Enquiry (+ "Something else…" custom field).
- **Reason**: `plan.md`'s "extra" section revises the original Contact section's category list and explicitly justifies the change: "Instead of inventing broad departments, base the choices on what Assetly actually talks about in the supplied material... These are closer to the supplied company proposition than generic categories such as 'Partnership.'"
- **Alternatives considered**: The original "Contact — Complete Final Draft" section's locked list: 01 Operating Lease, 02 Existing Requirement, 03 Partnership, 04 General Enquiry.
- **Why rejected**: The revision is later in the document and is explicitly grounded in actual Assetly source material (operating leases, asset acquisition, requirement-led enquiries) rather than an invented department name ("Partnership") that the source material doesn't support.
- **Consequences**: Contact section conditional-fields logic follows the revised list (Asset Requirement gets the same conditional fields as Operating Lease: asset/equipment + optional approx. value).
- **Status**: Active

---

### DEC-004 — Mobile navigation: hamburger + full-width top overlay (not link-hiding)

- **Date**: 2026-08-19
- **Decision**: Mobile navigation shows the logo + hamburger; opening it reveals a full-width top overlay/dropdown with all four links (Compare, Sectors, About, Contact) stacked vertically.
- **Reason**: `plan.md`'s "Navigation Bar — Final Version" section is explicitly labeled as final and gives a complete, detailed mobile-menu spec (hamburger animation, overlay treatment, stagger entrance).
- **Alternatives considered**: `DESIGN_SYSTEM.md` (extracted from the `home-2.html` prototype) documents a different, older mobile pattern: "under 660px, all links except `.only` (Contact) hide; remaining chrome stays static (no hamburger — deliberately minimal)."
- **Why rejected**: `DESIGN_SYSTEM.md` is explicitly framed as a content-agnostic pattern/motion extraction from a prototype file, not a live product spec, and it predates `plan.md`'s final navigation lock. Where the two disagree on interaction behavior (as opposed to tokens/easing, which are consistent between them), `plan.md`'s "Final Version" wins.
- **Consequences**: The nav component implements a real hamburger + overlay, not the prototype's link-hiding approach. `DESIGN_SYSTEM.md`'s token/easing/motion-primitive material remains valid and is reused.
- **Status**: Active

---

### DEC-005 — No standalone "Close/CTA" band; Contact is the final content beat

- **Date**: 2026-08-19
- **Decision**: The homepage has exactly the 8 sections listed in `SOURCE_OF_TRUTH.md` §3. There is no separate dark "Close" CTA slide between Sectors/Contact and the Footer.
- **Reason**: The user's PROJECT BASELINE and `plan.md`'s final locked homepage order both list exactly 8 sections ending Sectors → Contact → Footer. Neither includes a Close band.
- **Alternatives considered**: `DESIGN_SYSTEM.md` §6 (extracted from the `home-2.html` prototype) documents a "Close — centered final CTA slide, serif h2 + p + bottle-bordered button" positioned before the Footer.
- **Why rejected**: `DESIGN_SYSTEM.md` reflects an earlier prototype's structure, not the finalized, explicitly-ordered homepage architecture given in the baseline and in `plan.md`'s locked section list.
- **Consequences**: Contact functions as the site's final persuasive/action beat before the Footer; no additional generic CTA slide is built.
- **Status**: Active

---

### DEC-006 — Sectors auto-rotation interval: 2.5s (not 3.8s)

- **Date**: 2026-08-19
- **Decision**: Sectors auto-rotation swaps one card every 2.5 seconds (450ms fade transition).
- **Reason**: `plan.md`'s locked Sectors spec explicitly states the change: "The underlying interaction comes from the existing Assetly auto-rotating card system, with the timing changed from 3.8s to 2.5s."
- **Alternatives considered**: `DESIGN_SYSTEM.md` §7 documents the prototype's original 3.8s interval.
- **Why rejected**: Not a real conflict — `plan.md` self-documents this as an intentional, explicit change to the prototype's original timing. Logged for traceability since a developer might otherwise copy the prototype's `setInterval(..., 3800)` value verbatim.
- **Consequences**: Implementation uses 2.5s, not 3.8s.
- **Status**: Active

---

### DEC-007 — Trusted By marquee: dual desktop/mobile speed (not one constant speed)

- **Date**: 2026-08-19
- **Decision**: Desktop marquee loop ~30–34s; mobile marquee loop ~34–40s (slower, for on-screen readability).
- **Reason**: `plan.md`'s locked Trusted By spec explicitly sets separate desktop/mobile speeds.
- **Alternatives considered**: `DESIGN_SYSTEM.md` §6 documents the prototype's single constant speed: `animation: scroll-logos 32s linear infinite` for all viewports.
- **Why rejected**: `plan.md`'s locked spec is more recent and explicitly differentiates by viewport for a stated readability reason.
- **Consequences**: Marquee animation duration is responsive (CSS custom property or breakpoint-driven), not a single fixed value.
- **Status**: Active

---

### DEC-008 — Next.js App Router over static HTML

- **Date**: 2026-08-19 (ratified; originally set by the project baseline)
- **Decision**: The site is rebuilt in Next.js (App Router) + React + TypeScript. The existing static HTML files (`home-2.html`, `index.html`, `assetly-home.html`, `1-residual.html`, `2-duty-cycle.html`, `3-white-paper.html`, `4-position.html`, `previews.html`) are prototypes/references only and are not the shipped implementation.
- **Reason**: Enables component architecture, routing (`/`, `/about`, `/admin`), TypeScript safety, and Firebase integration (Firestore/Storage/Auth/App Hosting) as specified in the technical baseline.
- **Alternatives considered**: Continuing to hand-build static HTML/CSS/JS (as the existing prototypes do).
- **Why rejected**: Static HTML has no practical path to admin-managed dynamic content (Trusted By), protected routes, or a maintainable component/testing setup at the site's complexity level.
- **Consequences**: Phase 0 of `MASTER_PLAN.md` ports design tokens, fonts, and motion primitives from `DESIGN_SYSTEM.md` into a Next.js project structure; the HTML prototypes stay in the repo as visual/motion reference until Phase 0 completes, then can be archived.
- **Status**: Active

---

### DEC-009 — CSS Modules + global tokens over Tailwind

- **Date**: 2026-08-19 (ratified; set by the project baseline)
- **Decision**: Styling uses CSS Modules per component plus a global CSS custom-property token file, not a utility-class framework.
- **Reason**: The design language is built on a small, disciplined token set (§6–§9 of `SOURCE_OF_TRUTH.md`) and bespoke motion primitives (`.m`, `.rv`, `.plate [stroke]`) that map more directly onto hand-written component CSS than a utility-class system.
- **Alternatives considered**: Tailwind CSS.
- **Why rejected**: Explicitly excluded by the technical baseline ("No Tailwind"); the editorial/financial visual language relies on precise, non-utility layout (shared-border ledger grids, clamp-based fluid type) better expressed as authored CSS.
- **Consequences**: Every new component ships with a co-located `.module.css` file; global tokens live in one root stylesheet imported once.
- **Status**: Active

---

### DEC-010 — Firebase over alternative BaaS/hosting

- **Date**: 2026-08-19 (ratified; set by the project baseline)
- **Decision**: Firestore + Storage + Authentication + App Hosting is the backend/hosting stack for the admin-managed Trusted By feature and deployment.
- **Reason**: One vendor covers auth, document storage, file storage, and hosting for a small, single-feature admin surface — avoids operating multiple services for a narrow need.
- **Alternatives considered**: None specified in source material as seriously evaluated (e.g. a generic Node/Postgres backend, Cloudflare stack).
- **Why rejected**: N/A — set directly by the technical baseline, no competing option was put forward in the source material.
- **Consequences**: Phase 0 provisions a Firebase project; Phase 3 builds the Trusted By schema (§18 of `SOURCE_OF_TRUTH.md`) on top of it; Phase 11 deploys via Firebase App Hosting.
- **Status**: Active

---

### DEC-011 — Firestore manages only Trusted By content, not a general CMS

- **Date**: 2026-08-19 (ratified; set by the project baseline)
- **Decision**: Firestore/Storage back only the Trusted By section. All other homepage/About copy, plates, and layout are static in the codebase.
- **Reason**: "No general-purpose CMS until it is actually required" and "Firestore should initially manage only content that requires remote control" (project baseline principles). Trusted By is the only section that genuinely needs post-launch, no-redeploy editability (partner logos change independent of code releases).
- **Alternatives considered**: A broader CMS-driven content model for sections like Sectors, Why Us, or Contact copy.
- **Why rejected**: Adds complexity, schema surface, and admin UI work with no stated business need — none of the other sections are expected to change without a code/content review.
- **Consequences**: Sectors, Why Us, Compare, Contact, About copy all live as typed constants/content files in the Next.js codebase, versioned with the rest of the code.
- **Status**: Active

---

### DEC-012 — Gmail compose generation + `mailto:` fallback instead of backend email delivery

- **Date**: 2026-08-19 (ratified; set by the project baseline)
- **Decision**: The Contact form builds a Gmail compose URL (primary) and a `mailto:` link (fallback) rather than submitting to a backend email-sending service.
- **Reason**: Avoids standing up and maintaining a transactional-email backend (SMTP relay, spam/deliverability handling, secrets management) for a low-volume B2B enquiry form; the visitor reviews and sends the email themselves from their own account.
- **Alternatives considered**: A server action / Cloud Function that sends email via a transactional provider directly.
- **Why rejected**: Materially more infrastructure (secrets, deliverability, spam handling, a data-collection surface to secure) for a site whose enquiry volume doesn't require automated delivery; explicitly specified this way in the baseline.
- **Consequences**: No enquiry data is persisted or transmitted through Assetly's own servers — the browser only constructs a URL. No Firestore write happens on Contact form submission (contrast with Trusted By's Firestore usage in DEC-011).
- **Status**: Active

---

### DEC-013 — Hero opening: dedicated brand-signature loader replaces the earlier choreographed Hero entry; built as a mini-phase after Phase 8, not inside Phase 2

- **Date**: 2026-08-19
- **Decision**: The Hero's entry choreography is replaced by a dedicated opening sequence: a full-screen Pitch (`#21241A`) opening screen showing only the "A" brand mark (Ivory `#E7E3D4`) and "ACCESS · SCALE · GROW" (Khaki `#B1AD77`), which slow-double-blinks, recedes, and settles into the Hero's final "A" position before the Hero proposition and tagline reveal and the plate becomes quietly visible. Full spec lives in `SOURCE_OF_TRUTH.md` §11a. This sequence uses only existing tokens (Pitch/Ivory/Khaki/Olive, `--d`/`--u` type, `--eio` easing) — no loader-specific colors, fonts, or easing are introduced. Build sequencing: Phase 2 ships the Hero with a simple interim entrance (plate draw + mask reveal, no blink/recede choreography); the full loader is built as a new **Phase 8.5 — Hero Loader / Opening Sequence**, scheduled after Phase 8 (About) and before Phase 9 (Legal/SEO), so it lands only once the rest of the site shell is stable.
- **Reason**: User-supplied "HERO LOADER / OPENING — FINAL BRAND-ALIGNED ADD-ON" spec, explicitly framed as replacing "the previous complex Hero opening animation only" and requesting it be scheduled as "a mini phase" after Phase 8.
- **Alternatives considered**: Building the full loader choreography inside Phase 2 alongside the rest of the Hero, per the original `MASTER_PLAN.md` sequencing.
- **Why rejected**: The user explicitly requested the loader be scheduled after Phase 8 rather than bundled into Phase 2 — this lets the core Hero (copy, plate, layout) ship and stabilize early while the more elaborate brand-signature opening is layered on once the rest of the site (through About) exists to open into.
- **Consequences**: `SOURCE_OF_TRUTH.md` §11's old "Hero motion sequence" (0.0s plate → 0.2s logo → ... → ~3s ambient start) is superseded as the *first paint* sequence — it still describes the Hero's own internal entrance (logo/headline/plate reveal), but that reveal now fires only after the loader's "A" settles, not on Hero mount from a blank page. `MASTER_PLAN.md` Phase 2's Hero tasks build the Hero to receive this hand-off (final "A" position, deferred plate/copy reveal) but do not implement the blink/recede loader itself. A new Phase 8.5 is inserted in `MASTER_PLAN.md` and `EXECUTION_ORDER.md`.
- **Status**: Active

---

## Decision index

| ID | Topic | Status |
|---|---|---|
| DEC-001 | Hero headline/subline copy | Active |
| DEC-002 | About = separate page, not homepage section | Active |
| DEC-003 | Contact enquiry categories (drop Partnership) | Active |
| DEC-004 | Mobile nav = hamburger + overlay | Active |
| DEC-005 | No standalone Close/CTA band | Active |
| DEC-006 | Sectors rotation interval = 2.5s | Active |
| DEC-007 | Trusted By dual marquee speed | Active |
| DEC-008 | Next.js over static HTML | Active |
| DEC-009 | CSS Modules over Tailwind | Active |
| DEC-010 | Firebase as backend/hosting | Active |
| DEC-011 | Firestore scoped to Trusted By only | Active |
| DEC-012 | Gmail compose + mailto over backend email | Active |
| DEC-013 | Hero brand-signature loader replaces old Hero entry; built as Phase 8.5 | Active |
