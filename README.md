# Universe Mapper — Stage 1 Final Stabilization

Visual knowledge and system-modeling application with hierarchy, relationships, formulas, scenarios, reports, private Firebase workspaces, and collaboration.

## Local development

```bash
npm install
npm run dev
```

## Quality check and production build

```bash
npm run check
npm run build
```

The deployable output is generated in `dist/`. Netlify uses `netlify.toml` automatically.

## Netlify deployment

1. Push this project to a private or public GitHub repository.
2. In Netlify choose **Add new project → Import from Git**.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Deploy, then copy the final `*.netlify.app` domain.
6. Add that domain to **Firebase Authentication → Settings → Authorized domains**.
7. Publish `firestore.rules` in Firebase Console before production testing.

## Firebase

- Authentication: Email/Password and Google.
- Email verification is required.
- Firestore stores profiles, Universes, invitations, formulas, and scenarios.
- Exported images and documents are downloaded to the user's device; Firebase Storage is not used.
- Firebase web configuration is public by design. Access protection is enforced by Authentication and Firestore Security Rules.

## Final acceptance test

- Sign up and verify email.
- Create, reopen, and rename a Universe.
- Add, move, edit, and connect nodes without a blank screen.
- Test Formula Builder using `@`, node double-click, and operator buttons.
- Save and compare a scenario.
- Export Graph, Structure, and Root Map to PNG/JPG/SVG.
- Test Owner, Editor, and Viewer access using two accounts.
- Revoke an invitation and confirm access is removed.

The single-file `Universe_Mapper_Final_v1_7_Preview.html` is provided only for offline acceptance testing. Deploy the Vite project, not that preview file, for production.

## Stage 1 stabilization additions

- Firestore autosave runs only after an actual edit and waits 1.2 seconds after the last change.
- Firestore acknowledgements and remote snapshots do not clear local Undo/Redo history.
- Owned, shared, and invited Universe queries load independently, so one denied query cannot erase successful results.
- Undo/Redo are available directly in the workspace toolbar.
- Selected shapes can be resized with the lower-right handle.
- Drag a connector from the top, right, bottom, or left handle and drop it on another shape.
- Circle is available from **Insert → Circle** and the node type selector.
- Open `Business_Performance_Mind_Map_Simulation_Sample.json` for a concrete mind map with three formulas and two scenarios.
