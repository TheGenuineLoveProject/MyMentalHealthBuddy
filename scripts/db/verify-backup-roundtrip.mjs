#!/usr/bin/env node
// Exercise the real backup/restore scripts against an owned PostgreSQL fixture.
// No inherited application DATABASE_URL, host database, ports or volumes are used.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = fileURLToPath(new URL("../../", import.meta.url));
const image = "postgres:16";
const sourceUrl = "postgresql://postgres@127.0.0.1/mmhb_backup_source";
const restoreUrl = "postgresql://postgres@127.0.0.1/mmhb_backup_restored";
const tables = [
  "users", "journals", "moods", "subscriptions", "password_reset_tokens",
  "user_preferences", "wellness_goals", "biometric_connections",
  "biometric_readings", "healing_journeys", "user_journey_progress",
];
const dockerEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
  ["PATH", "HOME", "XDG_RUNTIME_DIR", "DOCKER_HOST", "DOCKER_CONTEXT", "DOCKER_CONFIG",
    "DOCKER_TLS_VERIFY", "DOCKER_CERT_PATH"].includes(key)));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8", timeout: 30000, maxBuffer: 1024 * 1024,
    env: dockerEnv, ...options,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${command} fixture step failed: ${result.error?.message || result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

// Docker provides the real PostgreSQL clients. Adapt file IO to host-side
// temporary backup paths, while every query stays in this isolated container.
const adapter = `#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const command = path.basename(process.argv[1]);
const args = process.argv.slice(2);
const expected = command === 'pg_dump' ? ${JSON.stringify(sourceUrl)} : ${JSON.stringify(restoreUrl)};
if (!['pg_dump','psql'].includes(command) || args[0] !== expected ||
    !/^[a-f0-9]{64}$/.test(process.env.MMHB_BACKUP_CONTAINER || '')) {
  throw new Error('Unexpected fixture database or client');
}
let input;
let output;
if (command === 'pg_dump') {
  const index = args.indexOf('--file');
  if (index < 0 || !args[index + 1]) throw new Error('Missing fixture dump output');
  output = fs.openSync(args[index + 1], 'w', 0o600);
  args.splice(index, 2);
} else {
  const index = args.indexOf('-f');
  if (index >= 0) {
    input = fs.openSync(args[index + 1], 'r');
    args.splice(index, 2, '-f', '-');
  }
}
try {
  const result = spawnSync('docker', ['exec', ...(input === undefined ? [] : ['-i']),
    process.env.MMHB_BACKUP_CONTAINER, command, ...args], {
    stdio: [input ?? 'ignore', output ?? 'inherit', 'pipe'],
    encoding: 'utf8', timeout: 20000,
  });
  if (result.error || result.status !== 0) {
    console.error(result.error?.message || result.stderr || 'Fixture PostgreSQL client failed');
    process.exitCode = 1;
  }
} finally {
  if (input !== undefined) fs.closeSync(input);
  if (output !== undefined) fs.closeSync(output);
}
`;

async function verify() {
  const imageId = run("docker", ["image", "inspect", image, "--format", "{{.Id}}"]);
  const work = fs.mkdtempSync(path.join(os.tmpdir(), "mmhb-backup-roundtrip-"));
  // The name is known before Docker starts, so cleanup still works if the
  // client times out after creation but before returning the container ID.
  const containerName = `mmhb-backup-roundtrip-${randomUUID()}`;
  let creationAttempted = false;
  let cleaned = false;
  let container;
  let receipt;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      if (creationAttempted) {
        const removed = spawnSync("docker", ["rm", "--force", containerName], {
          env: dockerEnv, encoding: "utf8", timeout: 15000,
        });
        if (removed.error || (removed.status !== 0 && !/No such container/i.test(removed.stderr || ""))) {
          throw new Error("Fixture container cleanup failed");
        }
      }
    } finally {
      fs.rmSync(work, { recursive: true, force: true });
    }
  };
  const onExit = () => {
    try { cleanup(); } catch (error) { console.error(error.message); process.exitCode = 1; }
  };
  const onInterrupt = signal => {
    try { cleanup(); } catch (error) { console.error(error.message); }
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  const onSigint = () => onInterrupt("SIGINT");
  const onSigterm = () => onInterrupt("SIGTERM");
  process.once("exit", onExit);
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);
  try {
    creationAttempted = true;
    container = run("docker", ["run", "--detach", "--rm", "--pull=never", "--network=none", "--name", containerName,
      "--label", "com.mmhb.fixture=backup-roundtrip", "--env", "POSTGRES_HOST_AUTH_METHOD=trust",
      "--env", "POSTGRES_DB=mmhb_backup_source", image]);
    assert.match(container, /^[a-f0-9]{64}$/);
    const deadline = Date.now() + 30000;
    while (true) {
      const ready = spawnSync("docker", ["exec", container, "pg_isready", "-h", "127.0.0.1", "-U", "postgres"],
        { env: dockerEnv, timeout: 3000, stdio: "ignore" });
      if (!ready.error && ready.status === 0) break;
      if (Date.now() >= deadline) throw new Error("Fixture PostgreSQL startup timed out");
      await delay(250);
    }
    const psql = (database, sql) => run("docker", ["exec", "-i", container, "psql", "-X",
      "-h", "127.0.0.1", "-U", "postgres", "-d", database, "-v", "ON_ERROR_STOP=1", "-At"], { input: sql });
    run("docker", ["exec", container, "createdb", "-h", "127.0.0.1", "-U", "postgres", "mmhb_backup_restored"]);
    const marker = table => `${table} — synthetic Ω\nline two ' "`;
    const literal = value => `'${value.replaceAll("'", "''")}'`;
    psql("mmhb_backup_source", tables.map(table =>
      `CREATE TABLE public."${table}" (id integer PRIMARY KEY, marker text);\n` +
      `INSERT INTO public."${table}" VALUES (1, ${literal(marker(table))}), (2, NULL);`
    ).join("\n"));

    const bin = path.join(work, "bin");
    fs.mkdirSync(bin, { mode: 0o700 });
    // .mjs targets preserve ESM semantics even when invoked through client names.
    const client = path.join(bin, "postgres-client.mjs");
    fs.writeFileSync(client, adapter, { mode: 0o700 });
    for (const command of ["pg_dump", "psql"]) {
      // Wrapper keeps argv[1] as the intended client name, without ESM symlink resolution.
      fs.writeFileSync(path.join(bin, command), `#!/usr/bin/env node\n` +
        `process.argv[1] = ${JSON.stringify(path.join(bin, command))};\n` +
        `import(${JSON.stringify(pathToFileURL(client).href)});\n`, { mode: 0o700 });
    }
    const env = { ...dockerEnv,
      PATH: `${bin}${path.delimiter}${path.dirname(process.execPath)}${path.delimiter}${dockerEnv.PATH || "/usr/bin:/bin"}`,
      MMHB_BACKUP_CONTAINER: container, DATABASE_URL: sourceUrl,
    };
    run("bash", [path.join(root, "scripts/db/backup-database.sh")], { cwd: work, env });
    const folder = path.join(work, "backups/db");
    const files = fs.readdirSync(folder);
    assert.equal(files.length, 1, "Only the completed backup should remain");
    assert.match(files[0], /\.sql$/);
    const backup = path.join(folder, files[0]);
    const stat = fs.statSync(backup);
    assert.ok(stat.size > 0);
    assert.equal(stat.mode & 0o777, 0o600);
    run("bash", [path.join(root, "scripts/db/verify-restore.sh")], {
      cwd: work, env: { ...env, RESTORE_DATABASE_URL: restoreUrl, BACKUP_FILE: backup },
    });
    for (const table of tables) {
      const rows = JSON.parse(psql("mmhb_backup_restored",
        `SELECT json_agg(t ORDER BY id) FROM public."${table}" AS t;`));
      assert.deepEqual(rows, [{ id: 1, marker: marker(table) }, { id: 2, marker: null }]);
    }
    receipt = { result: "PASS", scope: "Synthetic isolated PostgreSQL backup/restore roundtrip",
      image, imageId, network: "none", tablesVerified: tables.length, rowsVerified: tables.length * 2,
      privateBackupMode: "0600", productionDatabaseUsed: false,
      backupSha256: createHash("sha256").update(fs.readFileSync(backup)).digest("hex") };
  } finally {
    try {
      cleanup();
    } finally {
      process.removeListener("exit", onExit);
      process.removeListener("SIGINT", onSigint);
      process.removeListener("SIGTERM", onSigterm);
    }
  }
  console.log(JSON.stringify(receipt));
}

verify().catch(error => { console.error(error.message); process.exitCode = 1; });
