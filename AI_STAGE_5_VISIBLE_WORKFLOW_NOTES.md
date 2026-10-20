# Universe Mapper AI — Stage 5: Visible Workflow

## Purpose
Make the existing Free AI workflow easier to discover and understand. This is a UI/UX layer over Stage 3 schema validation and Stage 4's backend integration; it does not add a new AI provider or change the data model.

## Changed files
- `src/components/UniverseAIPanel.jsx`: stronger intro, quick prompt starters, mode guidance, character counter, clearer generation/loading state, preview context, and Viewer explanation.
- `src/styles.css`: scoped AI-panel styling only. No canvas, node, relationship, Inspector, or application layout rules were changed.

## Behavior
- Example prompt chips fill the prompt and choose the matching structure mode; the user still reviews/edits the prompt and explicitly starts generation.
- The generated structure remains a preview until the user presses **Tambahkan ke canvas**.
- Existing structures are not replaced. Applying still goes through the existing Stage 4 handler.
- The UI does not claim that the online provider is available; availability still depends on Netlify/Firebase configuration.
- Paid AI selection and plan entitlement are intentionally not included. Before routing users to paid AI, the server needs an authoritative plan source (for example verified Firebase custom claims or a server-checked entitlement record). A client-provided plan label is not secure.

## Apply
Extract only the two changed source files into the existing branch, preserving paths. This patch assumes Stage 1–4 have already been applied. Do not merge into `main` until regression tests and a production build pass.

## Validation status
Static checks and focused tests should be run against the complete branch after applying. This patch does not claim a live Netlify/Firebase/Gemini test.
