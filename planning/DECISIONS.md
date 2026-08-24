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
  1. The nav wordmark is **"assetly"** alone. The "Leasing" suffix is dropped from the bar. The Footer keeps the full "assetly leasing" lockup per §17. *(Point 1 only is superseded by DEC-044; points 2 and 3 stand.)*
  2. The wordmark is set in **DM Serif Display (`--d`)**, matching the Footer's brand treatment, rather than in the Inter Tight uppercase label voice. Every other label in the bar — the four nav links — stays in the §7 UI voice.
  3. The bar is inset by a new `--nav-gutter` (`clamp(12px, 1.6vw, 26px)`) instead of the page gutter `--gutter` (`clamp(20px,5vw,60px)`), so it spans nearly the full display width with a small edge gap.
- **Reason**: Reviewed against the running site. The user's words: "assetly leasing (only assetly enough no leasing), the header, expand the length horizontal to use the laptop screen with little gap", and then, on seeing the Footer's brand block, "font in footer perfect, keep like that only for header assetly also."
- **Alternatives considered**: Keeping §10 verbatim — full "Assetly Leasing" wordmark, Inter Tight uppercase at 9–11px, aligned to the page gutter.
- **Why rejected**: §10's own closing principle is that the navbar is "supporting chrome — minimal, premium, editorial, financial, quiet, precise." Dropping the redundant suffix and letting the bar breathe the full width serves that principle better than the literal text did; the company name in full still appears in the Footer, so nothing is lost. The serif wordmark also makes the mark-plus-name read as one brand lockup in both places on the site rather than as two different treatments.
- **Consequences**: §10's "Typography" line now governs the nav **links** only, not the wordmark. `--nav-gutter` is a second horizontal inset token and is used by the navigation alone — sections continue to align to `--gutter`, so the bar deliberately over-runs the content measure. `BRAND.navWordmark` and `BRAND.footerWordmark` are separate constants because the two lockups now genuinely differ.
- **Status**: Active

---

### DEC-018 — Hero main line is "The lighter balance sheet.", superseding DEC-001's headline

- **Date**: 2026-08-20
- **Decision**: The Hero's main line is **"The lighter balance sheet."**, set across the two mask lines as "The *lighter*" / "balance sheet.", with `lighter` carrying the §7 italic-in-Moss emphasis. The subline is **unchanged** — it remains the "Access . Scale . Grow" tagline from DEC-001 and §5.
- **Reason**: Direct user instruction while reviewing the built Hero. This supersedes only the *main line* clause of DEC-001; every other part of that decision (the subline, and the rule that no additional paragraph follows it) still stands.
- **Alternatives considered**: DEC-001's line, "The lighter way to access what your business needs.", which was selected because `plan.md` was the newest planning document in the repository and explicitly locked that copy.
- **Why rejected**: DEC-001 resolved a conflict between planning documents in the absence of the user's own preference. That preference has now been stated directly, and a live instruction from the project owner outranks an inference drawn from document chronology. Worth noting that this line is the one the `home-2.html` prototype used, which DEC-001 had recorded as the rejected alternative — the prototype's headline is now the approved one.
- **Consequences**: `SOURCE_OF_TRUTH.md` §11's "Approved copy" block is updated. §11a point 7 describes the final Hero hierarchy as **A / proposition / ACCESS · SCALE · GROW**; that shape is unaffected, since only the proposition's wording changed. `content/site/hero.ts` holds the copy and `tests/unit/heroCopy.test.ts` asserts the segments still reassemble into exactly this sentence, so a careless edit fails rather than silently shipping different words.
- **Status**: Active

---

### DEC-019 — The Compare calculator carries no bars, magnitudes or value input; its mode row jumps rather than switches

- **Date**: 2026-08-20
- **Decision**: The calculator renders each argument as three labelled rows — Lease, Loan, Purchase — showing only the outcome text §13 supplies. It has no bar chart, no computed figures, and no asset-value slider. Its one control beyond the open/close tab is a row of the four argument indices, which reports the argument currently in focus (`aria-pressed`) and, on click, scrolls to that argument rather than setting the calculator's mode directly.
- **Reason**: Two separate constraints point the same way. First, `SOURCE_OF_TRUTH.md` §13 gives each argument a row of qualitative outcomes and says of the second one, pointedly, "No artificial percentage here" — a bar has a height, and there is no approved number to derive one from, so drawing one would mean inventing a business figure, which §24 forbids outright. Second, §13 makes scroll position the calculator's only input ("automatic and context-aware, tied to scroll position"); a control that set the mode itself would be a second source of truth that the next scroll frame would immediately overrule.
- **Alternatives considered**: (a) The prototype's instrument as `DESIGN_SYSTEM.md` §8 documents it — a three-column bar chart with heights driven by mode data, plus a `<input type="range">` asset-value control and a computed readout. (b) Mode buttons that set the active reading directly, per DESIGN_SYSTEM's `data-m` switches.
- **Why rejected**: (a) would require rate assumptions, residual assumptions and a lease-versus-loan model that no supplied Assetly material contains — the prototype's numbers were illustrative placeholders, and shipping placeholders as a financial comparison on a live B2B site is exactly the fabrication the baseline prohibits. If real figures are supplied later this can be revisited as a new decision. (b) fights the scroll-driven model rather than serving it; jumping to the argument instead keeps one input and, as a side effect, gives keyboard visitors a way to reach the other three readings that scrolling alone did not (§20's `aria-pressed` requirement is satisfied either way).
- **Consequences**: The Lease row carries the Bottle accent as editorial emphasis on the argument being made, which is explicitly not a claim about magnitude. `OD-13` is opened in `SOURCE_OF_TRUTH.md` §25 for whether the section needs a disclaimer line, since the approved copy states tax outcomes as fact and no wording may be invented. `DESIGN_SYSTEM.md` §8 remains the reference for the drawer's *mechanism* — the scroll-scrubbed openness model, the manual override, the content reflow — all of which are implemented as it describes.
- **Status**: Active

