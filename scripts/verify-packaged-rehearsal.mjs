import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createServer } from "node:https";
import { networkInterfaces } from "node:os";
import { join, relative, resolve } from "node:path";
import { setTimeout as pause } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const savedServerHash = "d50210ce27af585a9597d344cfaacc91beec6cc75248a71d85e7071a0cf94e5e";
const savedTreeHash = "2378a9a414dde8ef07e58b139538b9d03c818f40126f4a40a9c9126bce069191";
const expectedLockHash = "0cf41b8adc5abc966e260c04458a74a2a9e02318a767a7574b96c3485681bfc7";
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

function digestDistribution(root) {
  const dist = join(root, "dist");
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else {
        assert(entry.isFile(), "The packaged tree must contain regular files only");
        files.push(relative(root, path));
      }
    }
  }
  walk(dist);
  files.sort();
  const records = files.map(path => sha256(readFileSync(join(root, path))) + "  " + path + "\n");
  const treeHash = sha256(records.join(""));
  console.log("PACKAGED_FILE_COUNT=" + files.length);
  console.log("PACKAGED_TREE_SHA256=" + treeHash);
  console.log("MATCHES_SAVED_TREE=" + (treeHash === savedTreeHash ? "YES" : "NO"));
  const serverHash = sha256(readFileSync(join(dist, "server.mjs")));
  console.log("PACKAGED_SERVER_SHA256=" + serverHash);
  console.log("MATCHES_SAVED_SERVER=" + (serverHash === savedServerHash ? "YES" : "NO"));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, command + " failed");
}

function runOnCi() {
  if (process.env.GITHUB_ACTIONS !== "true") {
    console.log("PACKAGED_RUNTIME_REHEARSAL=CI_ONLY");
    return;
  }
  assert.equal(process.platform, "linux");
  assert.equal(sha256(readFileSync("package-lock.json")), expectedLockHash, "Review the changed lockfile before this rehearsal");
  run(process.execPath, ["scripts/build-server.mjs"], { env: { PATH: process.env.PATH } });

  const stage = mkdtempSync(join(resolve(process.env.RUNNER_TEMP), "mmhb-packaged-"));
  const name = "mmhb-packaged-" + process.pid;
  try {
    chmodSync(stage, 0o755);
    mkdirSync(join(stage, "dist", "client"), { recursive: true });
    for (const path of ["server.mjs", "schema.canonical.sql", "node_modules", "client/dist"]) {
      cpSync(join("dist", path), join(stage, "dist", path), { recursive: true });
    }
    cpSync(fileURLToPath(import.meta.url), join(stage, "probe.mjs"));
    run("openssl", [
      "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
      "-subj", "/CN=MMHB isolated rehearsal", "-addext", "subjectAltName=IP:127.0.0.1,DNS:localhost",
      "-keyout", join(stage, "fixture.key"), "-out", join(stage, "fixture.crt"),
    ], { stdio: "ignore" });
    chmodSync(join(stage, "fixture.key"), 0o644);
    const init = [
      "umask 077",
      "cp /rehearsal/fixture.key /tmp/fixture.key",
      "initdb -D /tmp/rehearsal-db -U postgres --locale=C --encoding=UTF8 --auth=trust >/tmp/init.log",
      "printf 'local all all trust\\nhostssl all all 127.0.0.1/32 trust\\n' >/tmp/rehearsal-db/pg_hba.conf",
      "pg_ctl -D /tmp/rehearsal-db -l /tmp/postgres.log -o '-h 127.0.0.1 -k /tmp -c ssl=on -c ssl_cert_file=/rehearsal/fixture.crt -c ssl_key_file=/tmp/fixture.key' -w start",
      "exec node /rehearsal/probe.mjs --isolated",
    ].join(" && ");
    run("docker", [
      "run", "--rm", "--name", name, "--pull=never", "--network", "none", "--read-only",
      "--security-opt", "no-new-privileges", "--cap-drop", "ALL", "--pids-limit", "128",
      "--user", "postgres", "--tmpfs", "/tmp:rw,nosuid,nodev,size=536870912",
      "--mount", "type=bind,source=" + stage + ",target=/rehearsal,readonly",
      "--mount", "type=bind,source=" + process.execPath + ",target=/usr/local/bin/node,readonly",
      "--entrypoint", "/bin/sh", "postgres:16", "-ec", init,
    ], { timeout: 240_000 });
  } finally {
    spawnSync("docker", ["rm", "-f", name], { stdio: "ignore" });
    rmSync(stage, { recursive: true, force: true });
  }
}

