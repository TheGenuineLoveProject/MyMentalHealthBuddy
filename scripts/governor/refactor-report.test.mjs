import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { generateRefactorReport } from "./refactor-report.mjs";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "refactor-report-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const directory of ["client/src", "server/routes", "shared"]) {
    fs.mkdirSync(path.join(root, directory), { recursive: true });
  }
  return root;
}

function write(root, relativePath, contents = "") {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

test("reports deterministic paths and counts without exposing route literals", (t) => {
  const root = fixture(t);
  write(root, "client/src/same.ts", "export const client = true;\n");
  write(root, "shared/same.ts", "export const shared = true;\n");
  write(root, "server/legacy.ts", "export {};\n");
  write(root, "server/old.mjs.bak-1", "backup\n");
  write(
    root,
    "server/routes/example.mjs",
    [
      'router.get("/private/account/:id", handler);',
      'router.get("/private/account/:id", otherHandler);',
      'router.post("/only-once", handler);',
      "",
    ].join("\n"),
  );

  const first = generateRefactorReport(root);
  const second = generateRefactorReport(root);

  assert.deepEqual(first, second);
  assert.deepEqual(first.duplicateBasenames, [{
    basename: "same.ts",
    count: 2,
    paths: ["client/src/same.ts", "shared/same.ts"],
  }]);
  assert.deepEqual(first.runtimeBackups, ["server/old.mjs.bak-1"]);
  assert.deepEqual(first.serverTypeScriptFiles, ["server/legacy.ts"]);
  assert.deepEqual(first.duplicateRouteSignatures.findings, [{
    path: "server/routes/example.mjs",
    signatures: [{ method: "GET", occurrences: 2 }],
  }]);
  assert.match(first.duplicateRouteSignatures.classification, /advisory heuristic/);

  const serialized = JSON.stringify(first);
  assert.doesNotMatch(serialized, /private|account|only-once/);
});

test("fails when a mandatory root is missing", (t) => {
  const root = fixture(t);
  fs.rmSync(path.join(root, "shared"), { recursive: true });
  assert.throws(() => generateRefactorReport(root), /Missing mandatory root: shared/);
});

test("refuses symlinks instead of traversing them", (t) => {
  const root = fixture(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "refactor-report-outside-"));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.writeFileSync(path.join(outside, "secret.ts"), "sensitive source\n");
  fs.symlinkSync(outside, path.join(root, "server", "escaped"));

  assert.throws(
    () => generateRefactorReport(root),
    /Symbolic link refused: server\/escaped/,
  );
});

test("fails closed for inputs without read permission bits", (t) => {
  const root = fixture(t);
  const unreadable = path.join(root, "shared", "unreadable.ts");
  fs.writeFileSync(unreadable, "source\n");
  fs.chmodSync(unreadable, 0o000);

  assert.throws(
    () => generateRefactorReport(root),
    /Unreadable input: shared\/unreadable.ts/,
  );
});