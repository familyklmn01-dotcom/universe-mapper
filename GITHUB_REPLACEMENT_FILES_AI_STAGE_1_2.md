# GitHub replacement — Universe AI Stage 1–2 prototype

Copy/replace only the paths below in the existing **P1–P10 working branch**. Do not commit directly to `main`.

## Replace
- `src/App.jsx`
- `src/styles.css`
- `tests/foundation.test.mjs`

## Add
- `src/components/UniverseAIPanel.jsx`
- `AI_IMPLEMENTATION_STAGE_1_2_AUDIT.md`

## Verification
- `npm test` should report 7 passing tests.
- Run `npm ci` and `npm run build` in a normal build environment before deployment. The build could not be verified in the current execution environment because the dependency installation timed out and Vite was unavailable.

## Scope boundary
This delivery is a UI + local prototype only. It does not call an AI provider, does not require API credentials, does not implement Free/Pro subscription checks, and should not be advertised as a live AI feature until those steps are implemented and tested.