const root = "/rehearsal";
const appWorkdir = "/tmp/mmhb-app";
const appOrigin = "http://127.0.0.1:5081";
const issuer = "https://127.0.0.1:5082";
const certificate = join(root, "fixture.crt");
const env = {
  PATH: process.env.PATH,
  NODE_ENV: "production",
  PORT: "5081",
  ISSUER_URL: issuer,
  NODE_EXTRA_CA_CERTS: certificate,
  PGSSLROOTCERT: certificate,
  DATABASE_URL: "postgresql://postgres@127.0.0.1:5432/postgres",
  DATABASE_SSL: "true",
  JWT_SECRET: "mmhb-fixture-only-jwt-0700-not-a-production-secret",
  SESSION_SECRET: "mmhb-fixture-only-session-0700-not-a-production-secret",
  OPENAI_API_KEY: "mmhb-fixture-no-provider-access",
  REPL_ID: "mmhb-isolated-fixture",
  OTEL_DISABLED: "true",
};

async function waitForApp(child, bootLog) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw Error("Packaged app exited during boot\n" + bootLog());
    try {
      const response = await fetch(appOrigin + "/readyz", { signal: AbortSignal.timeout(1_000) });
      const state = await response.json();
      if (response.status === 200 && state.ok === true && state.status === "ready") return;
    } catch {
      // Wait for the listener and schema bootstrap.
    }
    await pause(500);
  }
  try {
    // Ask the existing database health route to emit its diagnostics on timeout.
    await fetch(appOrigin + "/api/health/ready", { signal: AbortSignal.timeout(5_000) });
  } catch {
    // Report the original startup failure if the app cannot answer.
  }
  throw Error("Packaged app did not become ready\n" + bootLog());
}

function startApp() {
  const child = spawn(process.execPath, [join(root, "dist/server.mjs")], {
    cwd: appWorkdir, env, stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding("utf8").on("data", chunk => { output = (output + chunk).slice(-3200); });
  }
  return { child, bootLog: () => output };
}

async function stopApp(app) {
  if (!app || app.child.exitCode !== null || app.child.signalCode !== null) return;
  const exited = new Promise(resolveExit => app.child.once("exit", resolveExit));
  app.child.kill("SIGTERM");
  await Promise.race([exited, pause(2_000)]);
  if (app.child.exitCode === null && app.child.signalCode === null) {
    app.child.kill("SIGKILL");
    await exited;
  }
}

function request(path, { method = "GET", body, token, cookie, origin = appOrigin } = {}) {
  const headers = { Origin: origin, "Sec-Fetch-Site": "same-origin" };
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = "Bearer " + token;
  if (cookie) headers.Cookie = cookie;
  return fetch(appOrigin + path, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
    redirect: "manual", signal: AbortSignal.timeout(8_000),
  });
}

function refreshHeader(response) {
  return response.headers.getSetCookie().find(cookie => cookie.startsWith("refresh_token="));
}

async function session(response, label) {
  assert.equal(response.status, 200, label);
  const body = await response.json();
  const header = refreshHeader(response) ?? "";
  assert(Boolean(body.ok && body.user?.id && body.token), label + " did not return a session");
  assert(/^refresh_token=[^;]+;/.test(header), label + " did not issue a refresh cookie");
  for (const attribute of ["Secure", "HttpOnly", "SameSite=Strict"]) {
    assert(header.split(";").map(value => value.trim()).includes(attribute), label + " missing " + attribute);
  }
  return { id: body.user.id, token: body.token, cookie: header.split(";", 1)[0] };
}

async function rejectRefresh(cookie) {
  const response = await request("/api/auth/refresh", { method: "POST", cookie });
  assert.equal(response.status, 409, "Revoked refresh credential should receive 409");
  const body = await response.json();
  assert(body.retryable === true && !body.token && !refreshHeader(response), "Revoked refresh must not rotate");
}

async function verifyFrontend() {
  const response = await request("/");
  assert.equal(response.status, 200, "Packaged homepage should load");
  const served = await response.text();
  const directory = join(root, "dist/client/dist");
  const index = readFileSync(join(directory, "index.html"), "utf8");
  const assets = [...new Set(index.match(/\/assets\/index-[\w.-]+\.(?:js|css)/g))];
  assert(assets.some(path => path.endsWith(".js")) && assets.some(path => path.endsWith(".css")));
  for (const asset of assets) {
    assert(served.includes(asset), "Homepage should point to its packaged asset");
    const download = await request(asset);
    assert.equal(download.status, 200, "Packaged asset should load");
    assert.equal(sha256(Buffer.from(await download.arrayBuffer())), sha256(readFileSync(join(directory, asset.slice(1)))));
  }
  console.log("PACKAGED_READY_AND_ASSETS=PASS");
}

