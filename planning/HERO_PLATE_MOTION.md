# Hero plate motion — state, conventions, and what is left

Working document for the Hero plate's animation work. `planning/PROGRESS.md` stays authoritative for
phase status; this file exists because the plate's motion has its own geometry, its own vocabulary and
its own review loop, none of which belong in the phase tracker.

Last updated after commit `5540a01`, pushed to both `origin` and `fresh`.

---

## 1. How to work on this

The owner reviews this work **visually, on a running dev server**, not through test output. That is a
standing instruction, not a shortcut for one task:

- **Do not run Vitest, Playwright, or lint for plate motion changes.** Type check (`npx tsc --noEmit`)
  and let the owner preview. Automated suites are for logic, not for whether a lift looks like a lift.
- **Implement one element at a time and stop.** The owner previews each before the next begins.
  Bundling two changes means a rejection reverts both.
- **Ask before building when the instruction is ambiguous.** Messages arrive voice-transcribed and
  garbled. Restate the interpretation in plain text, flag which part is inferred, and get confirmation.
  Two rounds of work have already been reverted for guessing wrong.
- **"Revert" means only the files from the current thread.** Run `git status --short` first. Other
  sessions have worked in this tree concurrently; never restore a file this thread did not touch.

### Reading the feedback

The owner's rejections have been consistent and specific, and they are worth internalising because
they predict what will be rejected next:

- **"That's a ghost trick."** Elements that fade in from nothing and fade out are rejected. Anything
  that appears must scale or move out of something already drawn.
- **"It's not even a lift."** An abstract marker standing in for a real object is rejected. If the
  drawing claims a mechanism, the mechanism's parts must be present — a lift needs a shaft and a car,
  not a moving dot.
- **"Not so fast… let it reach, then open."** Composite motions must be sequential and clearly
  separated in time, never overlapped. Half a second of stillness between two beats is the floor.
- **"A complete logical feel… meaningful and realistic."** Every element is either real architecture
  or real machinery, and every motion is what the real thing would actually do. This is the governing
  criterion for all remaining work.

---

## 2. The geometry

All ACCESS coordinates are in the local space inside
`<g transform="translate(-20 118.4) scale(.86)">` in `content/plates/hero-plate.tsx`. The composition
transform maps local `y=560` onto the viewBox datum at `y=600`, which is why every structure's base is
560 and why anything meant to sit on the ground must end there.

### The building (leftmost tower)

| Feature | Coordinates |
|---|---|
| Outline | `M70 560V372H205V560` — walls x=70 / x=205, roof y=372, base y=560 |
| Floor slabs | y = 394.4, 435.8, 477.2, 518.6 — a uniform **41.4 storey** |
| Lift shaft | `M175 372V560` — the bay between x=175 and the building's own right wall |
| Slabs (current) | `M70 394.4H175M70 435.8H175M70 477.2H175M70 518.6H175` — they stop at the shaft |
| Occupiable width | x 70 → 175, west of the shaft |

The band y 372 → 394.4 is only 22.4 tall, roughly half a storey. On the shaft side it reads as the
lift's **overrun**, which is why the shaft runs to the roof rather than stopping at the top landing.

### The lift

Car authored at the ground stop: `<rect x="180" y="534" width="20" height="26">`, bottom edge exactly
on 560. Every travel value is therefore negative, and **the un-animated state is a lift parked at the
ground** — which is also the correct reduced-motion resting state, so no extra rule is needed.

| Stop | Car bottom on slab | `translate` |
|---|---|---|
| Ground | 560 | `0` |
| 1st | 518.6 | `-41.4px` |
| 2nd | 477.2 | `-82.8px` |
| Top | 435.8 | `-124.2px` |

Doors are two `<line>` leaves drawn **coincident** at x=190, y 536→558. Shut is a single seam on the
car's centre line; open is `∓9px`, putting each leaf in the car's own wall.

### The crane

