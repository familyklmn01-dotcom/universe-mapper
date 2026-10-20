# Universe Mapper AI — Stage 6: Paid AI entitlement

## Patch contents
- `netlify/functions/firebaseIdToken.mjs`: verifies Firebase ID-token signature and required claims against Google's published Secure Token certificates.
- `netlify/functions/ai-structure.mjs`: Free AI now uses verified ID tokens and rejects accounts whose signed custom claim is `aiTier: "paid"`.
- `netlify/functions/ai-structure-pro.mjs`: separate Paid AI endpoint; rejects users without the signed `aiTier: "paid"` claim.
- `src/lib/aiClient.js`, `src/components/UniverseAIPanel.jsx`: routes users using Firebase's token-result claims; server independently enforces entitlement.
- Tests cover endpoint method/config/auth guards.

## Netlify environment variables
Required:
- `FIREBASE_PROJECT_ID`: exact Firebase project ID (not display name).
- `GEMINI_API_KEY`: Free AI provider key, server-side secret.
- `GEMINI_PAID_API_KEY`: Paid AI provider key, server-side secret. It may temporarily equal `GEMINI_API_KEY`, but separate keys are recommended for cost/usage isolation.

Optional:
- `GEMINI_FREE_MODEL` (default `gemini-2.5-flash-lite`)
- `GEMINI_PAID_MODEL` (default `gemini-2.5-pro`)
- `AI_FREE_RATE_LIMIT_PER_MINUTE` (default 8, per function instance)
- `AI_PAID_RATE_LIMIT_PER_MINUTE` (default 20, per function instance)

`FIREBASE_WEB_API_KEY` is no longer required by these AI endpoints. Do not mark the Firebase Web API key as a secret merely because it is present in frontend Firebase config. Keep Gemini keys secret.

## Entitlement contract
The backend recognizes exactly this Firebase Authentication custom claim:

```js
{ aiTier: "paid" }
```

Only trusted server/admin code may set or clear it. Never let the browser set its own claims, and do not set claims based solely on a client-submitted plan name. Example trusted Admin SDK operation (run in a protected server/admin environment, never in browser code):

```js
await getAuth().setCustomUserClaims(uid, { aiTier: "paid" })
```

When removing paid access, preserve any other existing claims and remove `aiTier` through trusted Admin SDK code. Existing ID tokens may keep old claims until refreshed; have the user sign in again or force-refresh their ID token after entitlement changes.

## Verification and limitations
- ID token signature, issuer, audience, expiry, subject, auth time, and verified-email claim are checked on the server.
- The paid endpoint requires the signed `aiTier === "paid"` claim; a frontend label alone cannot grant access.
- Per-instance in-memory rate limits are best-effort, not durable subscription quotas.
- This patch does not integrate payment processing or automatically grant/revoke claims when a subscription changes. Your trusted admin/billing workflow must manage claims.
- Paid endpoint defaults to Gemini 2.5 Pro; ensure the model is available to the configured API project and region.
- Run tests and a full Netlify deploy-preview/live UAT before production. No live provider call is performed by these tests.

## Checks
```sh
node --test tests/foundation.test.mjs tests/aiStructureSchema.test.mjs tests/aiFreeEndpoint.test.mjs tests/aiPaidEndpoint.test.mjs tests/aiVisibleWorkflow.test.mjs
node --check netlify/functions/firebaseIdToken.mjs
node --check netlify/functions/ai-structure.mjs
node --check netlify/functions/ai-structure-pro.mjs
node --check src/lib/aiClient.js
```
