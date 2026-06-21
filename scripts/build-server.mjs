import { build } from "esbuild";
import { copyFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Self-contained production server bundle.
//
// Why this exists: the Replit deploy upload excludes node_modules (the full tree
// is multi-GB and times out the uploader), and the runtime VM image does not
// reliably carry build-phase node_modules. So the production server must run
// WITHOUT a node_modules tree. esbuild inlines every dependency into a single
// file (dist/server.mjs) that boots with zero runtime install. The deployment
// run command is `node dist/server.mjs`.
//
// External deps that must NOT be inlined:
//  - pg-native / pg-cloudflare / bufferutil / utf-8-validate: optional native/edge
//    deps with pure-JS fallbacks inside pg / ws, so absent-at-runtime is harmless.
//  - bcrypt: a real native module (loads a prebuilt .node via node-gyp-build and
//    needs a real __dirname); it cannot be bundled. It is shipped instead as a
//    pinned tree under dist/node_modules (see NATIVE_DEPS below).
const EXTERNAL = ["pg-native", "pg-cloudflare", "bufferutil", "utf-8-validate", "bcrypt"];

// Native deps copied verbatim into dist/node_modules so the bundle's
// require("bcrypt") resolves at runtime with zero npm install. node-addon-api is
// build-time only (prebuilds already exist) and is intentionally omitted.
const NATIVE_DEPS = ["bcrypt", "node-gyp-build"];

mkdirSync(path.join(ROOT, "dist"), { recursive: true });

await build({
  entryPoints: [path.join(ROOT, "server", "app.mjs")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: path.join(ROOT, "dist", "server.mjs"),
  external: EXTERNAL,
  banner: {
    js: [
      "import { createRequire as __createRequire } from 'node:module';",
      "const require = __createRequire(import.meta.url);",
    ].join("\n"),
  },
  logLevel: "info",
});

// ensureSchema replays this canonical SQL on every boot; ship the current copy
// next to the bundle so prod schema never drifts from source.
copyFileSync(
  path.join(ROOT, "server", "db", "schema.canonical.sql"),
  path.join(ROOT, "dist", "schema.canonical.sql"),
);

// PHASE115D6_PACKAGE_CLIENT_DIST_FOR_REPLIT_DEPLOY
// Replit Deployments run dist/server.mjs. Package the current Vite frontend
// inside dist so the deployed server can serve the same freshly built assets.
const packagedClientDist = path.join(ROOT, "dist", "client", "dist");
rmSync(packagedClientDist, { recursive: true, force: true });
cpSync(path.join(ROOT, "client", "dist"), packagedClientDist, {
  recursive: true,
  dereference: true,
});

// Stage the pinned native-dep tree under dist/node_modules so require("bcrypt")
// resolves at runtime with no npm install. Rebuilt fresh every time so the
// shipped tree always matches the installed version.
const distModules = path.join(ROOT, "dist", "node_modules");
rmSync(distModules, { recursive: true, force: true });
mkdirSync(distModules, { recursive: true });
for (const dep of NATIVE_DEPS) {
  cpSync(path.join(ROOT, "node_modules", dep), path.join(distModules, dep), {
    recursive: true,
    dereference: true,
  });
}

console.log(
  `[build-server] dist/server.mjs + dist/schema.canonical.sql + dist/node_modules/{${NATIVE_DEPS.join(",")}} written`,
);
