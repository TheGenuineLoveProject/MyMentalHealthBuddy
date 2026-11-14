import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, writeFile, readFile, readdir, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const exec = promisify(execFile);
const backupScript = new URL("../../scripts/db/backup-database.sh", import.meta.url).pathname;
const restoreScript = new URL("../../scripts/db/verify-restore.sh", import.meta.url).pathname;
const criticalTables = ["users", "journals", "moods", "subscriptions", "password_reset_tokens",
  "user_preferences", "wellness_goals", "biometric_connections", "biometric_readings",
  "healing_journeys", "user_journey_progress"];

async function fixture(t) {
  const cwd = await mkdtemp(join(tmpdir(), "mmhb-backup-fixture-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const bin = join(cwd, "bin");
  await mkdir(bin);
  async function tool(name, source) {
    await writeFile(join(bin, name), `#!${process.execPath}\n${source}`, { mode: 0o700 });
  }
  await tool("date", 'console.log("20261114T000000Z");');
  await tool("pg_dump", `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    const output = args[args.indexOf("--file") + 1];
    fs.writeFileSync(output, process.env.DUMP_MODE === "empty" ? "" : process.env.DUMP_CONTENT);
    fs.appendFileSync(process.env.FIXTURE_LOG, JSON.stringify({ tool: "pg_dump", output,
      mode: fs.statSync(output).mode & 0o777 }) + "\\n");
    if (process.env.DUMP_MODE === "collision") {
      const path = require("node:path");
      const final = path.join(path.dirname(output), path.basename(output).replace(/^\\./, "") + ".sql");
      fs.writeFileSync(final, "-- preexisting backup must survive\\n");
    }
    if (process.env.DUMP_MODE === "fail") process.exit(2);
  `);
  await tool("psql", `
    const fs = require("node:fs");
    const args = process.argv.slice(2);
    fs.appendFileSync(process.env.FIXTURE_LOG, JSON.stringify({ tool: "psql", args }) + "\\n");
    if (args.includes("-f")) {
      if (process.env.RESTORE_MODE === "fail") process.exit(2);
    } else {
      if (process.env.RESTORE_MODE === "query-fail") process.exit(2);
      const missing = (process.env.MISSING_TABLES || "").split("\\n").filter(Boolean);
      const query = args.at(-1);
      const rows = query.includes("NOT EXISTS") ? missing : ${JSON.stringify(criticalTables)}.filter(name => !missing.includes(name));
      if (rows.length) console.log(rows.join("\\n"));
    }
  `);
  const env = {
    PATH: `${bin}:/usr/bin:/bin`,
    DATABASE_URL: "postgresql://synthetic.invalid/fixture_source",
    RESTORE_DATABASE_URL: "postgresql://synthetic.invalid/fixture_restore",
    FIXTURE_LOG: join(cwd, "calls.jsonl"), DUMP_CONTENT: "-- synthetic SQL fixture\n",
  };
  const run = async (script, extra = {}) => {
    try {
      const result = await exec("/bin/bash", ["-c", 'umask 022; exec /bin/bash "$1"', "fixture", script], {
        cwd, env: { ...env, ...extra }, timeout: 5000,
      });
      return { code: 0, ...result };
    } catch (error) {
      if (error.killed) throw error;
      return { code: error.code, stdout: error.stdout, stderr: error.stderr };
    }
  };
  const calls = async () => {
    try { return (await readFile(env.FIXTURE_LOG, "utf8")).trim().split("\n").filter(Boolean).map(JSON.parse); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  };
  const files = async () => readdir(join(cwd, "backups/db"));
  const backupFile = join(cwd, "input.sql");
  await writeFile(backupFile, "-- synthetic restore fixture\n");
  return { cwd, run, calls, files, backupFile };
}

test("same-second backups are distinct and private during dump", async t => {
  const f = await fixture(t);
  const [first, second] = await Promise.all([
    f.run(backupScript, { DUMP_CONTENT: "-- first backup\n" }),
    f.run(backupScript, { DUMP_CONTENT: "-- second backup\n" }),
  ]);
  assert.equal(first.code, 0, first.stderr);
  assert.equal(second.code, 0, second.stderr);
  const files = await f.files();
  assert.equal(files.length, 2, "same-second runs must not overwrite");
  assert.ok(files.every(name => !name.startsWith(".") && name.endsWith(".sql")));
  const contents = await Promise.all(files.map(name => readFile(join(f.cwd, "backups/db", name), "utf8")));
  assert.deepEqual(contents.sort(), ["-- first backup\n", "-- second backup\n"]);
  assert.ok((await f.calls()).every(call => call.mode === 0o600), "dump must be private before completion");
  for (const name of files) assert.equal((await stat(join(f.cwd, "backups/db", name))).mode & 0o777, 0o600);
});

test("publication refuses to overwrite a destination and removes its temporary dump", async t => {
  const f = await fixture(t);
  const result = await f.run(backupScript, { DUMP_MODE: "collision" });
  assert.notEqual(result.code, 0);
  assert.doesNotMatch(result.stdout, /DATABASE BACKUP PASS/);
  const files = await f.files();
  assert.equal(files.length, 1);
  assert.ok(files[0].endsWith(".sql"));
  assert.equal(await readFile(join(f.cwd, "backups/db", files[0]), "utf8"), "-- preexisting backup must survive\n");
});

test("a failed subsequent dump preserves the earlier successful backup", async t => {
  const f = await fixture(t);
  assert.equal((await f.run(backupScript)).code, 0);
  const before = await f.files();
  assert.notEqual((await f.run(backupScript, { DUMP_MODE: "fail" })).code, 0);
  assert.deepEqual(await f.files(), before);
  assert.equal(await readFile(join(f.cwd, "backups/db", before[0]), "utf8"), "-- synthetic SQL fixture\n");
});

test("backup is private while pg_dump writes it", async t => {
  const f = await fixture(t);
  const result = await f.run(backupScript);
  assert.equal(result.code, 0, result.stderr);
  assert.equal((await f.calls())[0].mode, 0o600);
});

for (const mode of ["fail", "empty"]) {
  test(`failed or empty dump (${mode}) leaves no published or temporary file`, async t => {
    const f = await fixture(t);
    const result = await f.run(backupScript, { DUMP_MODE: mode });
    assert.notEqual(result.code, 0);
    assert.doesNotMatch(result.stdout, /DATABASE BACKUP PASS/);
    assert.deepEqual(await f.files(), []);
  });
}

test("missing critical tables fail restore verification", async t => {
  const f = await fixture(t);
  const result = await f.run(restoreScript, { BACKUP_FILE: f.backupFile, MISSING_TABLES: criticalTables.join("\n") });
  assert.notEqual(result.code, 0, result.stdout);
  assert.doesNotMatch(result.stdout, /DATABASE RESTORE VERIFY PASS/);
});

test("one missing critical table fails restore verification", async t => {
  const f = await fixture(t);
  const result = await f.run(restoreScript, { BACKUP_FILE: f.backupFile, MISSING_TABLES: "password_reset_tokens" });
  assert.notEqual(result.code, 0, result.stdout);
  assert.match(result.stdout, /password_reset_tokens/);
});

for (const mode of ["missing", "empty"]) {
  test(`rejects ${mode} input before psql`, async t => {
    const f = await fixture(t);
    if (mode === "empty") await writeFile(f.backupFile, "");
    const result = await f.run(restoreScript, { BACKUP_FILE: mode === "missing" ? `${f.backupFile}.missing` : f.backupFile });
    assert.notEqual(result.code, 0);
    assert.deepEqual(await f.calls(), []);
  });
}

for (const mode of ["fail", "query-fail"]) {
  test(`propagates psql ${mode} without success claim`, async t => {
    const f = await fixture(t);
    const result = await f.run(restoreScript, { BACKUP_FILE: f.backupFile, RESTORE_MODE: mode });
    assert.notEqual(result.code, 0);
    assert.doesNotMatch(result.stdout, /DATABASE RESTORE VERIFY PASS/);
    if (mode === "fail") assert.equal((await f.calls()).length, 1);
  });
}

test("successful restore checks exactly canonical runbook critical tables, without claiming records verified", async t => {
  const f = await fixture(t);
  const result = await f.run(restoreScript, { BACKUP_FILE: f.backupFile });
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /DATABASE RESTORE VERIFY PASS/);
  assert.match(result.stdout, /record.*not.*verif/i);
  const calls = await f.calls();
  assert.equal(calls.length, 2);
  const query = calls[1].args.at(-1);
  for (const table of criticalTables) assert.ok(query.includes(`'${table}'`), table);
  assert.match(query, /BASE TABLE/);
  const runbook = await readFile(new URL("../../docs/operations/backup-disaster-recovery-runbook.md", import.meta.url), "utf8");
  const documented = runbook.split("Critical:\n")[1].split("\n\n")[0].split("\n").map(line => line.slice(2));
  assert.deepEqual([...criticalTables].sort(), documented.sort());
  const schema = await readFile(new URL("../../shared/schema.mjs", import.meta.url), "utf8");
  for (const table of criticalTables) assert.ok(schema.includes(`pgTable("${table}"`), table);
});
