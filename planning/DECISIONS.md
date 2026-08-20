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

### DEC-014 — Phase 0 exits with the Firebase project deferred; the SDK is wired from environment variables only

- **Date**: 2026-08-20
- **Decision**: Phase 0 ships `lib/firebase/client.ts` and `lib/firebase/admin.ts` configured entirely from environment variables, with a committed `.env.local.example` listing every required key and **no** real `.env.local` and **no** Firebase project. `OD-05` (project ID, dev/staging/production split, custom domain) stays open and moves to Phase 3 (which is the first phase that actually reads from Firebase) and Phase 11 (deployment). Both modules are lazy and return `null` when the environment is incomplete, so an unconfigured project cannot throw at import time or during a build.
- **Reason**: Creating the Firebase project needs console access to the Assetly account, which the implementing agent does not have. `MASTER_PLAN.md`'s Phase 0 exit criteria explicitly allow this path — "OD-05 resolved (or explicitly deferred with a stub project for local dev only, documented in `PROGRESS.md`)" — and nothing else in Phase 0, Phase 1, or Phase 2 depends on a live project.
- **Alternatives considered**: (a) Blocking Phase 0 until the project exists. (b) Creating a throwaway personal Firebase project as a stub.
- **Why rejected**: (a) would idle Phases 1 and 2, which have no Firebase dependency at all, behind an account-access problem. (b) would put a credential and a project ID into the repository's history that nobody intends to keep, and would have to be migrated and revoked later — worse than having no project.
- **Consequences**: `isFirebaseConfigured()` / `isFirebaseAdminConfigured()` are the contract: every caller must treat the accessors as nullable and degrade rather than assert. This suits §12/§18/§21, which already require Trusted By to fail silently. `TRUST-001` through `TRUST-004` cannot start until `OD-05` and `OD-06` are resolved. `firestore.rules` and `storage.rules` ship deny-by-default so that an accidentally-created project is closed rather than open.
- **Status**: Active

---

### DEC-015 — WITHDRAWN: self-host the three brand fonts via `next/font/local` if Google Fonts is unreachable at build time

- **Date**: 2026-08-20 (proposed); withdrawn 2026-08-20
- **Status**: **Withdrawn — not applied, and no longer needed.** The proposal's own closing condition was met: `npm run build` was re-run on a machine with normal internet access and succeeded, fetching all three families from Google Fonts without error. The blockage was specific to the sandbox's egress proxy, not to the project. `app/layout.tsx` keeps `next/font/google` exactly as §7 specifies, and no font binaries are vendored into the repository. Should a future build environment block Google Fonts again, the plan recorded below is still the right one — reopen it as a new decision rather than editing this entry.
- **Problem**: `app/layout.tsx` loads DM Serif Display, DM Serif Text, and Inter Tight through `next/font/google` per §7 and `MASTER_PLAN.md` Phase 0 task 4. `next/font/google` downloads the font files from `fonts.googleapis.com` / `fonts.gstatic.com` **at build time**. In the sandboxed environment Phase 0 was built in, both hosts are blocked at the egress proxy (`CONNECT tunnel failed, 403`), so `next build` fails with three `Failed to fetch <font> from Google Fonts` errors and nothing else. Type-checking and linting pass unaffected.
- **Proposal**: If, and only if, the build also fails on a machine with normal internet access, vendor the three families as `.woff2` files (for example from the `@fontsource` packages on npm, which the same environment can reach) and load them with `next/font/local`, keeping the same `--font-dm-serif-display` / `--font-dm-serif-text` / `--font-inter-tight` variable names so `styles/tokens.css` and every consuming component stay untouched.
- **Alternatives considered**: Setting `HTTP_PROXY`/`HTTPS_PROXY` so Next.js can reach Google Fonts; loading the fonts with a plain `<link>` to the Google Fonts CSS instead of `next/font`.
- **Trade-offs**: Self-hosting removes a third-party build-time dependency and a runtime origin, and is generally better for privacy and for first paint (§21 makes Hero rendering the top performance priority). It costs roughly 200–400KB of committed binary assets and means font updates become a manual step. A plain `<link>` was not proposed because it gives up `next/font`'s automatic preloading and layout-shift protection, which §20's layout-stability rule cares about.
- **Why it is only a proposal**: The blockage may be specific to the sandbox rather than to the project. Silently swapping the font strategy would change an approved §7 implementation detail on the strength of one environment's network policy. Confirm the failure reproduces on a real development machine first.
- **Next step**: Run `npm run build` on a networked machine. If it succeeds, close this entry as `Withdrawn`. If it fails identically, apply the proposal and move this entry to `Active`.

