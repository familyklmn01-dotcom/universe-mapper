Universe Mapper - minimal Netlify build repair patch

Copy these files into the repository at the exact paths shown:
- src/lib/projectFormat.js
- src/lib/canvasGeometry.js
- src/lib/imageProcessing.js

Reason: src/App.jsx imports these modules, but the Netlify build of branch main cannot resolve them.
This patch only restores the three files from the provided universe-mapper-P1-P10 archive.
Do not overwrite src/App.jsx or unrelated files. Review the diff before committing.
