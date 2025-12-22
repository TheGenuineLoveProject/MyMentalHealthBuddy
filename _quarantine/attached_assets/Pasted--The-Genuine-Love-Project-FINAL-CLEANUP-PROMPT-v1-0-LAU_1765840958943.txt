# The Genuine Love Project — FINAL CLEANUP PROMPT (v1.0 LAUNCH READY)

You are Replit’s coding agent inside this repo. Your job is to make the project run reliably on Replit Autoscale and be ready for v1.0 release.

## HARD RULES
- Do NOT print or request secrets. Never commit .env.
- Keep one server public port: use process.env.PORT (Replit).
- If you change config, keep it minimal and reversible.

---

## PHASE A — Fix the current crash (package.json invalid JSON)
### A1) Validate package.json
Run:
- node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json OK')"

If it throws, the file is broken. Replace it with a valid minimal package.json that preserves ESM.

### A2) Replace package.json with this VALID baseline (then re-add deps if missing)
Replace the ENTIRE file contents of /package.json with:

{
  "name": "the-genuine-love-project",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "node server/index.mjs",
    "start": "NODE_ENV=production node server/index.mjs",
    "build": "npm run build:client",
    "build:client": "vite build",
    "test": "vitest run",
    "bundle:gpt": "node scripts/make-gpt-repair-bundle.mjs"
  }
}

Then run:
- npm install

If npm install fails due to missing deps, re-add them using npm install <pkg> and keep package.json valid JSON.

---

## PHASE B — Fix missing script + port conflict helpers
### B1) Create scripts/kill-port.mjs (your commit referenced it but it didn’t exist)
Create file: scripts/kill-port.mjs

Content:
import { execSync } from "node:child_process";

const port = process.argv[2] || process.env.PORT || "5000";

function run(cmd) {
  try { execSync(cmd, { stdio: "ignore" }); } catch {}
}

// Prefer fuser, fallback lsof if available
run(`bash -lc "command -v fuser >/dev/null 2>&1 && fuser -k ${port}/tcp >/dev/null 2>&1 || true"`);
run(`bash -lc "command -v lsof >/dev/null 2>&1 && (lsof -ti tcp:${port} | xargs -r kill -9) >/dev/null 2>&1 || true"`);

console.log(`✅ Cleared port ${port} (if anything was using it).`);

### B2) Ensure server uses process.env.PORT (already shown in screenshot; verify)
In server/index.mjs confirm:
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", ...)

---

## PHASE C — Brand integration (TGLP identity everywhere)
### C1) Add brand constants
Create file: shared/brand.mjs

export const BRAND = {
  appName: "The Genuine Love Project",
  tagline: "Live in Genuine Love",
  primary: "#7FAF9B",   // Serenity Sage (adjust if you have an exact hex)
  accent:  "#D7B56D",   // Eternal Gold (adjust if you have an exact hex)
  website: "https://TheGenuineLoveProject.com"
};

### C2) Frontend: set title + meta (minimum)
- Update client/index.html (or your actual HTML entry) title to:
  <title>The Genuine Love Project — Live in Genuine Love</title>

- Add meta description (simple):
  Healing tools, journaling, and compassionate AI support to help you grow through genuine love.

### C3) Public brand assets route already exists
Your server serves /brand from public/brand. Ensure folder exists:
- public/brand/
  - logo.png
  - icon-1024.png
  - og-image.png

---

## PHASE D — Create the “Upload-to-ChatGPT bundle” that actually works
### D1) Create scripts/make-gpt-repair-bundle.mjs
Create file: scripts/make-gpt-repair-bundle.mjs

import { execSync } from "node:child_process";

const out = "gpt_repair_bundle.tgz";

// Only include safe files (NO .env, NO node_modules)
const include = [
  ".replit",
  "replit.nix",
  "package.json",
  "package-lock.json",
  "vite.config.*",
  "vitest.config.*",
  "tsconfig*.json",
  "server",
  "client",
  "src",
  "shared",
  "public",
  "scripts",
  "drizzle",
  "migrations",
  ".github",
  "README.md",
  "FINAL_CLEANUP_PROMPT.md",
  "final-deployment.log",
  "PLATFORM_360_ANALYSIS_REPORT.md"
];

function sh(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

sh(`bash -lc "rm -f ${out} && tar -czf ${out} ${include.join(" ")} 2>/dev/null || true"`);
sh(`bash -lc "ls -lh ${out} || (echo 'Bundle not created — one of the paths may not exist.' && exit 1)"`);

console.log(`✅ Created ${out}`);

### D2) Add a “bundle:gpt” script already in package.json baseline
Run:
- npm run bundle:gpt
Then download gpt_repair_bundle.tgz from Replit file pane.

---

## PHASE E — GitHub push + Actions workflow fix
### E1) Your push failed because workflow permission is missing
Fix options (choose one):

Option 1 (Best): Create a new GitHub Personal Access Token with:
- repo
- workflow
Then in Replit git auth, use that token.

Option 2 (Temporary): Do NOT push workflow changes:
- Move .github/workflows out, push, then re-add after token fixed.

---

## ACCEPTANCE CRITERIA (must pass)
- node server/index.mjs boots with no ERR_INVALID_PACKAGE_CONFIG
- App responds on /api/ready with JSON {status:"ready"} (200)
- Replit run uses process.env.PORT and binds 0.0.0.0
- npm run bundle:gpt creates gpt_repair_bundle.tgz
- Git push succeeds (or workflows excluded intentionally)

END.