---

### DEC-020 — `--nav-block` is what sections clear, not `--nav-h`

- **Date**: 2026-08-20
- **Decision**: `styles/tokens.css` gains `--nav-pad` (the inset between the bar and the edge of the screen) and `--nav-block: calc(var(--nav-h) + 2 * var(--nav-pad))`. Everything that clears the fixed navigation — the anchor `scroll-margin-top` in `globals.css`, the Hero's top padding, the mobile overlay's — now uses `--nav-block`. `--nav-h` continues to mean the bar's own height and is used by the bar itself.
- **Reason**: A real defect, found while building Compare. `--nav-h` is `clamp(56px, 7vh, 74px)`, but the header renders that plus its own `10px` inset above and below, so the fixed navigation occupies 20px more than any section reserved for it. A section scrolled to from a nav link had its top 20px covered by the bar — precisely what the comment on `--nav-h` in `styles/tokens.css` says the token exists to prevent.
- **Alternatives considered**: Adding the 20px into the `scroll-margin-top` calculation directly; enlarging `--nav-h` to include the inset.
- **Why rejected**: A literal `calc(var(--nav-h) + 20px)` restates a number that lives in `Nav.module.css` and would drift the moment the inset changed. Folding the inset into `--nav-h` would break the bar's own `min-height`, which correctly refers to the bar and not the header around it. Two tokens with one derived from the other keeps each name meaning one thing.
- **Consequences**: `tests/e2e/shell.spec.ts`'s "the fixed nav never covers the top of a scrolled-to section" now passes because the site is correct, rather than because the assertion caught a frame mid-scroll — which is how it had been passing. Phase 8.5 should note that the loader's "A" settle target is measured against the Hero's padding, which moved by 20px with this change.
- **Status**: Active

---

### DEC-021 — Archive the prototype HTML files that appeared after Phase 0

- **Date**: 2026-08-20
- **Decision**: `assests/home-2.html` and `assests/2-duty-cycle.html` are archived as `reference/home-2.html` and `reference/2-duty-cycle.html`. They remain non-build visual and motion references.
- **Reason**: DEC-016 closed the archival task because no HTML files existed at that time. The two original prototypes later appeared untracked, and `home-2.html` became the approved source for the corrected Compare plate language.
- **Consequences**: DEC-016's historical finding remains intact but its "nothing to archive" consequence is superseded. No prototype copy, business facts, or runtime code enters the Next.js application merely because the files are retained.
- **Status**: Active; supersedes DEC-016

---

### DEC-022 — Compare plates use the archived prototype's compact drafting language

- **Date**: 2026-08-20
- **Decision**: The Compare plate set uses a common 200×130 viewBox. Upfront Cash adapts `home-2.html`'s building/capital drawing, Obsolescence adapts its asset/lifecycle drawing, and Leverage adapts its balance-scale drawing. Tax Treatment had no source plate and is authored as an uneven ledger resolving into one recurring line in the same thin-stroke vocabulary.
- **Reason**: Direct project-owner instruction to replace the initial interpreted plates with the drawings used in the same narrative position in `home-2.html`, generating only the missing plate in that style.
- **Consequences**: `OD-03` is resolved and removed from `SOURCE_OF_TRUTH.md` §25. The generic `Plate` component and draw behavior remain unchanged.
- **Status**: Active

---

### DEC-023 — Compare uses qualitative tier bars, without prototype calculator math

- **Date**: 2026-08-20
- **Decision**: The calculator is one persistent three-column graph. Its fills transition between visual `low` / `mid` / `high` tiers mapped to 30% / 60% / 92%, while the approved qualitative outcomes stay visible. Fills are uniformly 44px wide on desktop and 28px on mobile. The prototype's coefficients, asset-value slider, currency calculations, and computed outputs remain excluded; the mode row still scrolls to the corresponding argument.
- **Reason**: The project owner requested a visible transitioning graph but explicitly limited `home-2.html` derivation to the plates. Qualitative tiers express the approved ordering without presenting invented figures as business data.
- **Consequences**: This supersedes only DEC-019's no-bars clause. DEC-019's no-magnitudes/no-value-input rule and single scroll source of truth stay active. Reduced motion snaps fills directly to their destination tier.
- **Status**: Active; supersedes DEC-019 in part

---

### DEC-024 — Why Assetly exposes only the active face to screen readers

- **Date**: 2026-08-20
- **Decision**: Each Why Assetly card is a native button whose value name and `aria-pressed` state remain available at all times. Both visual 3D faces are hidden from the accessibility tree. The front state has a concise activation hint; the approved explanation is mounted as the button's polite description only while flipped and is removed again on return.
- **Reason**: This gives assistive-technology users the same state-dependent information as sighted users without double-announcing the front and back or exposing visually hidden back copy before activation.
- **Consequences**: Click, tap, Enter, and Space all use native button behavior. Multiple cards may remain open independently, while every card exposes exactly one current description.
- **Status**: Active

---

### DEC-025 — Sector artwork and reduced motion remain code-native and static

- **Date**: 2026-08-20
- **Decision**: The six Sectors plates are distinct 200×130 inline geometries authored in the established thin-stroke drafting language. The grid rotates one slot at a time on the approved 2.5-second cadence, pauses on hover/focus/document hiding, and exposes no live announcements. Under reduced motion, it renders sectors 01–04 and fully drawn plates without starting the rotation timer.
- **Reason**: The approved sector directions are specific enough to produce meaningful artwork without an external asset, while a completely static reduced-motion state satisfies the site's rule that continuous motion must stop rather than merely accelerate.
- **Consequences**: `OD-04` is resolved. The generic `Plate` and `useDrawOnEnter` primitives remain unchanged, and each entering sector remounts only its artwork so the plate draws once.
- **Status**: Active

---

### DEC-026 — Bengaluru context is an illustrative code-authored plate

