# Universe Mapper AI — Stage 7: Trusted entitlement administration

This patch adds an isolated, command-line-only admin tool for the Stage 6 Firebase custom-claim contract. It does not add public admin UI, does not change the app's data model, and does not connect payment processing.

## Files

- `admin-tools/ai-entitlement.mjs` — pure claim update helpers; preserves all unrelated claims.
- `admin-tools/set-ai-tier.mjs` — Firebase Admin SDK CLI; defaults to dry-run and requires `--apply` to mutate a user.
- `admin-tools/package.json` — isolated dependency manifest for the trusted admin tool only.
- `admin-tools/ai-entitlement.test.mjs` — unit tests for claim preservation and tier validation.

## Setup (trusted machine only)

1. Use a secured administrator workstation or controlled CI job. Never deploy this tool into the public frontend or Netlify Functions.
2. Install dependencies from the `admin-tools` directory: `npm install`.
3. Authenticate Firebase Admin SDK using Application Default Credentials, or set `GOOGLE_APPLICATION_CREDENTIALS` to a protected service-account JSON file. Never commit that file or include it in the patch ZIP.
4. Set `FIREBASE_PROJECT_ID` to the exact project used by the app.
5. Run the dry-run first:

   `node set-ai-tier.mjs FIREBASE_UID paid`

6. Review the project, UID, email, existing claims, and proposed claims. To grant Paid AI only after confirming the target account, run:

   `node set-ai-tier.mjs FIREBASE_UID paid --apply`

7. To revoke Paid AI, run:

   `node set-ai-tier.mjs FIREBASE_UID free`

   Then, only after review, add `--apply`.

The `free` operation removes only `aiTier`; other custom claims are preserved. Granting `paid` requires the account email to be verified. The tool uses the Admin SDK's privileged credentials, so access to the machine/CI secret must be restricted.

## Token refresh

After a claim change, the user's existing ID token may still carry the old claims until refreshed. Ask the user to sign in again or force-refresh the ID token. The Stage 6 backend remains the authority and checks the signed claim server-side.

## Validation

Run from `admin-tools`:

```sh
npm test
node --check ai-entitlement.mjs
node --check set-ai-tier.mjs
```

No live Firebase mutation is performed by these tests. This patch does not automatically grant/revoke claims from a payment provider; that should only be added after the actual billing source and webhook verification are defined.