| Feature | Coordinates |
|---|---|
| Boom pivot | (371.2, 402.3) |
| Boom tip | (120.4, 305.4) — the drawn, fully-extended state |
| Hook triangle | `M120.4 305.4L102.4 345.3L138.5 360.5Z` |
| Chassis box | x 447.2 → 546, y 457.4 → 560 |
| Wheels | cx 413 and cx 502.3, cy **528.6**, r 31.4 (rim) and 11.4 (hub) |
| Hub keyways | vertical, hub centre out to hub edge — on **both** wheels |

The wheel at 502.3 sits fully inside the chassis box; 413 sits entirely outside it to the left. When
the owner says "the one inside the building", they mean **502.3** — getting this wrong cost one
rejected round.

Wheel centres were 516.3 and were moved to 528.6 so the wheel bottoms land on 560. At 516.3 the crane
floated ~12 units clear of the ground.

The boom's telescoping motion (section 5) is planned as an animated `d` property. This is safe against
the shared draw: `Plate.module.css` sets a fixed generic `stroke-dasharray: var(--plate-dash, 2200)`,
always far longer than any real path, and `stroke-dashoffset` resolves to 0 once `.go` completes — so
changing a path's length after the reveal produces no dash artefact.

---

## 3. The motion vocabulary

Every loop in the plate must have a period that shares **no simple ratio** with the others, or they
drift into a shared beat and the plate starts reading as "animated" rather than "alive". Current set:

| Animation | Period | Easing |
|---|---|---|
| `plateDrift` | 11s | `--eio`, alternate |
| `nodeBreathe` | 9s / 12s / 10.5s | `--eio`, alternate |
| `plateJourney` | 9s | `--eio` |
| `siteSpin` (hub) | 7.9s | `linear` — a wheel turns at a constant rate |
| `buildingLift` + doors | 15.8s | `--eio` |

Other load-bearing conventions:

- Ambient delays are `calc(var(--dur-draw) * N)` so nothing overlaps the 2.6s draw.
- `transform-box: fill-box` is required on any SVG sub-element that translates or rotates, or the
  transform resolves against the viewport instead of the element.
- **Every new animated hook needs an entry in two places**: the `prefers-reduced-motion` block and the
  `@media (max-width: 640px)` block. Both name each hook individually.
- Reduced motion resolves to the drawn state. Elements whose only content is their motion (the journey
  marker) are hidden; elements that are part of the building (the lift car) stay and rest.

---

## 4. Done and shipped (`5540a01`)

- **The lift.** Shaft against the building's right wall; slabs cut at it so it reads as a void through
  the storeys. Car is a box, not a line. Stops with its floor level with a slab, so it can never rest
  between floors. Runs are uneven — two storeys up, one up, three down — because an even step-by-step
  pattern reads as a metronome. At each landing: arrive, **half a second shut**, doors part over 0.6s,
  hold open 1.2s, close over 0.6s, pause, depart. Travel and doors never overlap.
- **The hub rotation.** Only the hub of the wheel inside the chassis turns; its rim and the far wheel
  stay still. Both hubs carry the same keyway, since one marked wheel and one bare reads as a drafting
  error, and the keyway is what makes rotation visible at all.
- **Wheel grounding.** Both wheels moved onto the datum.

### Owed: a `DECISIONS.md` entry

`SOURCE_OF_TRUTH.md` §11 (line 183) currently reads *"only the structural junction nodes slowly
reposition; machinery wheels and fixed architecture remain still."* The hub rotation and the lift both
depart from this. The clause describes an older, purely-ambient version of the plate — the journey
marker already travels the plate's full width on a 9s loop, far outside its "2–5px drift". **Amend §11
to distinguish ambient drift (still 2–5px, nodes only) from deliberate mechanical motion (journey
marker, lift, hub), and record the decision.** This is unwritten and should be done before the next
phase closes.

---

## 5. Remaining work, in the owner's order

### A — The crane hook (next)

Approved in writing, not yet built:

- The boom **telescopes** between two lengths along its existing line, always resolving cleanly to one
  of its two ends. It must never freeze or read as glitchy mid-transition.
- At full extension it **holds a beat**, then dips toward the building and back — the placing motion.
- The payload is a **duplicate of the exact existing hook triangle** — same points, same size, not an
  invented shape.