- **Date**: 2026-08-20
- **Decision**: The Contact section uses an illustrative, non-cartographic inline SVG authored with the existing `Plate` primitive. Muted road/network linework, a BENGALURU label, and one Assetly marker create location context without external map data, street names, exact coordinates, or a third-party embed.
- **Reason**: The approved visual direction calls for restrained Bengaluru context, not navigation or geographic precision. Code-native geometry matches the site's drafting language, avoids introducing an unapproved map-data source, and remains fully controllable under reduced motion.
- **Consequences**: `OD-08` is resolved. The artwork is decorative, immediately complete under reduced motion, and no map provider, attribution layer, or location tracking enters the application.
- **Status**: Active

---

### DEC-027 — About may use an explicit temporary media slot during development

- **Date**: 2026-08-20
- **Decision**: Phase 8 may implement and commit the complete About route with a clearly labelled, non-image media placeholder. The placeholder is hidden from the accessibility tree and receives no fabricated alt text. The real photograph remains mandatory before Phase 10 exits or production deployment.
- **Reason**: Direct project-owner instruction to keep an image placeholder and continue. This supersedes only `OD-14`'s earlier prohibition on beginning or committing the About layout before the asset arrives; it does not approve any substitute photograph or resolve the asset requirement.
- **Consequences**: About copy, metadata, responsive composition, shell navigation, and reduced-motion behavior can be completed now. `OD-14` stays open and moves to `QA-000`; its eventual asset must still be genuine, rights-cleared, at least 1600px wide, rendered with `next/image`, and accompanied by the supplied factual alt description.
- **Status**: Active

---

### DEC-028 — Section blocks are sized against viewport height, not viewport width

- **Date**: 2026-08-20
- **Decision**: Grid cells and paired section columns cap their height with a `vh`-based clamp rather than a `vw`-based one. Why Assetly and Sectors share one cell height; Contact's info column and map shell share one min-height. The Sectors card is additionally recomposed horizontally below 640px — small plate beside the sector name, index above it — and its plate is sized from the card's height.
- **Reason**: Keyed to viewport *width*, the cells reached 356–390px, so each 2x2 grid stood 712–780px tall beneath a 150px heading and was never seen whole on a 900px screen. For Sectors that is not only a proportion problem: §15's one-out-one-in rotation is only legible if the four cards it cycles are simultaneously in view, and on mobile a 285px stacked card put two of the four off-screen permanently. The same oversizing left `space-between` distributing ~120px of empty space inside every card.
- **Consequences**: Both grids now fit within one screen at 1440x900, all four sector cards fit a 390x844 phone, and the voids close. Playwright asserts the fit at both sizes, and asserts that no Why Assetly back face is clipped — `.face` is `overflow: hidden`, so a card too short for its copy truncates it silently. §15's stated composition is unchanged; only the card's internal arrangement below 640px differs, which §15 leaves to implementation.
- **Status**: Active

---

### DEC-029 — Sector rotation changes a card every 1.2 seconds

- **Date**: 2026-08-20
- **Decision**: The one-out-one-in rotation interval is 1.2s, superseding §15's stated 2.5s. The swap itself stays at §15's 450ms fade with `translateY(10px)`. §15 is amended to match.
- **Reason**: Project-owner instruction. The slower cadence read as static on a grid the visitor sees for only a few seconds.
- **Consequences**: The interval is the cadence of the grid, not of any one card: with four slots, each individual card still holds for 4.8s, so its plate completes the 2.6s draw before that slot comes round again. The Playwright rotation test was rewritten to sample consecutive states and assert that no more than one slot ever changes between them — at 1.2s a single before/after snapshot around one swap is a race, and would have failed for timing rather than for behaviour.
- **Status**: Active

---

### DEC-030 — The map pin and its label are both anchored to the viewBox centre

- **Date**: 2026-08-20
- **Decision**: The Contact map's pin geometry sits at the exact centre of its 800x520 viewBox, and the HTML "ASSETLY" label is positioned from the container's centre. The per-breakpoint marker offset is deleted.
- **Reason**: The map is drawn `xMidYMid slice`, so cropping moves the drawn artwork as the container's aspect ratio changes while a percentage-positioned HTML label stays put. The two drifted apart — at 1440x900 the label already sat over the pin's ring — and the existing mobile override was a hard-coded patch for that drift, not a fix. Under `xMidYMid`, the viewBox centre is the one point that maps to the same place at every aspect ratio.
- **Consequences**: The label and pin cannot separate at any window size, and no breakpoint-specific marker positions are needed. Playwright checks the two coincide at three aspect ratios.
- **Status**: Active

---

### DEC-031 — The Hero opening is document-scoped and holds after a continuous double blink

- **Date**: 2026-08-20
- **Decision**: The opening plays on every full document load of `/`, never on `/about`, and never when client-side navigation returns to `/` within an already-loaded document. A module-scope flag records completion without storage. The two opacity dips use one continuous 1.7s eased curve with a short breath between them. Recede runs for 650ms, settle for 850ms, the landed mark holds completely still for 320ms, and the overlay clears over 420ms without starting another mark transition.
- **Reason**: The project owner fixed the replay rule, then approved the branch preview and asked for the whole sequence to feel smoother and slightly quicker. The earlier pause read as a stoppage, and any movement after the mark sat down made the hand-off feel abrupt.
- **Consequences**: This supersedes §11a point 4's approximate per-blink timing but retains its exact two dips, 20–30% dim floor, static tagline and calm character. The mark is one persistent DOM node through opening and Hero, and the old Phase 2 mark entrance is suppressed after the loader so the landed position remains stable. Reduced motion still skips blink, recede and settle entirely.
- **Status**: Active

---

### DEC-032 - Why Assetly and Sectors are composed to resolve inside one viewport

