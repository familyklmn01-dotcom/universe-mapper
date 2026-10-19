# Universe Mapper AI — Stage 1–2 Audit & Prototype Delivery

## Scope delivered

- Audited the uploaded `universe-mapper-main` and `universe-mapper-P1-P10` archives.
- Added an optional `Universe AI` panel that opens/closes without changing the main grid columns or resizing the canvas.
- Added Mind Map and Hierarchy prototype modes, prompt input, preview, and explicit apply action.
- Applying a preview creates a separate `AI Draft — …` structure with native editable nodes and parent-child hierarchy. Existing structures are not replaced.
- Read-only Viewer users cannot apply a draft.
- Added a regression test for the panel integration and explicit prototype disclosure.

## Important limitation

This is **not connected to a real AI model yet**. The preview uses local sample structures so we can validate the UI and native-node insertion path before integrating any provider. The panel explicitly discloses this. No API key, paid API, subscription billing, or Free/Pro provider routing has been implemented in this delivery.

## Source-of-truth notes

- `src/main.jsx` imports `src/App.jsx` and `src/ProductShell.jsx`; these are the Vite app entry path.
- The branch archive also contains root-level copies such as `App.jsx`, `lib/`, and `store.js`. Those are not imported by `src/main.jsx`; do not replace them as part of this feature without a separate confirmed need.
- `main` was not modified. Work was made against the uploaded P1–P10 branch archive.

## Validation

- `npm test`: **PASS — 7 tests**.
- `npm run build`: **NOT VERIFIED**. The command could not find Vite (`sh: 1: vite: not found`) after `npm ci` timed out and left an incomplete `node_modules`. This is an environment/dependency-install limitation, not a successful build result. Re-run `npm ci` in a working network/build environment, then `npm run build` before deployment.
- No live browser, Firebase, or Netlify UAT was performed.

## Next steps

1. Complete provider-neutral structured output schema and adapter.
2. Integrate an actual AI provider behind a backend endpoint; never expose API keys in browser code.
3. Add verified account-tier/entitlement checks before routing Free users to a no-cost eligible model and Pro users to a paid model.
4. Add request limits, rate limiting, output validation, and cost monitoring.
5. Re-run build and full interaction regression tests before deployment.
