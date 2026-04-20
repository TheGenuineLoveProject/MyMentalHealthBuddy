Archived legacy AI entry path.

Archived files:
- server/index.js
- server/routes/ai.js

Reason:
These files represented a legacy alternate runtime path outside the canonical locked contract surface.

Canonical runtime files:
- server/app.mjs
- server/routes/ai.mjs

Do not re-import or re-activate these archived files without a fresh verification pass.

Required verification after archival:
- npm run routes:manifest
- npm run pretest
- npm run verify