- **Date**: 2026-08-20
- **Decision**: Both sections are sized against the viewport rather than padded by the page's standard rhythm: `min-height: 100svh`, contents centred in the space below the fixed nav, reduced heading and card metrics, and a mobile Why Assetly card recomposed horizontally - the letter beside the value name, as the mobile sector card already works.
- **Reason**: DEC-028 capped the grids against viewport height but left `--section-pad` above and below them, so each section still stood ~965px inside a 900px window and neither was ever seen whole. The mobile Why Assetly card was worse: four 274px cards ran to ~1100px, so one card filled the phone and the section read as a list of cards rather than as a section.
- **Consequences**: At 1440x900, 1280x800, 1024x768, 430x932 and 390x844 each section is exactly one viewport tall. `min-height` is a floor, so a window too short for the composition grows the section instead of centring content out of reach - at 375x667 Why Assetly is 819px and scrolls, which is correct. Card heights were re-measured against the longest back face (S, which names six sectors) at every size; the flip card cannot grow to fit its copy, because both faces are absolutely positioned inside a cell of fixed height.
- **Status**: Active

---

### DEC-033 - The Contact map is real OpenStreetMap geography, baked to static paths

- **Date**: 2026-08-20
- **Decision**: The Bengaluru map is generated from OpenStreetMap data for a 6 x 3.9 km window centred on the office's position on Brigade Road, projected and simplified into static path data in `content/plates/bengaluru-map.ts`, and drawn by the existing `Plate` component in five weighted layers. The ODbL credit is rendered beside the map, and the Assetly marker links to the same coordinates on a real map. This supersedes DEC-026's invented road network.
- **Reason**: The owner's review was that the drawing was aesthetically consistent but not geographically convincing - it was recognisably nowhere. §16 rules out a third-party embed and the default-Google-Maps look, not real geography. Baking the geometry at authoring time satisfies both: the city reads as itself, and the page still ships no map SDK, no tile requests and no API key.
- **Consequences**: `content/plates/bengaluru-map.ts` is generated and must not be hand-edited - an edit would make it geographically wrong, which is the one thing it exists to prevent. Regenerate it from Overpass to move the window or refresh the data. The credit is a licence obligation, not decoration, and must survive any redesign of the section. §16's "map artwork" paragraph is amended accordingly.
- **Status**: Active

---

### DEC-034 - The Compare focus effect holds a locked band before it transitions

- **Date**: 2026-08-20
- **Decision**: A slide keeps its resting appearance - opacity 1, no blur, no shift - across a band around the viewport centre (0.26 viewport heights on desktop, 0.34 on mobile) and only then begins the existing fade, blur and displacement, reaching full effect by 0.86. The focused index is sticky: a rival slide must be closer by 0.08 viewport heights to take the calculator's mode from the current one.
- **Reason**: Read literally, §13's "aligned at rest" is a single point, so a slide lost sharpness to any movement at all. On a phone that is most of the time - a thumb never parks a slide on one exact pixel - so the copy the reader was reading lived in a partial blur. The section is meant to read as four settled arguments, and a continuously-derived curve never settles.
- **Consequences**: §13's focus description is amended: the effect is unchanged in kind, only in when it starts. Measured on screen, a slide is completely sharp through ~260px of scroll at 1440x900 and ~290px at 390x844 before anything begins. Mode sync still follows the reader in both directions; the hysteresis only stops it oscillating at a boundary. Reduced motion is untouched - no appearance is written at all under it.
- **Status**: Active

---

### DEC-035 - Compare Slide 01's left half is the reference hero crane, mirrored

- **Date**: 2026-08-20
- **Decision**: The left half of the Upfront Cash plate is the wheeled crane from `reference/home-2.html`'s hero plate, mirrored about its own bounding box and scaled 0.2 onto the plate's ground line. The right half - the floored block and the rayed circle - is the reference argument plate's own geometry, unchanged.
- **Reason**: The owner's review was that the left half of the plate was wrong and should come from the canonical reference rather than be redrawn, with the hanging boom ending up on the opposite side from where the source puts it. Mirrored, the boom hangs outward rather than over the capital reserve.
- **Consequences**: §13's plate note for Slide 01 - "retained capital, small portion accessed while a larger reserve stays intact" - now reads as an asset put to work beside a reserve that stays intact. Both halves are reference geometry under a documented transform (x' = 127.4 - 0.2x, y' = 62.8 + 0.2y), so the drawing can be re-derived rather than guessed at. The sector Construction plate deliberately uses a tracked excavator so the two machines do not read as the same drawing twice.
- **Status**: Active

---

### DEC-036 - Nothing that holds a parked panel may be a scroll container

- **Date**: 2026-08-20
- **Decision**: `.mapShell` uses `overflow: clip` rather than `hidden`, the focus trap focuses with `preventScroll: true` on both entry and restoration, and the document reserves its scrollbar gutter permanently (`scrollbar-gutter: stable`).
- **Reason**: The desktop contact drawer appeared to shove the whole composition sideways and then correct itself. The animation was not the cause: `overflow: hidden` made the map shell a scroll container, the drawer starts parked outside it, and focusing a control inside the drawer made the browser scroll the shell to reach it - moving the map, the label and the pin, then letting them drift back. Separately, locking body scroll for a modal removes the scrollbar on a platform with classic scrollbars, which widens the layout viewport and jogs every fixed and centred element on the page.
- **Consequences**: The drawer now travels monotonically from the shell's right edge to its resting position with the map stationary throughout, verified frame by frame. `clip` cannot be scrolled by anything - focus, find-in-page or script - so the class of bug is closed rather than patched. The reserved gutter costs a permanent ~15px on platforms that draw classic scrollbars, which is the price of both modals opening without moving the page.
- **Status**: Active

---

### DEC-037 - The reference crane belongs to the Hero plate, not to Compare Slide 01

