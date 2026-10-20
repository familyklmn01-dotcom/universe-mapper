# Universe Mapper AI — Stage 4 (Free AI)

## Files in this patch

- `src/App.jsx` — validates AI output again at the canvas boundary and creates native editable nodes in a new structure. This file includes the Stage 1–2 panel integration; apply patches in order if not already present.
- `src/components/UniverseAIPanel.jsx` — calls the Free AI client and shows a validated preview before applying.
- `src/lib/aiClient.js` — same-origin client request; never contains provider secrets.
- `netlify/functions/ai-structure.mjs` — server-side Gemini request, Firebase ID-token verification, input/output validation, per-process short-window request throttle.
- `src/styles.css` — small state styles only; no canvas grid/layout rules changed.
- `tests/foundation.test.mjs`, `tests/aiFreeEndpoint.test.mjs` — regression and endpoint guard tests.

## Required Netlify environment variables

Set these in Netlify Site configuration → Environment variables:

- `GEMINI_API_KEY`: API key created for the chosen Gemini API project. Keep it server-side only.
- `FIREBASE_WEB_API_KEY`: the Firebase project's Web API key used by Firebase Authentication to validate the ID token via Identity Toolkit. This is a project configuration value, not a substitute for a server secret.
- Optional `GEMINI_FREE_MODEL`: model name approved for the project. Defaults to `gemini-2.5-flash-lite`; change it if that model is unavailable for the project's account/region.
- Optional `AI_FREE_RATE_LIMIT_PER_MINUTE`: request threshold per user per function instance; defaults to 8 and is clamped to 1–30.

After adding variables, trigger a new Netlify deploy so the function receives them.

## Behavior and safety

- The endpoint requires a Firebase ID token and a verified, enabled account.
- Provider keys are never sent to the browser.
- Prompt length is capped at 5,000 characters; structure output is checked by `validateAIStructure` (120 nodes / depth 8 by default).
- The endpoint returns a preview payload; it does not write to Firestore or change the canvas itself.
- Applying a preview creates a new structure and native nodes through the existing `commit` flow. Existing structures are not replaced.
- If configuration is missing, the endpoint returns HTTP 503 with a clear message; it does not silently fall back to a fake AI response.
- The in-memory rate limiter is only a best-effort per-function-instance guard, not a durable per-account quota. Configure provider limits; persistent plan-based quotas belong in the entitlement stage.
- Demo/local users cannot call online Free AI. Offline/demo workflows remain available.
- Paid AI selection and reliable Free-vs-Pro entitlement enforcement are not included yet; those require a verified plan source and are Stage 5/6 work.

## Validation performed

Run:

```sh
node --test tests/foundation.test.mjs tests/aiStructureSchema.test.mjs tests/aiFreeEndpoint.test.mjs
node --check netlify/functions/ai-structure.mjs
node --check src/lib/aiClient.js
```

A full Vite production build and browser/Firebase/Netlify live test must still be performed in the target branch before production deployment.
