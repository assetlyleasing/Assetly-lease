# components

Reusable React components, grouped by the section or concern they serve
(`nav/`, `footer/`, `hero/`, `plate/`, `trusted-by/`, `compare/`, `primitives/`,
`admin/`).

Each component ships with a co-located `.module.css` file (DEC-009) that
consumes the custom properties in `styles/tokens.css` — no literal colour,
easing, or spacing values in component CSS.

Anything animated must declare its own `prefers-reduced-motion` fallback
(`SOURCE_OF_TRUTH.md` §8); the blanket rule in `app/globals.css` is a safety
net, not a substitute.