- **Date**: 2026-08-21
- **Decision**: Compare Slide 01 keeps its original plate. The reference's wheeled crane, mirrored about its own bounding box, moves to the Hero plate as its ACCE§ element, working over a floored building placed at the far left where a bare vertical drawing edge used to be. This supersedes DEC-035.
- **Reason**: DEC-035 read the owner's "recover the hanging crane and mirror it" as an instruction about Slide 01, because that was the plate under review at the time. It was an instruction about the drawing, not about the slide: the crane came from the reference's *hero* plate and belongs in ours. Slide 01's original plate was never the thing that was wrong. Separately, the left drawing edge was a bare vertical line carrying no meaning, and the lower left of the plate was empty under the boom - one building answers both.
- **Consequences**: §13's Slide 01 plate note returns to "retained capital"; §11's hero plate paragraph now names a crane and a building rather than an abstract open frame, which suits §11's own "asset/equipment form" better than the frame did. Both figures are reference geometry under transforms recorded in the file (`x' = 660 - 0.95x`, `y' = 297.8 + 0.95y` for the crane; the building keeps the reference's floor spacing and gains a storey rather than being stretched). The Scale curve now leaves the crane's deck instead of the old frame's flank, and is shorter for it. `OD-02` stays open: the plate is still authored rather than designer-reviewed.
- **Status**: Active

---

### DEC-038 - Hovering a sector card holds that card, not the grid

- **Date**: 2026-08-21
- **Decision**: Pointer hover no longer pauses the Sectors rotation. The hovered slot is passed over when its turn comes and the tick spends itself on the next slot instead, so the other three cards keep changing on the same 1.2s cadence. Keyboard focus continues to pause the whole grid. The plate-opacity lift moves from the grid to the card.
- **Reason**: The owner's review was that the rotation should not stop because the pointer happens to be over the section - only the card actually being read should stay put. Pausing the whole grid on hover also meant that on desktop, where the pointer often rests inside the section, the rotation the section exists to show was frequently not running at all.
- **Consequences**: §15's "Desktop hover: pauses rotation" is amended. Keyboard focus is now the only full pause, which is what the section owes an auto-updating region and what the grid's own label already promises; that behaviour and its label are load-bearing and must not be removed with it. A held slot defers its queued sector by one slot rather than dropping it, so the cycle still shows all six. Because the lift now marks one card, it says "this card is held" rather than "the grid has stopped", which is the truth.
- **Status**: Active

---

### DEC-039 - The opening blink is slower and runs on a near-sine curve

- **Date**: 2026-08-21
- **Decision**: The double blink runs for 2.4s rather than 1.7s, on `cubic-bezier(0.45, 0.05, 0.55, 0.95)` rather than `--eio`. The shape is unchanged: two dips to 25%, a breath between them, the tagline static throughout. This amends DEC-031's duration and easing only.
- **Reason**: The owner asked for the blink alone to be slower and smoother, everything else in the opening being right. Two things made it read as a switch rather than an eye: `--eio` is a toggle/drawer curve that spends most of a segment moving fast, and at 1.7s each blink lasted about 610ms - below the 0.8-1.0s §11a itself asks for. At 2.4s each blink is about 910ms, back inside that range.
- **Consequences**: `HERO_LOADER_DURATIONS.signature` and the C§ animation duration must stay equal; they are the same number in two places by necessity, and a change to one is a bug without the other. The whole opening lengthens from about 4.1s to about 4.8s, which every Playwright spec that loads `/` now waits through. Reduced motion is unaffected - it never plays the blink.
- **Status**: Active

---

### DEC-040 - The Hero plate frames the copy and uses a combined phone composition

- **Date**: 2026-08-21
- **Decision**: The Hero copy and loader landing position remain fixed. At widths above 640px, Access occupies the lower-left and sits on one full-width ground datum, the Scale path leaves the crane's deck and travels beneath a protected central copy zone, and Grow rises at the right. The plate settles at 20% opacity; while drawing, its stroke begins in Pitch and resolves to Olive. At 640px and below the production mode is `both`: Access sits below-left, Grow is enlarged at the far right, both meet one full-width datum, and the Scale connector is omitted. The phone plate is fixed after drawing, with no cursor parallax or ambient drift. Typed `hidden`, `access`, and `growth` alternatives remain available through the same constant. Viewports 520px high or less always hide the plate.
- **Reason**: The full centred plate crossed the proposition and became increasingly illegible as the viewport narrowed. After reviewing the prepared phone variants, the owner selected a quieter combined composition with the two meaningful endpoints separated across the frame, a simple shared baseline, and no pointer-following motion.
- **Consequences**: This supersedes §11's previous ~16% opacity, its requirement that the complete connected plate scale down to 320px, and the earlier preview choice to ship phones hidden. `HERO_PLATE_MOBILE_OPTIONS.md` is the activation guide. Structural junction nodes breathe only above the phone breakpoint; wheels and fixed architecture do not move. `OD-02` remains open because the code-authored artwork still has no formal design approval.
- **Status**: Active

---

### DEC-041 - Sectors composes against a height budget, not a cell minimum

- **Date**: 2026-08-21
- **Decision**: On desktop the section is a defined composition area: the nav is cleared, one gap above and one below are declared, the header takes what it needs, and the grid claims everything that is left. `.cell`'s `min-height` drops from `clamp(202px, 27vh, 262px)` to `clamp(164px, 21vh, 214px)` and becomes a floor for windows too short for the composition rather than the thing deciding the grid's height. The section passes its own classes to the shared `Container` and `RevealOnScroll` so the height reaches the grid through them. Mobile keeps its existing centred composition and fixed cells unchanged.
- **Reason**: DEC-032 made the section measure exactly one viewport, which it did - but the grid asked for a height of its own and the leftover was centred, so on short laptop ratios a dead band sat under the second row while the row above it was tighter than it needed to be. The section fitted without resolving: nothing was clipped, yet the composition did not use the screen it had claimed.
- **Consequences**: At 1440x900 / 1280x800 / 1024x768 the second row's bottom border now lands on the section's bottom padding - 871/900, 774/800, 743/768 - and cells grow from 297/267/243px to 328/287/277px. Because the grid takes the leftover height, a change to the heading's type or the section's padding moves straight into the cells rather than into a gap. `.cell`'s minimum is now a floor: a window too short for the composition grows the section instead of clipping it, which is the same rule DEC-032 relies on. Mobile is measurably unchanged - same cell heights, same centring, same padding.
- **Status**: Active

