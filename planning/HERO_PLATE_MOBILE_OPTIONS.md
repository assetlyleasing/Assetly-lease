# Hero Plate Mobile Options

The Hero has one production setting for its phone artwork:

```ts
// content/plates/hero-plate.tsx
export const HERO_MOBILE_PLATE_MODE: HeroMobilePlateMode = "both";
```

Change only the quoted value to activate another prepared composition. Do not
toggle CSS rules, hide individual SVG paths, or change `Hero.tsx`.

## Available modes

| Value | Phone result | Intended use |
|---|---|---|
| `"both"` | Access below-left and Growth at the far right, grounded on one full-width datum | Approved production default |
| `"hidden"` | No plate at widths up to 640px | Use when the copy should have the full frame |
| `"access"` | Crane and building grounded on the full datum | Use when the asset/equipment idea should lead on phones |
| `"growth"` | Rising line and open growth frames below-right | Use when progression and scale should lead on phones |

All modes use the approved 20% settled opacity. During the 2.6-second draw the
stroke begins in Pitch, then resolves to Olive; reduced motion skips that tone
transition and shows the final Olive state immediately.

After drawing, every phone mode remains fixed: there is no cursor parallax,
ambient plate drift or junction-node movement. Desktop and tablet retain their
approved restrained living-plate motion.

Short viewports at 520px high or less always hide the plate, including phone
landscape. That override is intentional: there is not enough vertical room for
the fixed Hero copy and meaningful artwork together.

## Switching the production mode

1. Change `HERO_MOBILE_PLATE_MODE` to `"both"`, `"hidden"`, `"access"`, or
   `"growth"`.
2. Run the Hero unit and browser tests.
3. Inspect 320×700, 390×844 and 640×900, plus 844×390 landscape.
4. Confirm the plate never touches the mark, headline or tagline and creates no
   horizontal overflow.
5. Check normal and reduced-motion states before committing the change.

Only one mode can be active because the value is a typed string union. Adding a
new mode requires an approved composition, corresponding SVG/CSS rules, tests,
and a decision record.

## Desktop and tablet contract

The mobile setting does not affect widths above 640px. Desktop and tablet keep
the complete composition: Access lower-left, Scale beneath the copy, and Grow
rising at the right. The central copy position and loader landing target are not
part of the plate layout and must remain unchanged.
