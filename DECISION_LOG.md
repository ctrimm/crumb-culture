# Decision Log

Data-backed decisions for this template. Newest first. When new evidence
contradicts an entry, revisit it here rather than letting it harden.

## D1 — Third template in the series: a bakehouse (2026-10-24)

- **Decision:** Build the food/retail entry of the template set as an
  artisan bakehouse with a 50/50 split-screen hero (two photographs, one
  cream card on the seam) maintained as the design's through-line.
- **Why:** The set already covers an editorial portfolio (light,
  type-led) and an interiors studio (warm full-bleed ground). A bakery
  adds a different business shape: menu + prices + bake schedule +
  hours are content types neither earlier template exercises, and the
  split hero is a structurally distinct composition.
- **Scrub rule (standing):** the shipped repo contains no reference to
  any existing template, marketplace or platform the design survey
  looked at. Verified by grep over the tracked tree before pushing.

## D2 — Palette: cream ground, espresso ink, burnt-crust accent (2026-10-24)

- bg `#faf5ec`, ink `#2e211a` (13.9:1), accent `#9c4415` (5.9:1 on the
  cream — passes AA for the small serif prices and mono labels it
  carries), surface `#f0e3cd`, deep `#33241a` with deepText `#faf5ec`
  (13.4:1) for the bake-day band and footer.
- Ratios are computed from the shipped config in the unit suite, so a
  palette edit that breaks AA fails CI.

## D3 — All imagery AI-generated (2026-10-24)

- Hero diptych generated as a single two-panel image and sliced into
  left/right halves; the four bake photos generated as one 2×2 contact
  sheet and sliced; story (baker's hands) and visit (cafe interior)
  generated individually. Every image was visually reviewed before the
  build (no garbled text, no people/faces needed for this business).
- Originals live in `source-images/`; sliced/optimized files in
  `public/images/` via `scripts/optimize-images.py`.

## D4 — Domain model: bakes, not projects (2026-10-24)

- The config's central list is `bakes` (title, category, price,
  bakeDays, details). The Menu page groups by category and renders a
  bake-schedule list from the same data; each bake gets a detail page
  with a next-bake link. Hours/address/notes live in a `visit` section.

## D5 — Pipeline inherited from the earlier templates (2026-10-24)

- Node pinned to 22.23.4 in workflows (Astro 7.4.2 engines); SITE/BASE
  env scoped to the deploy build job only; subpath builds verified by a
  dedicated integration suite with a clean environment; Lighthouse
  gates Accessibility/Best Practices/SEO at 100 with Performance
  report-only in CI (runner CPU dominates it — local runs are the
  signal); reveal animations avoid opacity fades.

## 2026-10-30 — Micro-interactions pass

- CSS-only motion layer appended to `src/styles/global.css` (one marked
  section, removable as a block): nav underline sweeps, image zooms
  inside their frames (`a:has(> img)` + overflow hidden), index-row
  name/arrow slides, pill lifts with a press settle, chip rises, row
  leans, next-link arrows, footer-email underline sweeps, accent text
  selection, and visible focus rings.
- Hero motion is a slow transform-only "ken burns" drift (14–18s,
  alternate) — composited, no layout shift, no Lighthouse CLS cost.
- Hard rules kept from the series: no opacity fades on content (axe
  snapshots mid-fade report phantom contrast failures), and a
  `prefers-reduced-motion` block stills every new animation/transition.
- Verified: full test suites green and Lighthouse Accessibility /
  Best Practices / SEO still 100 after the change.