---

### DEC-042 - The focus lock is half a screen, so no resting position is blank

- **Date**: 2026-08-21
- **Decision**: The locked band widens to 0.5 viewport heights on both desktop and mobile. The transition is otherwise unchanged - `FOCUS_FULL` stays 0.86, `FOCUS_SWITCH_MARGIN` stays 0.08. The slide becomes exactly one screen on desktop (`100svh`, from `104svh`), and the mobile foot reserves the sheet's own height plus one small gap through a shared `--compare-sheet-h`. No scroll snapping. Amends DEC-034, which stands in principle.
- **Reason**: Slides are one screen tall, so the two nearest a reader always sit at distances summing to 1 and the nearer is never further than 0.5 away. A band of 0.5 is therefore exactly the band that leaves some argument settled at every scroll position there is. That property is the requirement: a reader stops where they stop, and with a narrower band, stopping between two arguments left both faded and blurred and neither readable - a state the section has no meaning in and one a reader can sit in indefinitely. Measured before the change, four of eight resting positions inside the section had no fully sharp argument; after, none.
- **Consequences**: §13's effect is intact - settle on an argument and its neighbour a screen away is still at 0.28 opacity and blurred - but the fade can no longer be rested inside. `FOCUS_LOCK_MOBILE` and `FOCUS_LOCK_DESKTOP` now hold the same value, because 0.5 is the widest band that means anything and a phone cannot be given a better guarantee than a laptop; they stay separate exports because they are separate decisions that presently agree. Every slide is exactly one viewport at all six checked sizes, and the mobile foot exceeds the sheet by 14-20px rather than 93. The sheet's height and the slide's reserve are one declaration and cannot drift apart again.
- **Rejected**: C§ scroll snapping, in both strengths, on measurement. `mandatory` is unusable here: with targets a full screen apart, any gesture shorter than half a screen is undone and returned to where it started - the page did not advance past the first argument in thirty-four consecutive wheel gestures - and past the last argument there is no target ahead, so the section would not release the reader at all. Giving the following section a target only moves that trap one section down. `proximity` does not trap, but it does not deliver the guarantee either, and it collided with something already true of this page: §10's `[id] { scroll-margin-top: var(--nav-block) }`, which exists so anchor links clear the fixed nav, enlarges an id'd element's snap area at the top, so centring that area put the section half a nav-height low and left the calculator at 0.952 openness where the first argument is read. Snapping is not the mechanism this needs; the band is.
- **Status**: Active

---

### DEC-043 - The Hero main line declares its own size, clears its descender, and hangs its full stop

- **Date**: 2026-08-24
- **Decision**: `.headline` in `Hero.module.css` declares `font-size: clamp(31px, min(6.4vw, 10.5svh), 76px)` - §11's own display step, with a viewport-height term added. The line-mask wrapper gains `padding-bottom: 0.26em` with an equal negative margin, and the pre-reveal travel grows from `translateY(105%)` to `130%` to stay behind the taller clip box. The line the sentence ends on takes `padding-left: 0.295em`, the measured advance of DM Serif Display's full stop.
- **Reason**: Three faults in the most visible element on the site, all reported by the project owner. The h1 had never carried a size at all - §11 specified `clamp(31px,6.4vw,76px)` and `SerifHeading`'s `.display` step still carries it, but the Hero authors its mask lines inline and so fell through to the browser default: 1.5em of a `clamp(15px, 1.15vw, 17px)` body inside a `<section>`, about 25px where 76px was specified. The mask sat exactly on a line-height of 1.06 while the italic "g" in *lighter* drops 0.237em of ink below the baseline, so the descender was cut off. And centred text counts a full stop's whole advance, so the letters of "balance sheet." rested 0.15em left of the true centre while the mark, the first line and the tagline sat on it - which reads as the tagline sitting right of the heading, which is how it was reported.
- **Consequences**: The headline now renders 31px at 320px wide through to 76px at 1280px and above. The `svh` term is DEC-028's rule applied to type: without it a 1024x768 or landscape-phone frame asks for 65px of headline above a 104px mark inside one `100svh` section and the stack does not resolve; measured, the content stack now fits at 320x568, 390x844, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080 and 900x450 with no clipping and no horizontal overflow. The descender clears its mask at every one of those sizes. The tagline sits 0.01px off the letter mass of "balance sheet." where it sat 11.2px right of it. Both typographic corrections are expressed in `em` against named custom properties, so they hold at every step of the clamp. DEC-018 locks the copy at two lines with the stop on the last, which is what makes `:last-of-type` the line that ends the sentence.
- **Status**: Active

---

### DEC-044 - The home button carries the full "assetly leasing" lockup

- **Date**: 2026-08-24
- **Decision**: `BRAND.navWordmark` becomes `"assetly leasing"`, matching `BRAND.footerWordmark`. Nothing else about the bar changes - the serif treatment, the `--nav-gutter` inset and the Inter Tight link voice all stand. Supersedes point 1 of DEC-017 only.
- **Reason**: Owner review, `docs/WEBSITE NOTES.docx`: "Home button: logo + 'assetly leasing'". DEC-017 dropped the suffix on the reasoning that the bar should stay quiet chrome and the full name still appeared in the Footer; the owner has since decided the home button should name the company outright.
- **Consequences**: Measured across 320-1440px, the longer wordmark costs the bar nothing: at 701px, the tightest point where the four links are still shown, 228px of clearance remains between the wordmark and the link group, and no width overflows. The two `BRAND` constants now hold the same string but stay separate, because they remain separate decisions that presently agree - the same reasoning DEC-042 records for the two focus-lock constants. Test locators for the banner brand link move to the exact name `"assetly leasing"`, which is why the Footer's assertion has always been scoped to `contentinfo`: the two lockups are no longer distinguishable by name alone.
- **Status**: Active

