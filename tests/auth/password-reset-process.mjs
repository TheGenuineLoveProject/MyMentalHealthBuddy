// Focused opt-in check: separate OS processes share only a disposable socket DB.
import { fork } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

if (!process.env.RESET_TEST_SOCKET?.startsWith("/tmp/mmhb-reset-") ||
    process.env.DATABASE_URL || process.env.RESEND_API_KEY) {
  throw new Error("Isolated fixture environment required");
}

if (!process.argv[2]) {
  async function child(phase, timezone, token) {
    return new Promise((resolve, reject) => {
      const processChild = fork(fileURLToPath(import.meta.url), [phase], {
        env: { ...process.env, TZ: timezone },
        execArgv: ["--experimental-test-module-mocks", "--no-warnings"],
        stdio: ["ignore", "ignore", "ignore", "ipc"],
      });
      let result;
      const timeout = setTimeout(() => processChild.kill(), 30000);
      processChild.on("message", message => { result = message; });
      processChild.on("error", () => reject(new Error("Fixture child could not start")));
      processChild.on("exit", code => {
        clearTimeout(timeout);
        if (code !== 0 || !result?.ok) {
          reject(new Error(`Fixture ${phase} failed in ${timezone}`));
        } else {
          resolve({ ...result, pid: processChild.pid });
        }
      });
      processChild.send({ token });
    });
  }
  for (const [issueZone, confirmZone] of [
    ["UTC", "UTC"],
    ["America/Los_Angeles", "America/Los_Angeles"],
    ["UTC", "America/Los_Angeles"],
    ["America/Los_Angeles", "UTC"],
  ]) {
    const issued = await child("issue", issueZone);
    // The issuer has fully exited before the fresh confirmation process starts.
    const confirmed = await child("confirm", confirmZone, issued.token);
    assert.equal(issued.pid !== confirmed.pid, true);
    console.log(`PASS separate-process issuance ${issueZone} -> confirmation ${confirmZone}; fresh/expired/reused/login`);
  }
} else {
  const input = await new Promise(resolve => process.once("message", resolve));
  let pool;
  try {
    const { mock } = await import("node:test");
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { getTableConfig } = await import("drizzle-orm/pg-core");
    const { eq } = await import("drizzle-orm");
    const schema = await import("../../shared/schema.mjs");
    const bcrypt = (await import("bcrypt")).default;
    const crypto = await import("node:crypto");
    const express = (await import("express")).default;
    const request = (await import("supertest")).default;
    pool = new Pool({
      host: process.env.RESET_TEST_SOCKET, database: "reset_fixture",
      user: "reset_fixture", ssl: false,
    });
    const db = drizzle(pool);
    mock.module(new URL("../../server/db/connection.mjs", import.meta.url).href, {
      namedExports: { pool, db },
    });
    mock.module(new URL("../../server/db/client.mjs", import.meta.url).href, {
      namedExports: { pool, db }, defaultExport: db,
    });
    let issuedToken;
    mock.module(new URL("../../server/utils/email.mjs", import.meta.url).href, {
      namedExports: {
        sendTransactionalEmail: async ({ html }) => {
          issuedToken = new URL(html.match(/href="([^"]+)"/)[1]).searchParams.get("token");
          return { ok: true, result: { data: { id: "synthetic-delivery" } } };
        },
      },
    });
    const account = (await import("../../server/routes/account.mjs")).default;
    const auth = (await import("../../server/routes/auth.mjs")).default;
    const { csrfProtection } = await import("../../server/security/csrf.mjs");
    const app = express();
    app.use(express.json(), csrfProtection);
    app.use("/api/account", account);
    app.use("/api/auth", auth);
    const email = "restart-fixture@example.invalid";
    const oldPassword = "Old-restart-fixture-password";
    const newPassword = "New-restart-fixture-password";
    if (process.argv[2] === "issue") {
      for (const table of [schema.users, schema.passwordResetTokens, schema.auditLog]) {
        const config = getTableConfig(table);
        const columns = config.columns.map(c => {
          let defaults = "";
          if (c.name === "id") defaults = " DEFAULT gen_random_uuid() PRIMARY KEY";
          if (c.name === "created_at" || c.name === "updated_at") defaults = " DEFAULT now()";
          if (c.name === "timezone") defaults = " DEFAULT 'UTC'";
          return `"${c.name}" ${c.getSQLType()}${defaults}${c.notNull ? " NOT NULL" : ""}`;
        });
        await pool.query(`CREATE TABLE IF NOT EXISTS "${config.name}" (${columns.join(",")})`);
      }
      await pool.query("TRUNCATE users, password_reset_tokens, audit_log");
      await db.insert(schema.users).values({
        id: crypto.randomUUID(), email, name: "Restart Fixture",
        passwordHash: await bcrypt.hash(oldPassword, 10),
      });
      const response = await request(app).post("/api/account/password-reset/request").send({ email });
      assert.equal(response.status, 200);
      assert.equal(typeof issuedToken, "string");
      const rows = await db.select().from(schema.passwordResetTokens);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].tokenHash === crypto.createHash("sha256").update(issuedToken).digest("hex"), true);
      assert.equal(Math.abs(rows[0].expiresAt.getTime() - Date.now() - 3600000) < 5000, true);
      await pool.end();
      process.send({ ok: true, token: issuedToken }, () => process.disconnect());
    } else {
      const tokenHash = crypto.createHash("sha256").update(input.token).digest("hex");
      const rows = await db.select().from(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.tokenHash, tokenHash));
      assert.equal(rows.length, 1);
      assert.equal(rows[0].usedAt === null, true);
      assert.equal(Math.abs(rows[0].expiresAt.getTime() - Date.now() - 3600000) < 10000, true);
      const confirm = () => request(app).post("/api/account/password-reset/confirm")
        .send({ token: input.token, password: newPassword });
      // Drizzle date serialization and predicates are exercised in this TZ.
      const expiry = rows[0].expiresAt;
      await db.update(schema.passwordResetTokens).set({ expiresAt: new Date(Date.now() - 1000) })
        .where(eq(schema.passwordResetTokens.tokenHash, tokenHash));
      assert.equal((await confirm()).status, 400);
      await db.update(schema.passwordResetTokens).set({ expiresAt: expiry })
        .where(eq(schema.passwordResetTokens.tokenHash, tokenHash));
      assert.equal((await confirm()).status, 200);
      assert.equal((await confirm()).status, 400);
      for (const [password, expected] of [[newPassword, 200], [oldPassword, 401]]) {
        const response = await request(app).post("/api/auth/login")
          .set("Sec-Fetch-Site", "same-origin").send({ email, password });
        assert.equal(response.status, expected);
      }
      await pool.end();
      process.send({ ok: true }, () => process.disconnect());
    }
  } catch {
    // Never serialize assertion payloads or database errors containing parameters.
    if (pool) await pool.end().catch(() => {});
    process.exitCode = 1;
    if (process.connected) process.disconnect();
  }
}