---

### DEC-016 — `FOUND-008` (archive the static HTML prototypes) closed as not applicable

- **Date**: 2026-08-20
- **Decision**: `FOUND-008` is closed without archiving anything. No `reference/` folder is created.
- **Reason**: The prototypes the task refers to (`home-2.html`, `index.html`, `assetly-home.html`, `1-residual.html`, `2-duty-cycle.html`, `3-white-paper.html`, `4-position.html`, `previews.html`) are not in the working tree, and `git log --all --diff-filter=A` confirms no `.html` file has ever been committed to this repository. `assests/` holds `plan.md`, `DESIGN_SYSTEM.md`, the visiting-card PDF, a one-page PPTX, and the raster/PSD logo files — no HTML. There is nothing to archive or exclude from the build.
- **Consequences**: `DEC-008` still stands as the record of *why* the site is Next.js rather than static HTML, and `DESIGN_SYSTEM.md` remains the surviving second-hand description of the `home-2.html` prototype's tokens, motion primitives, and patterns — it is now the only reference to that prototype's behaviour. If the original HTML files turn up outside the repository, adding them under `reference/` later is still worthwhile for the motion detail `DESIGN_SYSTEM.md` only summarises; that would be a new task, not a reopening of this one.
- **Status**: Active

---

### DEC-017 — Nav wordmark is the serif "assetly" lockup, and the bar runs wider than the page gutter

- **Date**: 2026-08-20
- **Decision**: Three changes to the navigation as specified in `SOURCE_OF_TRUTH.md` §10, all approved directly by the user while reviewing the built Phase 1 shell:
  1. The nav wordmark is **"assetly"** alone. The "Leasing" suffix is dropped from the bar. The Footer keeps the full "assetly leasing" lockup per §17.
  2. The wordmark is set in **DM Serif Display (`--d`)**, matching the Footer's brand treatment, rather than in the Inter Tight uppercase label voice. Every other label in the bar — the four nav links — stays in the §7 UI voice.
  3. The bar is inset by a new `--nav-gutter` (`clamp(12px, 1.6vw, 26px)`) instead of the page gutter `--gutter` (`clamp(20px,5vw,60px)`), so it spans nearly the full display width with a small edge gap.
- **Reason**: Reviewed against the running site. The user's words: "assetly leasing (only assetly enough no leasing), the header, expand the length horizontal to use the laptop screen with little gap", and then, on seeing the Footer's brand block, "font in footer perfect, keep like that only for header assetly also."
- **Alternatives considered**: Keeping §10 verbatim — full "Assetly Leasing" wordmark, Inter Tight uppercase at 9–11px, aligned to the page gutter.
- **Why rejected**: §10's own closing principle is that the navbar is "supporting chrome — minimal, premium, editorial, financial, quiet, precise." Dropping the redundant suffix and letting the bar breathe the full width serves that principle better than the literal text did; the company name in full still appears in the Footer, so nothing is lost. The serif wordmark also makes the mark-plus-name read as one brand lockup in both places on the site rather than as two different treatments.
- **Consequences**: §10's "Typography" line now governs the nav **links** only, not the wordmark. `--nav-gutter` is a second horizontal inset token and is used by the navigation alone — sections continue to align to `--gutter`, so the bar deliberately over-runs the content measure. `BRAND.navWordmark` and `BRAND.footerWordmark` are separate constants because the two lockups now genuinely differ.
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
| DEC-014 | Phase 0 exits with Firebase deferred; SDK wired from env vars only | Active |
| DEC-015 | Self-host brand fonts via `next/font/local` if Google Fonts is unreachable | **Withdrawn** |
| DEC-016 | `FOUND-008` prototype archival closed as not applicable | Active |
| DEC-017 | Nav wordmark = serif "assetly"; bar wider than the page gutter | Active |