---

### DEC-045 - Compare reads Ownership Risk, Tax, Leverage, Upfront Cash - renumbered 01 to 04

- **Date**: 2026-08-24
- **Decision**: The four arguments reorder to Ownership Risk, Tax Treatment, Leverage Impact, Upfront Cash - §13's second, third, fourth and first. The indices a visitor sees are renumbered sequentially in that order, so the section still reads 01, 02, 03, 04 down the page and across the mode row. Each argument keeps its own plate, headline, copy and readings; only the order and the numbers change. The original numbering survives in documentation, where it is how the owner's notes address each slide.
- **Reason**: Owner review, `docs/WEBSITE NOTES.docx`: "Change 01, 02, 03 & 04 to 02, 03, 04 & 01 (Use of asset, Tax, Leverage, Preserve capital)." The argument the section opens on is now the one about using an asset rather than owning it, and preserving capital closes it.
- **Alternatives considered**: Carrying the old numbers along with the slides, so the page would read 02, 03, 04, 01. Put to the owner directly and rejected: the number a visitor sees should be the position they are at, not a record of where the argument used to sit.
- **Consequences**: `COMPARE_SLIDES` is index-addressed by the scroll-focus loop and the mode row, so array order *is* reading order - no other mechanism needed changing. Slide ids are untouched, so every `#compare-slide-*` anchor still resolves and no link breaks. `compare.spec.ts` addresses slides by index through `centreSlide`, so its fixture and five spot assertions moved with the order; that fixture is the thing to update first if the order is ever revisited.
- **Status**: Active

---

### DEC-046 - Slide 01 is titled Ownership Risk, and the tax argument drops two claims

- **Date**: 2026-08-24
- **Decision**: Two copy changes on separate slides. The obsolescence argument swaps its title and its metric: it is now titled **Ownership Risk** and its metric reads **"Risk of obsolescence - lower is lighter"**, where it was titled "Risk of Obsolescence" over a "Customer ownership risk" metric. And the Tax Treatment copy becomes **"Full rentals allowable as deduction; GST input credit continues to apply."**, withdrawing §13's depreciation block-rate limits and 180-day usage restriction. The headline "Use the asset. Not the ownership risk." stays exactly as it is - the notes asked whether it could be rewritten, two rewrites were offered, and the owner kept the original.
- **Reason**: Owner review, `docs/WEBSITE NOTES.docx`, which sets both slides out as a before and after. The tax change is the substantive one: the block-rate and 180-day claims are specific statements about Indian tax law, and the owner has chosen not to make them on the site.
- **Consequences**: The title is what the calculator announces through its polite live region and what the mode row reports, so the swap changes what a screen reader hears at that slide. Withdrawing the two tax claims narrows what the site asserts and cannot be undone by an edit here - reinstating them needs a further decision, which is why `content/compare/slides.ts` says so at the top. The copy-integrity tests carry both new strings verbatim.
- **Status**: Active

---

### DEC-047 - The graph's three columns carry three tones, stepped in lightness

- **Date**: 2026-08-24
- **Decision**: Each column gets its own tone rather than sharing Olive: Lease **Bottle `#25453A`**, Loan **Moss `#5C5C46`**, Purchase **Khaki `#B1AD77`** with a hairline edge. The tone is written from `data-column`, taken from the column's own label. The separate `[data-lead="true"] .fill` rule is removed - Lease holds Bottle by column now, and the two rules said the same thing twice. The lead column's label and reading keep their Bottle.
- **Reason**: Owner review: "Colours on the right pane - choose something with more of a contrast." Bottle and Olive differ by about 3% in lightness, so the three columns read as one block of dark. Asked which contrast to raise, the owner chose a stepped ramp and asked that it "subtly highlight the one we are trying to show the customer".
- **Alternatives considered**: Moving the whole panel onto Pitch; and alternating light and dark across the three columns so no two neighbours resemble each other.
- **Why rejected**: A Pitch panel would be a third dark surface, where §6 admits exactly two - the scrolled nav and the Footer - and that is a larger decision than a contrast complaint warrants. Alternating tones separate the columns most loudly but make the middle column read lightest whatever its value, which fights the graph rather than helping it. The stepped ramp keeps Lease deepest, which is the emphasis §13 already reserves for it, and lets the two options it is compared with recede in order.
- **Consequences**: All three are approved §6 tokens; no colour is invented and the panel stays on Field. Khaki carries about 1.8:1 against Field, so the Purchase bar takes a hairline edge - without it the tallest bar on the panel reads as an empty track. The bars are `aria-hidden` and the reading beneath each one carries the information, so no meaning depends on telling the tones apart.
- **Status**: Active

---

### DEC-048 - A fourth `minimal` tier, used by Upfront Cash's Lease reading

- **Date**: 2026-08-24
- **Decision**: `CalculatorTier` gains a `minimal` step at 16%, below `low`'s 30%. The Upfront Cash slide's Lease column uses it. The Lease bars on Ownership Risk and Leverage Impact stay at `low`. Amends DEC-023's three-tier set.
- **Reason**: Owner review, under the Preserve capital slide: "Decrease the height of the Lease bar in the bar chart." Against "100% upfront" at 92%, a Lease bar at 30% overstates what a lease asks for at signing.
- **Alternatives considered**: Lowering the shared `low` tier from 30% to 16% for every slide. Put to the owner and rejected - the note is about one slide, and "Assetly bears it" and "Minimal" are lighter than their alternatives without being close to nothing.
- **Consequences**: The tier set is still qualitative and still asserts no magnitude, which is what DEC-023 and §13 require; a fourth presentation category does not make it arithmetic. Because tiers are shared across slides, a tier is now the right place to express "close to nothing at all" rather than something to be re-tuned per slide.
- **Status**: Active

