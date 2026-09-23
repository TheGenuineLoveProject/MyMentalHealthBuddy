import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));

function write(root, relativePath, contents = "") {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "governor-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = spawnSync("git", ["init", "--quiet"], {
    cwd: root,
    encoding: "utf8",
    env: { PATH: process.env.PATH || "" },
  });
  assert.equal(git.status, 0, git.stderr);
  return root;
}

function copyGovernorScript(root, name) {
  write(
    root,
    `scripts/governor/${name}`,
    fs.readFileSync(path.join(sourceDirectory, name), "utf8"),
  );
}

function boundaryFixture(t) {
  const root = fixture(t);
  copyGovernorScript(root, "verify-boundaries.mjs");
  write(root, "package.json", JSON.stringify({
    type: "module",
    main: "server/app.mjs",
    scripts: {
      start: "node server/app.mjs",
      dev: "node server/app.mjs",
    },
  }));
  for (const directory of [
    "server/routes",
    "server/middleware",
    "server/security",
    "server/services",
    "server/utils",
  ]) {
    write(root, `${directory}/.keep`, "");
  }
  for (const file of [
    "server/app.mjs",
    "server/routes/ai.mjs",
    "server/routes/auth.mjs",
    "server/routes/session-boundary.mjs",
    "server/security/csrf.mjs",
  ]) {
    write(root, file, "export {};\n");
  }
  return root;
}

function run(root, relativePath, args = []) {
  return spawnSync(process.execPath, [relativePath, ...args], {
    cwd: root,
    encoding: "utf8",
    env: { PATH: process.env.PATH || "" },
  });
}

function output(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}

test("boundary verifier accepts a meaningful ESM runtime baseline", (t) => {
  const root = boundaryFixture(t);
  write(root, ".archive/retired.mjs.bak", "archived\n");

  const result = run(root, "scripts/governor/verify-boundaries.mjs");

  assert.equal(result.status, 0, output(result));
  assert.match(result.stdout, /RUNTIME_ARCHIVE_BOUNDARIES PASS \(0 findings\)/);
});

test("boundary verifier rejects package entry-point drift", (t) => {
  const root = boundaryFixture(t);
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  pkg.main = "server/legacy.mjs";
  pkg.scripts.start = "node server/legacy.mjs";
  pkg.scripts.dev = "vite";
  write(root, "package.json", JSON.stringify(pkg));

  const result = run(root, "scripts/governor/verify-boundaries.mjs");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /FAIL main must be server\/app\.mjs/);
  assert.match(result.stderr, /FAIL start must run node server\/app\.mjs/);
  assert.match(result.stderr, /FAIL dev must run node server\/app\.mjs/);
});

test("boundary verifier reports runtime backups, TypeScript twins, and archive violations", (t) => {
  const root = boundaryFixture(t);
  write(root, "server/routes/twin.ts", "export {};\n");
  write(root, "server/routes/twin.mjs", "export {};\n");
  write(root, "server/services/handler.mjs.bak", "backup\n");
  write(root, "notes/retired.bak", "backup outside an archive zone\n");

  const result = run(root, "scripts/governor/verify-boundaries.mjs");
  const combined = output(result);

  assert.equal(result.status, 1);
  assert.match(combined, /Runtime backup: server\/services\/handler\.mjs\.bak/);
  assert.match(combined, /TypeScript in governed runtime: server\/routes\/twin\.ts/);
  assert.match(combined, /Mixed runtime twin: server\/routes\/twin\.ts/);
  assert.match(combined, /Backup outside archive zones: notes\/retired\.bak/);
  assert.match(combined, /RUNTIME_ARCHIVE_BOUNDARIES FAIL \(5 findings\)/);
});

const checks = [
  "scripts/governance/verify-registry-schemas.mjs",
  "scripts/governance/verify-api-contract-lock.mjs",
  "scripts/governance/audit-registry-semantics.mjs",
  "scripts/governor/verify-boundaries.mjs",
  "scripts/governor/refactor-report.mjs",
];

function governorFixture(t, scripts = {}) {
  const root = fixture(t);
  write(root, "package.json", JSON.stringify({ type: "module" }));
  copyGovernorScript(root, "run-governor.mjs");
  for (const checker of checks) {
    write(root, checker, scripts[checker] ?? 'console.log("synthetic check passed");\n');
  }
  return root;
}

test("governor preflight fails closed when any checker is missing", (t) => {
  const root = governorFixture(t);
  fs.rmSync(path.join(root, "scripts/governor/refactor-report.mjs"));

  const result = run(root, "scripts/governor/run-governor.mjs");

  assert.equal(result.status, 1);
  assert.match(output(result), /Missing governor check: scripts\/governor\/refactor-report\.mjs/);
  assert.doesNotMatch(result.stdout, /synthetic check passed/);
});

test("governor propagates a nonzero checker and still runs subsequent checks", (t) => {
  const root = governorFixture(t, {
    [checks[0]]: 'console.error("deliberate schema failure"); process.exitCode = 7;\n',
    [checks[4]]: 'import fs from "node:fs"; fs.writeFileSync("subsequent-ran", "yes");\n',
  });

  const result = run(root, "scripts/governor/run-governor.mjs");

  assert.equal(result.status, 1);
  assert.match(output(result), /deliberate schema failure/);
  assert.match(output(result), /FAIL governor check: registry schemas/);
  assert.match(result.stdout, /GOVERNOR FAIL \(1 failed checks\)/);
  assert.equal(fs.readFileSync(path.join(root, "subsequent-ran"), "utf8"), "yes");
});

test("semantic audit receives --no-write, emits its failure, and leaves data untouched", (t) => {
  const semanticChecker = [
    'import fs from "node:fs";',
    'const data = fs.readFileSync("registry.json", "utf8");',
    'if (!process.argv.includes("--no-write")) fs.writeFileSync("registry.json", "rewritten");',
    'if (data.includes("invalid")) {',
    '  console.error("semantic failure: invalid registry");',
    '  process.exitCode = 1;',
    '}',
    "",
  ].join("\n");
  const root = governorFixture(t, {
    [checks[2]]: semanticChecker,
    [checks[3]]: 'console.log("boundary check after semantics passed");\n',
  });
  const original = '{"status":"invalid"}\n';
  write(root, "registry.json", original);

  const direct = run(root, checks[2], ["--no-write"]);
  assert.equal(direct.status, 1);
  assert.match(output(direct), /semantic failure: invalid registry/);
  assert.equal(fs.readFileSync(path.join(root, "registry.json"), "utf8"), original);

  const result = run(root, "scripts/governor/run-governor.mjs");

  assert.equal(result.status, 1);
  assert.match(output(result), new RegExp(output(direct).trim()));
  assert.match(output(result), /FAIL governor check: prompt registry semantics/);
  assert.match(result.stdout, /boundary check after semantics passed/);
  assert.match(result.stdout, /GOVERNOR FAIL \(1 failed checks\)/);
  assert.equal(fs.readFileSync(path.join(root, "registry.json"), "utf8"), original);
});