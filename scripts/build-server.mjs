// scripts/build-server.mjs
// Bundles the entire Node server (server/app.mjs + all dynamic-import routes)
// into a single self-contained ESM file at dist/server.mjs that runs WITHOUT
// the workspace's full node_modules at runtime. Used by deployment build phase
// to eliminate the cold-start `npm ci` cost and the "ERR_MODULE_NOT_FOUND:
// express" crash loop caused by node_modules not persisting from build → run
// on Replit Autoscale/VM.
//
// IMPORTANT — keep these in sync with the runtime contract:
//   - Banner injects createRequire so CJS deps (body-parser, etc.) work in ESM.
//   - `vite` and `@vitejs/plugin-react` externalized: only used in dev mode
//     (gated behind IS_DEV); never reached in production.
//   - `bcrypt` and `argon2` externalized: native modules with `.node` binaries
//     that physically cannot be bundled. We ship a minimal `dist/node_modules`
//     containing just these two (+ their tiny dep tree) in the post-bundle step.
//   - Dynamic route imports MUST be literal string `import("./routes/X.mjs")`
//     calls (see ADMIN_SUB_ROUTERS / EXTENDED_ROUTES `load:` thunks in
//     server/app.mjs). esbuild traces these statically and bundles all 112
//     route files. If you add a new route, use the same `load: () => import(...)`
//     pattern — never `file: "string"` with runtime variable lookup.
//   - Run command: `node dist/server.mjs` from the WORKSPACE ROOT (NOT `cd dist`).
//     Node still resolves externals from `dist/node_modules` because that's
//     adjacent to the importing file. `__dirname` inside the bundle resolves
//     to `<workspace>/dist`, so `path.join(__dirname, "..", "client")` in
//     server/app.mjs correctly points to the workspace `client/` directory.
//     Keeping `process.cwd()` at the workspace root is critical: several
//     modules (promptEngine, ai.healing/business audit logs, narrative-drafts,
//     sop introspection, kernel-bridge, aiTelemetry) read files via
//     `process.cwd()`-relative paths.
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

// ---- 1. Bundle the server ----
const result = await build({
  entryPoints: ["server/app.mjs"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: "dist/server.mjs",
  external: [
    "vite",
    "@vitejs/plugin-react",
    "bcrypt",
    "argon2",
  ],
  banner: {
    js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);",
  },
  legalComments: "none",
  logLevel: "info",
  metafile: false,
});
if (result.errors.length) {
  console.error("[build-server] esbuild errors:", result.errors);
  process.exit(1);
}
console.log("[build-server] dist/server.mjs ready");

// ---- 2. Install external native deps into dist/node_modules ----
// We use a stub package.json so npm treats dist/ as its own project root and
// puts everything in dist/node_modules instead of hoisting to the workspace.
mkdirSync("dist", { recursive: true });
writeFileSync(
  "dist/package.json",
  JSON.stringify(
    {
      name: "mmhb-server-bundle",
      version: "0.0.0",
      type: "module",
      private: true,
    },
    null,
    2,
  ) + "\n",
);
// Pin to the exact versions resolved by the workspace lockfile so the
// runtime native binaries match what we tested against in the bundle.
import { readFileSync } from "node:fs";
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const bcryptVersion = lock.packages["node_modules/bcrypt"]?.version;
const argon2Version = lock.packages["node_modules/argon2"]?.version;
if (!bcryptVersion || !argon2Version) {
  console.error("[build-server] could not read pinned bcrypt/argon2 versions from package-lock.json");
  process.exit(1);
}
console.log(`[build-server] installing native deps (bcrypt@${bcryptVersion}, argon2@${argon2Version}) into dist/node_modules…`);
execSync(
  `npm install --no-audit --no-fund --no-save --omit=dev bcrypt@${bcryptVersion} argon2@${argon2Version}`,
  { cwd: "dist", stdio: "inherit" },
);
console.log("[build-server] dist bundle complete — ready to run with `node dist/server.mjs` from workspace root");