- **Two take turns.** One rides out with the boom and is left at the site as it dips and retracts (the
  drop); later a second is picked up from the site and rides back in as the boom re-extends (the lift).
- Entrances and exits happen **at the real hook's own position**, scaling up from there. Nothing may
  appear in empty air — that is the "ghost trick" that was rejected once already.
- Reduced motion: boom stays extended, payload not shown.

A retracted boom tip at roughly (233, 349) — 55% along the boom's line — was computed in an earlier
pass and is a reasonable starting value.

### Finish

- General aesthetic polish and proper finishing, as a standing requirement across all four elements.
- Confirm nothing pulses in unison once A is in.

### Addon

- A brief, faint opacity bump on the crane's hub keyway exactly when a payload lands or lifts. No new
  shape — it ties the hub to the hook so the drop and pickup beats have a payoff at the site.

### Open, unscheduled

- **Office fit-out.** The owner asked for small plants, work benches, lights and similar office
  elements distributed through the building's storeys, then reverted the first attempt without giving
  a reason. Do not rebuild it blind — ask what was wrong with it first. The reverted attempt is
  recoverable from this session's transcript; it placed 11 short paths (desk, chair, planter, shelving,
  two pendants, benches) across the four rooms west of the shaft.
- **The tone question.** The plate's dark-to-light `plateDrawTone` shift may read as a uniform "bleed"
  rather than a targeted "bracketing" or highlight effect. Raised by the owner, never resolved. Two
  directions were sketched — tune the existing wash, or build a travelling highlight along the stroke —
  and neither was chosen.
- **Dev/prod draw discrepancy.** The plate was reported as already fully drawn on entry on Vercel while
  playing correctly locally. A bfcache `pageshow`/`event.persisted` fix was shipped but never confirmed
  against the original report. Needs the owner to check a deployed URL in a fresh incognito window with
  OS reduced-motion off.

---

## 6. Test tripwires

The suites are not run during this work, but they are still in the repo and will fail later if these
are broken. Check against them when changing artwork structure:

| Assertion | Where |
|---|---|
| Exactly **5** `data-hero-plate-region=` and exactly **3** `data-hero-plate-node=` | `tests/unit/heroPlate.test.tsx:25-26` |
| The **first `<path>` in document order** must finish with `strokeDashoffset: 0` — currently the tower outline | `tests/e2e/hero.spec.ts:89` |
| The **first `<circle>` in document order** must compute `animationName: "none"` under reduced motion | `tests/e2e/hero.spec.ts:234,243` |
| `plateDrift` duration must be between **8 and 12 seconds** | `tests/e2e/hero.spec.ts:129-153` |
| Visible regions at ≤640px must be exactly `["access","growth","datum"]`, in document order | `tests/e2e/hero-plate.spec.ts:99` |
| Growth frame bases at x 820/940/1060 must land on the datum within 0.5px | `tests/e2e/hero-plate.spec.ts:83-104` |
| Plate opacity must be exactly 0.2 under reduced motion | `tests/e2e/hero-plate.spec.ts:122-133` |

New hooks named `data-hero-plate-<noun>` are uncounted by the region/node assertions, so additional
animated elements are free as long as they do not introduce a new region group or a fourth node.

Playwright here needs `page.emulateMedia({ reducedMotion: "reduce" })` — `test.use({ reducedMotion })`
does not reach the page — and `--workers=1`, per `docs/plot.md:144-147`.

---

## 7. Git

Two remotes, both currently at `5540a01`:

- `origin` → `sujeth-dev/Assetly`
- `fresh` → `assetlyleasing/Assetly-lease`

Both accounts are authenticated in the `gh` keyring. `fresh` will 403 while `sujeth-dev` is the active
account, because it has no write access there. Push it with:

```
gh auth switch --user assetlyleasing
git push fresh main
gh auth switch --user sujeth-dev
```

Leave `sujeth-dev` active afterwards, since `origin` is its repo.

Work directly on `main`, one commit per completed phase, plain professional prose, and no tool or
automation attribution anywhere — commit messages, trailers, comments or branch names.