---

### DEC-049 - The published contact identity is finance@assetly.lease and +91 81231 96924

- **Date**: 2026-08-24
- **Decision**: The site's email becomes `finance@assetly.lease` and its phone `+91 81231 96924`, replacing `sankar@assetly.lease` and `+91 96204 71985` in the Contact section, the Footer, the About page and every enquiry draft. `CONTACT_RECIPIENT` in `buildEmailDraft.ts` is derived from `CONTACT.email` rather than written out a second time.
- **Reason**: Owner review, `docs/WEBSITE NOTES.docx`, which gives both under "Contact:" and repeats the address under "About:". §16 had described the old pair as coming from the Assetly visiting card; the published details are a role address and a different line.
- **Consequences**: A role address rather than a person's is what the site can keep showing as people change, which is the point of the change. The second literal in `buildEmailDraft.ts` was a real hazard while it lasted - the site could display one enquiry address and draft to another - and deriving it means the address is now written once. §16, §17, §25 and `MASTER_PLAN.md`'s Phase 4 task 8 carry the new pair.
- **Status**: Active

---

### DEC-050 - About uses the owner's four-paragraph company and leadership statement

- **Date**: 2026-08-24
- **Decision**: The About page's single short body is replaced by four owner-supplied paragraphs, kept verbatim and in order: Assetly's leasing model and asset categories; fixed rentals instead of a large upfront purchase; the resulting capital and budgeting benefits; and the supplied leadership statement. `ABOUT_CONTENT.body` becomes a typed `paragraphs` array. The longer copy gets the larger side of a `2fr / 3fr` desktop grid, with the temporary media slot supporting it; mobile continues to place media above copy. Assetly's LinkedIn page joins Bengaluru and the finance address in the existing hairline-ruled closing row, using the email link's quiet underline treatment rather than a new social badge.
- **Reason**: Owner review, `docs/WEBSITE NOTES.docx`, supplied the four paragraphs and LinkedIn URL. The prior §4 constraint was written when no leadership or company-character material had been supplied; that premise is no longer true. The old media-heavy proportion was also sized for one paragraph and left the approved copy cramped.
- **Alternatives considered**: Summarising the four paragraphs back into the old single-body shape; keeping the media at 55–65% and reducing the type until the copy fit; adding a separate leadership section or social component.
- **Why rejected**: Summarising would alter owner-approved copy. Shrinking four paragraphs into the old narrow column would weaken readability. A new leadership section or social surface would over-build the deliberately simple route and spend more visual emphasis than the material needs.
- **Consequences**: §4 now explicitly permits the supplied leadership paragraph but still forbids invented profiles, history, timelines and statistics. Copy-integrity tests lock the paragraph array exactly, while the metadata retains its narrower source-grounded description. The About photograph remains unresolved under `OD-14`; DEC-050 does not change DEC-027's temporary-media boundary.
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
| DEC-016 | `FOUND-008` prototype archival closed as not applicable | Superseded by DEC-021 |
| DEC-017 | Nav wordmark = serif "assetly"; bar wider than the page gutter | Wordmark superseded by DEC-044 |
| DEC-018 | Hero main line = "The lighter balance sheet." (supersedes DEC-001's headline) | Active |
| DEC-019 | Compare calculator: no bars/magnitudes/value input; mode row jumps | Superseded in part by DEC-023 |
| DEC-020 | `--nav-block` is what sections clear, not `--nav-h` | Active |
| DEC-021 | Archive the two prototype HTML references | Active |
| DEC-022 | Compare plates use the archived prototype's drafting language | Active |
| DEC-023 | Compare uses qualitative tier bars without prototype math | Amended by DEC-048 |
| DEC-024 | Why Assetly exposes only the active face to screen readers | Active |
| DEC-025 | Sector artwork and reduced motion are code-native and static | Active |
| DEC-026 | Contact uses an illustrative code-authored Bengaluru plate | Superseded by DEC-033 |
| DEC-027 | About may use an explicit temporary media slot during development | Active |
| DEC-028 | Section blocks are sized against viewport height, not width | Active |
| DEC-029 | Sector rotation changes a card every 1.2 seconds | Active |
| DEC-030 | The map pin and its label share the viewBox centre | Active |
| DEC-031 | Hero opening replay, continuous double blink and settled hold | Active |
| DEC-032 | Why Assetly and Sectors resolve inside one viewport | Active |
| DEC-033 | Contact map uses real OpenStreetMap geography | Active |
| DEC-034 | Compare focus holds a locked band before transitioning | Active |
| DEC-035 | Slide 01's left half is the mirrored reference crane | Superseded by DEC-037 |
| DEC-036 | Nothing holding a parked panel may be a scroll container | Active |
| DEC-037 | The reference crane belongs to the Hero plate | Active |
| DEC-038 | Hovering a sector card holds that card, not the grid | Active |
| DEC-039 | The opening blink is slower and runs on a near-sine curve | Active |
| DEC-040 | Hero plate frames the copy; combined Access/Grow is the approved phone mode | Active |
| DEC-041 | Sectors composes against a height budget, not a cell minimum | Active |
| DEC-042 | Focus lock is half a screen; no resting position is blank | Active |
| DEC-043 | Hero main line declares its size, clears its descender, hangs its full stop | Active |
| DEC-044 | Home button carries the full "assetly leasing" lockup | Active |
| DEC-045 | Compare reads Ownership Risk, Tax, Leverage, Upfront Cash; renumbered 01-04 | Active |
| DEC-046 | Slide 01 titled Ownership Risk; the tax argument drops two claims | Active |
| DEC-047 | The graph's three columns carry three tones, stepped in lightness | Active |
| DEC-048 | A fourth `minimal` tier, used by Upfront Cash's Lease reading | Active |
| DEC-049 | Published contact identity is finance@assetly.lease / +91 81231 96924 | Active |
| DEC-050 | About uses the owner's four-paragraph company and leadership statement | Active |
