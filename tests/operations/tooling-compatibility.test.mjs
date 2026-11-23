import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, mkdir, readFile, rm, writeFile, appendFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);
const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

test("typed project-service linting preserves its glob allowlist", { timeout: 30_000 }, async t => {
  const parser = require("@typescript-eslint/parser");
  const plugin = require("@typescript-eslint/eslint-plugin");
  const { ESLint } = require("eslint");
  const fixture = await mkdtemp(path.join(os.tmpdir(), "mmhb-typed-lint-"));
  const source = "const value: number = 1;\nPromise.resolve(value);\n";
  try {
    await mkdir(path.join(fixture, "src"));
    await writeFile(path.join(fixture, "src/included.ts"), "export const included = 1;\n");
    await writeFile(path.join(fixture, "tsconfig.json"), JSON.stringify({
      compilerOptions: { strict: true, target: "ES2022" }, include: ["src/*.ts"],
    }));
    const cases = [
      ["wildcard", "config/lint.ts", "config/*.ts", true],
      ["brace expansion", "config/lint.ts", "config/*.{ts,cts}", true],
      ["extension glob", "config/lint.ts", "config/*.@(ts|cts)", true],
      ["dotfile", ".lint.ts", "*.ts", true],
      ["wrong extension", "config/lint.ts", "config/*.js", false],
      ["sibling directory", "settings/lint.ts", "config/*.ts", false],
    ];
    for (const [name, relativePath, pattern, allowed] of cases) {
      await t.test(name, async () => {
        parser.clearCaches();
        const filePath = path.join(fixture, relativePath);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, source);
        const eslint = new ESLint({
          cwd: fixture, overrideConfigFile: true,
          overrideConfig: [{
            files: ["**/*.ts"],
            languageOptions: {
              parser,
              parserOptions: {
                tsconfigRootDir: fixture,
                projectService: { allowDefaultProject: [pattern], defaultProject: "tsconfig.json" },
                ecmaVersion: "latest", sourceType: "module",
              },
            },
            plugins: { "@typescript-eslint": plugin },
            rules: { "@typescript-eslint/no-floating-promises": "error" },
          }],
        });
        const [result] = await eslint.lintText(source, { filePath });
        if (allowed) {
          assert.equal(result.fatalErrorCount, 0, JSON.stringify(result.messages));
          assert.equal(result.messages.length, 1);
          assert.equal(result.messages[0].ruleId, "@typescript-eslint/no-floating-promises");
        } else {
          assert.equal(result.fatalErrorCount, 1);
          assert.match(result.messages[0].message, /not found by the project service/);
        }
      });
    }
  } finally {
    parser.clearCaches();
    await rm(fixture, { recursive: true, force: true });
  }
});

test("nodemon ignores excluded globs and restarts for watched JavaScript", { timeout: 30_000 }, async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "mmhb-nodemon-"));
  const startsFile = path.join(fixture, "starts.jsonl");
  let monitor;
  let output = "";
  const starts = async () => {
    try { return (await readFile(startsFile, "utf8")).trim().split("\n").filter(Boolean).map(JSON.parse); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  };
  const awaitStarts = async count => {
    const deadline = Date.now() + 6_000;
    while (Date.now() < deadline) {
      const values = await starts();
      if (values.length >= count) return values;
      assert.equal(monitor.exitCode, null, `nodemon exited: ${output}`);
      await pause(50);
    }
    assert.fail(`Timed out waiting for ${count} synthetic starts: ${output}`);
  };
  const ignored = [
    "src/example.test.js", "src/cache/value.js", "src/generated.mjs",
    "src/ignored/value.js", "src/fixtures/value.js", "src/styles.css", "outside.js",
  ];
  try {
    for (const relativePath of ["src/main.js", "src/nested/module.mjs", ...ignored]) {
      const filePath = path.join(fixture, relativePath);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, "// synthetic fixture\n");
    }
    await writeFile(path.join(fixture, "app.cjs"), [
      'const fs = require("node:fs");',
      'fs.appendFileSync("starts.jsonl", JSON.stringify({pid:process.pid})+"\\n");',
      "setInterval(() => {}, 1000);",
    ].join("\n"));
    await writeFile(path.join(fixture, "nodemon.json"), JSON.stringify({
      watch: ["src"], ext: "js,mjs", delay: "100ms",
      ignore: ["**/*.test.js", "**/cache/**", "**/generated.@(js|mjs)", "**/{ignored,fixtures}/**"],
      exec: process.execPath,
    }));
    const nodemonBin = path.join(path.dirname(require.resolve("nodemon/package.json")), "bin/nodemon.js");
    const windowsRoot = process.platform === "win32" ? process.env.SystemRoot || "C:\\Windows" : null;
    const systemBins = windowsRoot ? [path.join(windowsRoot, "System32")] : ["/usr/bin", "/bin"];
    monitor = spawn(process.execPath, [nodemonBin, "--no-update-notifier", "--config", "nodemon.json", "app.cjs"], {
      cwd: fixture,
      env: {
        PATH: [path.dirname(process.execPath), ...systemBins].join(path.delimiter),
        NODE_ENV: "test", NO_COLOR: "1",
        ...(windowsRoot ? { SystemRoot: windowsRoot } : {}),
      },
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    monitor.stdout.on("data", data => { output = (output + data).slice(-8_000); });
    monitor.stderr.on("data", data => { output = (output + data).slice(-8_000); });
    // Handle launch errors without leaving an unhandled EventEmitter error.
    monitor.on("error", error => { output = String(error); });
    await awaitStarts(1);
    await pause(750); // Allow the watcher to finish registering the fixture tree.
    for (const relativePath of ignored) await appendFile(path.join(fixture, relativePath), "// ignored edit\n");
    await pause(1_000);
    assert.equal((await starts()).length, 1, `Ignored paths caused a restart: ${output}`);
    await appendFile(path.join(fixture, "src/main.js"), "// watched edit\n");
    await awaitStarts(2);
    await appendFile(path.join(fixture, "src/nested/module.mjs"), "// watched nested edit\n");
    const values = await awaitStarts(3);
    assert.equal(values.length, 3);
    assert.equal(new Set(values.map(value => value.pid)).size, 3);
  } finally {
    if (monitor?.pid) {
      const exited = new Promise(resolve => {
        if (monitor.exitCode !== null || monitor.signalCode !== null) resolve();
        else monitor.once("exit", resolve);
      });
      try {
        if (process.platform === "win32") monitor.kill("SIGTERM");
        else process.kill(-monitor.pid, "SIGTERM");
      } catch (error) { if (error.code !== "ESRCH") throw error; }
      await Promise.race([exited, pause(1_000)]);
      // Explicitly clean up every synthetic app PID, including on Windows.
      for (const { pid } of await starts()) {
        if (Number.isSafeInteger(pid) && pid > 1) {
          try { process.kill(pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") throw error; }
        }
      }
      if (monitor.exitCode === null && monitor.signalCode === null) {
        try {
          if (process.platform === "win32") monitor.kill("SIGKILL");
          else process.kill(-monitor.pid, "SIGKILL");
        } catch (error) { if (error.code !== "ESRCH") throw error; }
        await Promise.race([exited, pause(1_000)]);
      }
    }
    await rm(fixture, { recursive: true, force: true });
  }
});
