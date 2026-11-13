// Opt-in, disposable PostgreSQL + actual application HTTP qualification.
// No inherited application credentials, external providers, or live database.
import { spawn, spawnSync } from "node:child_process";
import { createHash, createDecipheriv, randomBytes } from "node:crypto";
import { mkdtemp, mkdir, writeFile, readFile, unlink, cp, readdir, realpath } from "node:fs/promises";
import { existsSync, openSync, closeSync } from "node:fs";
import { once } from "node:events";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { hasExited, stopChild } from "./process-lifecycle.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const speakeasy = require("speakeasy");
const bcrypt = require("bcrypt");
const entrypoint = process.env.MMHB_QUALIFICATION_ENTRYPOINT || "server/app.mjs";
if (!["server/app.mjs", "dist/server.mjs"].includes(entrypoint)) {
  throw new Error("Qualification entrypoint must be server/app.mjs or dist/server.mjs");
}
const bundled = entrypoint === "dist/server.mjs";
const bin = process.env.MMHB_POSTGRES_BIN;
if (!bin || !["initdb", "pg_ctl", "postgres"].every(name => existsSync(join(bin, name)))) {
  throw new Error("Set MMHB_POSTGRES_BIN to the directory containing PostgreSQL binaries");
}
if (!existsSync(join(root, "client", "dist", "index.html"))) {
  throw new Error("Build the client into client/dist or link the verified cloud build there first");
}
if (bundled && !existsSync(join(root, entrypoint))) {
  throw new Error("Build the server with node scripts/build-server.mjs first");
}

