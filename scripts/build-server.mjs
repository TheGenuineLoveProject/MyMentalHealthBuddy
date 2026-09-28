import * as fs from "node:fs";
import { createRequire } from "node:module";
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
// with a small packaged node_modules tree. esbuild bundles the application;
// runtime dependencies are copied below without a runtime install. The deployment
// run command is `node dist/server.mjs`.
//
// External deps that must NOT be inlined:
//  - pg-native / pg-cloudflare / bufferutil / utf-8-validate: optional native/edge
//    deps with pure-JS fallbacks inside pg / ws, so absent-at-runtime is harmless.
//  - bcrypt: a real native module (loads a prebuilt .node via node-gyp-build and
//    needs a real __dirname); it cannot be bundled. It is shipped instead as a
//    pinned tree under dist/node_modules (see packageRuntime below).
const EXTERNAL = ["pg-native", "pg-cloudflare", "bufferutil", "utf-8-validate", "bcrypt"];


mkdirSync(path.join(ROOT, "dist"), { recursive: true });

await build({
  entryPoints: [path.join(ROOT, "server", "app.mjs")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node24",
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

// Copy installed runtime dependencies, preserving nested versions.
function packageRuntime(root, destination) {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const modules = path.join(root, 'node_modules') + path.sep;
  const found = new Map();
  const stable = object => JSON.stringify(Object.entries(object || {}).sort());
  function visit(name, from, optional = false) {
    if (!/^(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+$/i.test(name)) throw Error('INVALID_PACKAGE_NAME');
    const search = createRequire(path.join(from, 'package.json')).resolve.paths(name) || [];
    let folder;
    for (const base of search) {
      const candidate = path.join(base, name);
      if (candidate.startsWith(modules) && fs.existsSync(path.join(candidate, 'package.json'))) {
        folder = candidate; break;
      }
    }
    if (!folder) { if (optional) return; throw Error('MISSING_INSTALLED_DEPENDENCY: ' + name); }
    if (fs.realpathSync(folder) !== folder) throw Error('LINKED_PACKAGE_REVIEW_REQUIRED: ' + name);
    const relative = path.relative(root, folder).split(path.sep).join('/');
    if (found.has(relative)) return;
    const pkg = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'));
    const pinned = lock.packages?.[relative];
    if (!pinned || pinned.link || pkg.name !== name || pkg.version !== pinned.version)
      throw Error('LOCK_MISMATCH: ' + relative);
    for (const field of ['dependencies','optionalDependencies','peerDependencies'])
      if (stable(pkg[field]) !== stable(pinned[field])) throw Error('DEPENDENCY_METADATA_MISMATCH: ' + relative);
    found.set(relative, folder);
    if (found.size > 100) throw Error('DEPENDENCY_SET_REVIEW_REQUIRED');
    for (const dep of Object.keys(pkg.dependencies || {}))
      visit(dep, folder, Object.hasOwn(pkg.optionalDependencies || {}, dep));
    for (const dep of Object.keys(pkg.optionalDependencies || {})) visit(dep, folder, true);
    for (const dep of Object.keys(pkg.peerDependencies || {}))
      visit(dep, folder, pkg.peerDependenciesMeta?.[dep]?.optional === true);
  }
  for (const name of ['bcrypt','node-gyp-build','speakeasy','base32.js','qrcode']) visit(name, root);
  const entries = [...found].sort((a,b) => a[0].split('/').length - b[0].split('/').length || a[0].localeCompare(b[0]));
  if (destination) for (const [relative, folder] of entries) {
    const output = path.join(destination, relative);
    fs.mkdirSync(path.dirname(output), {recursive:true});
    fs.cpSync(folder, output, {recursive:true, dereference:true, filter:source => {
      if (path.relative(folder, source).split(path.sep).includes('node_modules')) return false;
      const actual = fs.realpathSync(source);
      if (actual !== folder && !actual.startsWith(folder + path.sep)) throw Error('PACKAGE_SYMLINK_ESCAPES: ' + relative);
      return true;
    }});
  }
  return entries.map(([relative]) => relative);
}
const packaged = packageRuntime(ROOT);
rmSync(path.join(ROOT,"dist","node_modules"), {recursive:true,force:true});
packageRuntime(ROOT, path.join(ROOT,"dist"));
console.log("[build-server] runtime packages copied:", packaged.length);
