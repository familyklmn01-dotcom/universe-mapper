export const demoGuide = {
  id: 'universe-guided-demo-v3',
  title: 'Guided Demo — Universe Mapper',
  subtitle: 'Follow four short steps. You can still explore the available tools while the guide is visible.',
  steps: [
    {
      id: 'select-node',
      title: '1. Select a Node',
      text: 'Click the Business Operations node once. The Inspector on the right shows its Properties without moving the canvas. Notice that Marketing, Product, and Sales are children, while their lower nodes form the next hierarchy level. You can inspect the fields, then press Next.',
      target: 'node'
    },
    {
      id: 'edit-relationship',
      title: '2. Try a Relationship',
      text: 'Click a relationship line once to open Relationship Properties. You can move an endpoint to the top, right, bottom, or left side of a node. The relationship line uses orthogonal routing — no diagonal segments.',
      target: 'relationship'
    },
    {
      id: 'camera',
      title: '3. Try Camera',
      text: 'Camera saves a map viewpoint. Open Camera in the top toolbar, save the current view, then select the saved Camera to return to that zoom and position. Camera changes the viewport only; it does not change your nodes or relationships. When you understand it, press Next.',
      target: 'camera'
    },
    {
      id: 'printout',
      title: '4. Try Printout',
      text: 'Open View → Printout to see the same business model as a structured output. Try pan or zoom, then return to the canvas. When finished, press Finish demo.',
      target: 'printout'
    }
  ],
  completionTitle: 'Demo has ended',
  completionText: 'To continue using Universe Mapper, please sign in / log in.',
  completionAction: 'Sign in / Log in'
}

export const demoGuideStorageKey = 'um-guided-demo-v3'
