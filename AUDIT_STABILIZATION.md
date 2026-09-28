# Universe Mapper — Stabilization Audit

Validated on 28 September 2026.

## Corrected

- Root Map receives a stable root scope instead of referencing missing state.
- Zoom and pan inputs are clamped and recover from invalid values; `NaN%` cannot propagate through the viewport state.
- Node, circle, text, shape, frame, and button creation uses the position and size drawn by the user.
- A newly created object becomes the active selection and opens its contextual Inspector properties.
- Full object areas participate in selection; frames and borderless text receive clear hover and selected affordances.
- Navigation tool hints use reliable native labels instead of a viewport-relative pseudo-tooltip.
- Relationship selection no longer stays highlighted after selecting a node.
- Context-menu deletion uses the app confirmation dialog, not an undefined canvas-local state setter.
- Dropdown color palettes follow the shared close/toggle/outside-click behavior.
- Canonical normalization preserves node links/alignment, annotation button/frame properties, relationship line styles, zero-width borders, and manual routes.
- Formula, Simulation, and Reports now resolve to a working analysis component instead of a missing component runtime error.

## Validation

- `npm test`: PASS
- `npm run build`: PASS
- `npm run check`: PASS with warnings only; no lint errors
- `.mf` round-trip and legacy normalization: PASS

## Deployment

Upload the complete repository contents to GitHub without `node_modules`. Netlify configuration is included in `netlify.toml`.
