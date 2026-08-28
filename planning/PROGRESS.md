# PROGRESS

This file reflects the *current* state of the project, not a running chronological log. Overwrite it each cycle per `LOOP.md` step 6.

---

## Current Phase

Phases 0–3, 4–9 are all complete and exited. Phase 10 (Accessibility, performance, QA) has begun:
`QA-000` (the About photograph, blocked on `OD-14`) is done this cycle. `QA-001` onward (keyboard,
focus, screen reader, touch target, Lighthouse passes) have not started yet.

## Current Task

None outstanding from this cycle. Awaiting owner confirmation on the About photo's `object-fit: contain`
treatment (see Notes for Next Cycle) before treating `QA-000` as fully closed per DEC-054's
owner-approval gate. Next up is `QA-001`.

## Status

This cycle picked up two small, independent items the owner supplied directly:

1. **`OD-14` resolved** — the owner supplied a real leadership-team photograph and an instruction to
   upload it "with optimization and clarity." Re-encoded, wired into `/about` via `next/image`, and
   given factual (non-invented) alt text. See Completed This Cycle and `DEC-059`.
2. **Google Search Console verification** — the owner supplied the verification meta tag from the
   Search Console "HTML tag" ownership-verification flow. Added to `app/layout.tsx`'s `Metadata.verification.google`
   field (Next's file-convention API), confirmed it renders as `<meta name="google-site-verification" ...>`
   in the served HTML.

## Completed This Cycle

### `OD-14` / `QA-000` — About page photograph (`DEC-059`)

- Source: owner-supplied JPEG (1600×899, landscape, four leadership team members in business attire
  against a plain grey studio backdrop) — meets `OD-14`'s ≥1600px-wide landscape requirement at native
  resolution, no upscaling needed.
- Re-encoded via `sharp` to `public/about/leadership-team.webp` (quality 84, light sharpening for
  clarity, ~66% smaller than the source JPEG — 158KB → 54KB — with no visible quality loss at the
  rendered sizes `next/image`'s `sizes="(max-width: 760px) 100vw, 40vw"` requests).
- `app/(site)/about/page.tsx` — placeholder div (`data-about-media-placeholder`, `aria-hidden`, "Image
  forthcoming" label) replaced with a `next/image` `fill` element. Alt text describes only what's
  visible ("Four members of the Assetly leadership team standing together in business attire against a
  plain grey backdrop.") — no names, titles, or roles, since none were supplied (§24: never invent).
- `app/(site)/about/About.module.css` — `.placeholderLabel` removed; new `.mediaImage` uses
  `object-fit: contain` (not `cover`) with `padding: var(--card-pad)`, so the image letterboxes inside
  the same hairline-bordered inset the placeholder used, rather than being cropped. `.media`'s box is
  tall and narrow (stretches to full section height at ~40% column width); `cover` was tried first and
  cropped two of the four people out of frame entirely on this photo. See `DEC-059` for the full
  reasoning.
- `tests/e2e/about.spec.ts` — placeholder assertions (`aria-hidden`, "no `<img>` in main") replaced with
  real-image assertions: exactly one `<img>` in `main`, the factual alt text, and a `srcset` candidate
  ≥1600w. The layout-proportion test's locator moved from `[data-about-media-placeholder]` to the new
  stable `[data-about-media]` attribute on the wrapper div.

### Google Search Console verification (`SEO-006`)

- `app/layout.tsx` — added `metadata.verification.google` with the token from the Search Console "HTML
  tag" ownership flow. Next.js's Metadata API renders this as
  `<meta name="google-site-verification" content="...">` in `<head>`; confirmed directly against the
  dev server's served HTML. No manual `<meta>` tag needed, no separate verification file.

## Decisions

- **DEC-059** — `OD-14` resolved: the real About leadership photograph ships, rendered with
  `object-fit: contain` rather than `cover` so all four people stay visible, at the cost of letterboxing.

## Tests Run

`npx tsc --noEmit` clean. `npx eslint` clean on all changed files. `npx vitest run`: 124/124 passing
(unaffected by this cycle's changes — no unit-level logic changed). `npx playwright test
tests/e2e/about.spec.ts --workers=1`: 5/5 passing, including the new real-image assertions. Full
Playwright regression suite was kicked off in the background to catch any incidental regression outside
`/about`; results were not yet reviewed at the point this file was written this cycle — check the next
cycle's run or the task notification before treating the whole suite as confirmed green.

Manual verification: dev server started, `/about` screenshotted at 1440×900 and 390×844. Desktop and
mobile both show all four people in frame, correctly letterboxed, no cropping. Homepage `<head>`
inspected directly (`curl`) to confirm the Search Console meta tag renders with the exact token supplied.

Owner approval (DEC-054's actual closing gate) has not yet been given for the About photo's visual
treatment specifically — screenshots were produced but not yet reviewed by the owner in this
conversation. Flagged in Current Task above.

## Issues / Blockers

1. `OD-13` — no Compare disclaimer wording supplied; none invented.
2. `OD-02` — the Hero plate remains authored rather than designer-reviewed.
3. `OD-01` — no vector logo/wordmark lockup exists yet. A raster-derived favicon ships (`DEC-058`) using
   the existing brand mark; regenerate it from the real vector when it lands.
4. `OD-07` — the admin panel's visual design is deliberately minimal/utilitarian per §18; a themed
   redesign remains open if the owner wants one later, but nothing about it blocks functioning.
5. `npm audit` reports moderate advisories through `firebase-admin`; still unaddressed, worth a look now
   that Firebase is live in production use.
6. The Contact marker sits on Brigade Road's own centreline (OSM data), not the exact building — still
   open, still not blocking.
7. Hero plate dev/prod discrepancy report and the deferred crane-lift animation are explicitly out of
   scope for this session (Hero/plate work runs in a separate, parallel track).
8. `git push origin main` fails with a 403 (the machine's cached git credential is authenticated as a
   GitHub account, `assetlyleasing`, that lacks write access to `sujeth-dev/Assetly.git`). Pushes to the
   `fresh` remote succeed. The owner has been asked to resolve the credential/account mismatch on their
   end; not re-attempted automatically each cycle to avoid repeatedly hitting the same 403 or risking
   further credential exposure.

## Next Recommended Task

Get the owner's sign-off on the About photo treatment (screenshots taken this cycle), then continue
Phase 10 with `QA-001` (full-site keyboard pass across `/`, `/about`, `/admin`).

## Notes for Next Cycle

- The About photo currently uses `object-fit: contain`, which letterboxes a landscape photo inside a
  tall narrow slot rather than cropping it. This is a visual judgment call made without owner review in
  this cycle (the alternative, `cover`, cut two of four people out of frame) — confirm the owner is happy
  with the letterboxed look, or that a different-shaped photo/crop is coming, before considering `OD-14`
  fully closed in spirit and not just in the checklist.
- `public/about/leadership-team.webp` is the only art file for this section. If a re-crop or a new photo
  arrives, only that file and the alt text (if the subjects change) need to change — everything else
  (layout, sizes, CSS) is agnostic to the specific image.
- The full Playwright suite was started in the background at the end of this cycle to check for
  regressions outside `/about`; confirm its result before starting new work if it hasn't been checked
  yet.
- `git push origin main`'s credential mismatch (see Issues/Blockers #8) is unresolved — keep pushing to
  both remotes as normal after each completed phase; don't attempt further credential debugging
  (`git credential fill` and similar print secrets to the conversation — already flagged to the owner
  once, don't repeat it).