async function runIsolated() {
  const interfaces = Object.entries(networkInterfaces());
  assert(interfaces.length === 1 && interfaces[0][0] === "lo"
    && interfaces[0][1].every(address => address.internal)
    && interfaces[0][1].some(address => address.address === "127.0.0.1"), "Require IPv4 loopback-only isolation");
  console.log("LOOPBACK_ONLY=PASS");
  digestDistribution(root);
  // Application log files belong on the disposable filesystem beside the database.
  mkdirSync(appWorkdir, { mode: 0o700 });
  const discovery = createServer({
    key: readFileSync(join(root, "fixture.key")), cert: readFileSync(certificate),
  }, (req, res) => {
    if (req.url !== "/.well-known/openid-configuration") {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({
      issuer, authorization_endpoint: issuer + "/authorize", token_endpoint: issuer + "/token",
      jwks_uri: issuer + "/jwks", response_types_supported: ["code"],
      subject_types_supported: ["public"], id_token_signing_alg_values_supported: ["RS256"],
    }));
  });
  await new Promise((resolveListen, reject) => {
    discovery.once("error", reject);
    discovery.listen(5082, "127.0.0.1", resolveListen);
  });
  let app;
  try {
    app = startApp();
    await waitForApp(app.child, app.bootLog);
    await verifyFrontend();
    const password = "Fixture-only-passphrase-2507";
    const alpha = { email: "fixture-a@example.invalid", password };
    const beta = { email: "fixture-b@example.invalid", password };
    const a1 = await session(await request("/api/auth/register", { method: "POST", body: alpha }), "Register A");
    const a2 = await session(await request("/api/auth/login", { method: "POST", body: alpha }), "Login A");
    const b1 = await session(await request("/api/auth/register", { method: "POST", body: beta }), "Register B");
    assert(a1.id === a2.id && a1.id !== b1.id && new Set([a1.cookie, a2.cookie, b1.cookie]).size === 3, "Expected distinct refresh sessions");
    for (const user of [a1, a2, b1]) {
      const me = await request("/api/auth/me", { token: user.token });
      assert.equal(me.status, 200);
      assert((await me.json()).user?.id === user.id, "Each session should retrieve its own account");
    }
    const title = "Fictional packaged rehearsal entry";
    const write = await request("/api/journal", { method: "POST", token: a1.token, body: { title, content: title, shareWithCommunity: false } });
    assert.equal(write.status, 200, "Owner journal write");
    const entry = (await write.json()).data?.id;
    assert(Boolean(entry), "Expected a journal ID");
    const journal = "/api/journal/" + encodeURIComponent(entry);
    assert.equal((await request(journal, { token: a2.token })).status, 200, "Same account journal read");
    assert.equal((await request(journal, { token: b1.token })).status, 400, "Other account journal read must fail");
    assert.equal((await request(journal)).status, 401, "Anonymous journal read must fail");
    console.log("PACKAGED_TWO_ACCOUNT_JOURNAL_ISOLATION=PASS");

    const wrongOrigin = await request("/api/auth/logout", { method: "POST", cookie: a1.cookie, origin: "http://127.0.0.1:1" });
    assert.equal(wrongOrigin.status, 403, "Wrong-origin logout must fail");
    assert(!refreshHeader(wrongOrigin), "Wrong-origin logout must leave the refresh cookie alone");
    const logout = await request("/api/auth/logout", { method: "POST", cookie: a1.cookie });
    assert.equal(logout.status, 200, "Same-origin logout");
    assert((await logout.json()).ok && refreshHeader(logout)?.startsWith("refresh_token=;"), "Logout must clear the refresh cookie");
    await rejectRefresh(a1.cookie);
    await stopApp(app);
    app = startApp();
    await waitForApp(app.child, app.bootLog);
    await rejectRefresh(a1.cookie);
    for (const user of [a2, b1]) {
      const refreshed = await session(await request("/api/auth/refresh", { method: "POST", cookie: user.cookie }), "Surviving refresh");
      assert(refreshed.id === user.id && refreshed.cookie !== user.cookie, "Independent session should refresh and rotate");
    }
    console.log("PACKAGED_LOGOUT_REFRESH_ISOLATION_AFTER_RESTART=PASS");
    console.log("PACKAGED_RUNTIME_REHEARSAL=PASS");
  } finally {
    await stopApp(app);
    discovery.close();
  }
}

if (process.argv[2] === "--isolated") await runIsolated();
else runOnCi();