const directory = await mkdtemp("/tmp/mmhb-cloud-");
const data = join(directory, "data");
const socket = join(directory, "socket");
await mkdir(socket, { mode: 0o700 });
const log = join(directory, "runtime.log");
const logFd = openSync(log, "ax", 0o600);
const report = {
  observedAt: new Date().toISOString(),
  nodeVersion: process.version,
  postgresVersion: spawnSync(join(bin, "postgres"), ["--version"], { encoding: "utf8" }).stdout.trim(),
  scope: "Disposable PostgreSQL, NODE_ENV=test, real application HTTP; no external services",
  entrypoint,
  commit: spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout.trim(),
  sourceHashes: {}, checks: [], cleanup: {}, releaseQualified: false,
};
for (const file of ["server/app.mjs", "server/replit_integrations/auth/replitAuth.mjs",
  "server/ai/openaiClient.mjs", "server/routes/mirror.mjs", "server/routes/admin-social-studio.mjs",
  "server/routes/auth.mjs", "server/routes/account.mjs", "server/routes/journal.mjs",
  "server/auth/mfa.service.mjs", "server/services/mfaRecoveryLogin.service.mjs",
  "server/db/schema.canonical.sql", "scripts/qualification/cloud-runtime.mjs",
  "scripts/build-server.mjs", "package.json", "package-lock.json"]) {
  report.sourceHashes[file] = createHash("sha256").update(await readFile(join(root, file))).digest("hex");
}
// Exercise the actual distributable away from the checkout's node_modules.
// An artifact cannot pass by borrowing packages from the development tree.
let launchPath = join(root, entrypoint);
let launchDirectory = root;
let artifactFiles = [];
if (bundled) {
  launchDirectory = join(directory, "artifact");
  await cp(join(root, "dist"), launchDirectory, { recursive: true, errorOnExist: true, force: false });
  launchPath = join(launchDirectory, "server.mjs");
  const visit = async relative => {
    const entries = await readdir(join(launchDirectory, relative), { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const file = join(relative, entry.name);
      if (entry.isSymbolicLink()) throw new Error("Standalone artifact contains a symlink");
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile()) artifactFiles.push({ file,
        sha256: createHash("sha256").update(await readFile(join(launchDirectory, file))).digest("hex") });
      else throw new Error("Standalone artifact contains an unsupported file");
    }
  };
  await visit("");
  for (let parent = dirname(launchDirectory); ; parent = dirname(parent)) {
    if (existsSync(join(parent, "node_modules"))) {
      throw new Error("Standalone artifact has an ancestor dependency directory");
    }
    if (parent === dirname(parent)) break;
  }
  const artifactRequire = createRequire(launchPath);
  const runtimePackages = {};
  for (const name of ["bcrypt", "speakeasy", "qrcode"]) {
    const packageRoot = await realpath(join(launchDirectory, "node_modules", name));
    const modulePath = await realpath(artifactRequire.resolve(name));
    if (!packageRoot.startsWith(launchDirectory + "/node_modules/") || !modulePath.startsWith(packageRoot + "/")) {
      throw new Error("Runtime dependency resolved outside the standalone artifact");
    }
    const metadata = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
    runtimePackages[name] = { version: metadata.version, entrypoint: modulePath.slice(launchDirectory.length + 1) };
  }
  report.artifact = {
    mode: "standalone_copy_outside_checkout", fileCount: artifactFiles.length,
    sha256: createHash("sha256").update(JSON.stringify(artifactFiles)).digest("hex"),
    serverSha256: artifactFiles.find(entry => entry.file === "server.mjs")?.sha256,
    runtimePackages, ancestorNodeModulesAbsent: true, globalSearchDisabled: true,
  };
}
for (const file of ["scripts/qualification/process-lifecycle.mjs",
  "server/tests/auth-provider-config.test.mjs", "server/tests/optional-ai-startup.test.mjs",
  "server/tests/qualification-process-cleanup.test.mjs"]) {
  report.sourceHashes[file] = createHash("sha256").update(await readFile(join(root, file))).digest("hex");
}
const toolEnv = { PATH: process.env.PATH || "/usr/bin:/bin", LANG: "C.UTF-8" };
const password = randomBytes(24).toString("hex");
const pwfile = join(directory, "postgres-password");
await writeFile(pwfile, password, { mode: 0o600 });
const emptyEnv = join(directory, "empty.env");
await writeFile(emptyEnv, "", { mode: 0o600 });
let activeGate = "initialize", databaseStarted = false, app, pool;
function check(name, condition) {
  activeGate = name;
  if (!condition) throw new Error("Qualification gate failed");
  report.checks.push({ name, result: "passed" });
  console.log(`PASS ${name}`);
}
function tool(name, args) {
  const result = spawnSync(join(bin, name), args, {
    env: toolEnv, stdio: ["ignore", logFd, logFd], timeout: name === "initdb" ? 120000 : 30000,
  });
  if (result.status !== 0) throw new Error(`PostgreSQL ${name} failed`);
}
async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise(resolveClose => server.close(resolveClose));
  return port;
}
const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const sessionSecret = randomBytes(32).toString("hex");
const dbUrl = new URL("postgresql://mmhb_app@localhost/mmhb_cloud_fixture");
dbUrl.password = password;
dbUrl.searchParams.set("host", socket);
const appEnv = {
  ...toolEnv, NODE_ENV: "test", PORT: String(port), DATABASE_URL: dbUrl.href,
  DATABASE_SSL: "false", JWT_SECRET: randomBytes(32).toString("hex"),
  SESSION_SECRET: sessionSecret, DOTENV_CONFIG_PATH: emptyEnv,
};
async function api(path, { method = "GET", body, token, cookie } = {}) {
  const response = await fetch(base + path, {
    method, redirect: "manual", signal: AbortSignal.timeout(10000),
    headers: {
      Origin: base, "Sec-Fetch-Site": "same-origin",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let json; try { json = JSON.parse(text); } catch { json = null; }
  return { status: response.status, headers: response.headers, body: json };
}
async function boot() {
  activeGate = "application_startup";
  app = spawn(process.execPath, bundled ? ["--no-global-search-paths", launchPath] : [launchPath], {
    cwd: launchDirectory, env: appEnv, stdio: ["ignore", logFd, logFd],
  });
  let spawnError;
  app.once("error", error => { spawnError = error; });
  const until = Date.now() + 60000;
  while (Date.now() < until) {
    if (spawnError || hasExited(app)) throw new Error("Application exited before readiness");
    try {
      const response = await api("/readyz");
      if (response.status === 200 && response.body?.ok === true) return;
    } catch { /* Wait for the server and its real schema bootstrap. */ }
    await new Promise(resolveWait => setTimeout(resolveWait, 250));
  }
  throw new Error("Application readiness timeout");
}
async function stopApp() {
  await stopChild(app);
}

try {
  activeGate = "initialize_postgres";
  tool("initdb", ["-D", data, "-U", "mmhb_fixture_admin", "--pwfile", pwfile,
    "--auth=scram-sha-256", "--no-locale", "--encoding=UTF8"]);
  databaseStarted = true;
  tool("pg_ctl", ["-D", data, "-l", join(directory, "postgres.log"), "-w", "-t", "20",
    "-o", `-h '' -k '${socket}' -c unix_socket_permissions=0700`, "start"]);
  pool = new pg.Pool({ host: socket, user: "mmhb_fixture_admin", password, database: "postgres", ssl: false });
  const isolation = (await pool.query("SELECT current_setting('data_directory') AS data, current_setting('listen_addresses') AS listeners")).rows[0];
  check("private_socket_database_identity", resolve(isolation.data) === resolve(data) && isolation.listeners === "");
  // Password is random hex generated above, never inherited and never logged.
  await pool.query(`CREATE ROLE mmhb_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${password}'`);
  await pool.query("CREATE DATABASE mmhb_cloud_fixture OWNER mmhb_app");
  await pool.end();
  pool = new pg.Pool({ connectionString: dbUrl.href, ssl: false });
  await boot();
  check("full_app_schema_startup_ready", true);
  check("database_dependency_readiness", (await api("/api/health/ready")).status === 200);
  check("public_crisis_route", (await api("/api/crisis")).status === 200);
  check("unconfigured_provider_explicit_503", (await api("/api/login")).status === 503 && (await api("/api/callback")).status === 503);
  check("private_journal_requires_auth", (await api("/api/journal")).status === 401);
  const credentials = { email: "cloud-owner@example.invalid", password: "Synthetic-cloud-password-24!" };
  const owner = await api("/api/auth/register", { method: "POST", body: credentials });
  check("registration_returns_user_access", owner.status === 200 && typeof owner.body?.token === "string" && typeof owner.body?.user?.id === "string");
  const other = await api("/api/auth/register", { method: "POST", body: { ...credentials, email: "cloud-other@example.invalid" } });
  check("second_independent_account", other.status === 200 && typeof other.body?.token === "string");
  const ownerId = owner.body.user.id;
  let token = owner.body.token;
  const otherToken = other.body.token;
  const storedUser = (await pool.query("SELECT password_hash FROM users WHERE id=$1", [ownerId])).rows[0];
  check("native_bcrypt_persists_password_hash", storedUser.password_hash !== credentials.password && await bcrypt.compare(credentials.password, storedUser.password_hash));
  check("public_identity_excludes_password_hash", !Object.hasOwn(owner.body.user, "password_hash") && !Object.hasOwn(owner.body.user, "passwordHash"));
  check("incorrect_password_rejected", (await api("/api/auth/login", { method: "POST", body: { ...credentials, password: "wrong" } })).status === 401);
  const created = await api("/api/journal", { method: "POST", token, body: { title: "Cloud fixture", content: "Synthetic qualification entry." } });
  check("journal_create_persists", created.status === 200 && typeof created.body?.data?.id === "string");
  const journalId = created.body.data.id;
  check("owner_can_read_journal", (await api(`/api/journal/${journalId}`, { token })).status === 200);
  check("other_user_cannot_read_journal", (await api(`/api/journal/${journalId}`, { token: otherToken })).status === 400);
  check("other_user_cannot_update_journal", (await api(`/api/journal/${journalId}`, { method: "PUT", token: otherToken, body: { title: "foreign" } })).status === 400);
  check("other_user_cannot_delete_journal", (await api(`/api/journal/${journalId}`, { method: "DELETE", token: otherToken })).status === 400);
  const setup = await api("/api/account/2fa/setup", { method: "POST", token, body: { currentPassword: credentials.password } });
  check("mfa_enrollment_generates_real_qr", setup.status === 200 && /^data:image\/png;base64,/.test(setup.body?.qrCode || "") && !setup.body.secret);
  const pending = (await pool.query("SELECT mfa_secret, mfa_enabled, mfa_backup_codes FROM users WHERE id=$1", [ownerId])).rows[0];
  check("mfa_pending_not_enabled_or_recoverable", pending.mfa_enabled === false && pending.mfa_backup_codes === null);
  const [iv, tag, ciphertext] = pending.mfa_secret.split(":");
  const decipher = createDecipheriv("aes-256-gcm", createHash("sha256").update(sessionSecret).digest(), Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  const secret = decipher.update(ciphertext, "hex", "utf8") + decipher.final("utf8");
  check("mfa_secret_encrypted_at_rest", secret !== pending.mfa_secret && /^[A-Z2-7]+$/.test(secret));
  const code = () => speakeasy.totp({ secret, encoding: "base32" });
  const enabled = await api("/api/account/2fa/verify", { method: "POST", token, body: { currentPassword: credentials.password, code: code() } });
  check("real_totp_enables_mfa_and_recovery", enabled.status === 200 && enabled.body?.backupCodes?.length === 6);
  const recovery = enabled.body.backupCodes[0];
  const challenge = await api("/api/auth/login", { method: "POST", body: credentials });
  check("password_alone_cannot_issue_mfa_access", challenge.status === 200 && challenge.body?.mfaRequired === true && !challenge.body.token);
  check("mfa_challenge_is_not_access_token", (await api("/api/journal", { token: challenge.body.challenge })).status === 401);
  let wrongCode = "000000";
  while (speakeasy.totp.verify({ secret, encoding: "base32", token: wrongCode, window: 1 })) wrongCode = String(Number(wrongCode) + 1).padStart(6, "0");
  check("invalid_totp_rejected", (await api("/api/auth/mfa/verify", { method: "POST", body: { challenge: challenge.body.challenge, code: wrongCode } })).status === 401);
  const verificationBody = { challenge: challenge.body.challenge, code: code() };
  const verified = await api("/api/auth/mfa/verify", { method: "POST", body: verificationBody });
  check("valid_totp_issues_access", verified.status === 200 && typeof verified.body?.token === "string");
  token = verified.body.token;
  check("consumed_challenge_cannot_replay", (await api("/api/auth/mfa/verify", { method: "POST", body: verificationBody })).status === 401);
  const secondChallenge = await api("/api/auth/login", { method: "POST", body: credentials });
  const concurrentBody = { challenge: secondChallenge.body.challenge, code: code() };
  const concurrent = await Promise.all([api("/api/auth/mfa/verify", { method: "POST", body: concurrentBody }), api("/api/auth/mfa/verify", { method: "POST", body: concurrentBody })]);
  check("concurrent_challenge_has_one_winner", concurrent.map(r => r.status).sort().join(",") === "200,401");
  const thirdChallenge = await api("/api/auth/login", { method: "POST", body: credentials });
  const recoveryResult = await api("/api/auth/mfa/verify", { method: "POST", body: { challenge: thirdChallenge.body.challenge, recoveryCode: recovery } });
  check("recovery_login_consumes_one_code", recoveryResult.status === 200 && recoveryResult.body?.remainingRecoveryCodes === 5);
  const fourthChallenge = await api("/api/auth/login", { method: "POST", body: credentials });
  check("recovery_code_reuse_rejected_with_fresh_challenge", (await api("/api/auth/mfa/verify", { method: "POST", body: { challenge: fourthChallenge.body.challenge, recoveryCode: recovery } })).status === 401);
  const refreshCookie = recoveryResult.headers.getSetCookie().find(c => c.startsWith("refresh_token="))?.split(";")[0];
  check("real_refresh_cookie_issued", !!refreshCookie);
  check("logout_revokes_persisted_refresh", (await api("/api/auth/logout", { method: "POST", cookie: refreshCookie })).status === 200);
  const refresh = await api("/api/auth/refresh", { method: "POST", cookie: refreshCookie });
  check("revoked_refresh_cannot_issue_access", !refresh.body?.token && !refresh.body?.refreshed);
  await stopApp();
  await boot();
  check("journal_survives_application_restart", (await api(`/api/journal/${journalId}`, { token })).body?.data?.title === "Cloud fixture");
  check("mfa_survives_application_restart", (await api("/api/auth/login", { method: "POST", body: credentials })).body?.mfaRequired === true);
  check("owner_can_delete_journal", (await api(`/api/journal/${journalId}`, { method: "DELETE", token })).status === 200);
  check("deleted_journal_stays_unavailable", (await api(`/api/journal/${journalId}`, { token })).status === 400);
  activeGate = "repository_test_pipeline";
  const tests = spawn("npm", ["test", "--cache", "/workspace/.npm-cache"], {
    cwd: root, env: { ...appEnv, CI: "true", VERIFY_BASE_URL: base },
    stdio: ["ignore", logFd, logFd], detached: true,
  });
  let timeout;
  let testCode;
  try {
    testCode = await new Promise((resolveExit, rejectExit) => {
      let timedOut = false;
      tests.once("error", rejectExit);
      tests.once("exit", code => { if (!timedOut) resolveExit(code); });
      timeout = setTimeout(() => {
        timedOut = true;
        stopChild(tests, {
          // Only this command's process group, including npm-script children.
          signal: name => {
            try { process.kill(-tests.pid, name); }
            catch (error) { if (error.code !== "ESRCH") throw error; }
          },
        }).then(() => resolveExit(null), rejectExit);
      }, 600000);
    });
  }
  finally { clearTimeout(timeout); }
  check("repository_npm_test_with_real_ready_server", testCode === 0);
  activeGate = "source_identity_unchanged";
  for (const [file, expected] of Object.entries(report.sourceHashes)) {
    if (createHash("sha256").update(await readFile(join(root, file))).digest("hex") !== expected) {
      throw new Error("Qualified source changed during the run");
    }
  }
  for (const { file, sha256 } of artifactFiles) {
    if (createHash("sha256").update(await readFile(join(launchDirectory, file))).digest("hex") !== sha256) {
      throw new Error("Qualified artifact changed during the run");
    }
  }
  report.sourceIdentityUnchanged = true;
  report.result = "passed";
} catch (error) {
  report.result = "failed";
  report.failure = { gate: activeGate, code: error.code || error.name };
  process.exitCode = 1;
} finally {
  try { await stopApp(); report.cleanup.applicationStopped = true; }
  catch { report.cleanup.applicationStopped = false; process.exitCode = 1; }
  try { if (pool) await pool.end(); }
  catch { process.exitCode = 1; }
  if (databaseStarted) {
    try { tool("pg_ctl", ["-D", data, "-w", "-t", "20", "-m", "fast", "stop"]); report.cleanup.databaseStopped = true; }
    catch { report.cleanup.databaseStopped = false; process.exitCode = 1; }
  }
  await unlink(pwfile).catch(() => {});
  closeSync(logFd);
  const output = join(directory, "result.json");
  await writeFile(output, JSON.stringify(report, null, 2) + "\n", { mode: 0o600 });
  console.log(JSON.stringify({ result: report.result, checksPassed: report.checks.length,
    failure: report.failure, cleanup: report.cleanup, evidence: output, privateLog: log,
    productionReleaseQualified: false }));
}
