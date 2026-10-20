# Universe Mapper AI — Stage 3 foundation patch

## Scope
- Adds a provider-neutral structure schema validator and deterministic tree flattener.
- Does not modify App.jsx, styles.css, canvas rendering, storage, `.mf` serialization, Firebase, authentication, or existing interaction code.
- Enforces mode, required labels, maximum depth, maximum node count, and maximum label length before AI output can be adapted into native canvas objects.

## Files
- `src/lib/aiStructureSchema.js` (new)
- `tests/aiStructureSchema.test.mjs` (new)

## Validation
- `node --test tests/aiStructureSchema.test.mjs`: 3/3 passed.
- Full Vite production build is not claimed: dependencies were not installed/verified in this environment.
- This patch is a safe foundation only; it does not connect a real AI provider or route Free/Pro users yet.

## Apply
Copy the two paths into the same paths in the P1–P10 branch. Do not replace `App.jsx`, `styles.css`, package files, or any existing files for this patch.
