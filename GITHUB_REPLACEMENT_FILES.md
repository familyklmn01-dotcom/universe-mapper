# GitHub replacement guide — Stage 1 Final Stabilization

Replace or add only these files in the existing GitHub repository:

1. `src/App.jsx`
2. `src/ProductShell.jsx`
3. `src/styles.css`
4. `src/lib/store.js`
5. `README.md`
6. Add `Business_Performance_Mind_Map_Simulation_Sample.json`
7. Optional offline test file: `Universe_Mapper_Final_v1_7_Preview.html`

No Firebase configuration or Firestore Rules change is required for this stabilization release.

After committing the replacements, Netlify should automatically run `npm run build` and publish `dist`.

## Quick acceptance test

1. Sign in and open a cloud Universe.
2. Move a node several times, wait about two seconds, then test Undo and Redo.
3. Return to My Universes and confirm the cloud card remains visible.
4. Open Profile, test Continue Editing and Back to My Universes.
5. Select a node, resize it from the lower-right handle.
6. Drag any of the four circular connector handles to another node and choose the relationship type.
7. Insert a Circle node.
8. Open the supplied mind-map JSON, then inspect Formula and Simulation.
