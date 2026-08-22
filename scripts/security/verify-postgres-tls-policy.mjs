import assert from "node:assert/strict";
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  getPostgresConnectionString,
  getPostgresSslConfig,
} from "../../server/db/sslConfig.mjs";

const original =
  "postgresql://user:password@example.invalid/mmhb" +
  "?sslmode=require" +
  "&sslrootcert=%2Ftmp%2Froot.pem" +
  "&sslcert=%2Ftmp%2Fclient.pem" +
  "&sslkey=%2Ftmp%2Fclient.key" +
  "&sslnegotiation=direct" +
  "&channel_binding=require" +
  "&application_name=mmhb";

const normalized = getPostgresConnectionString(original);
const normalizedUrl = new URL(normalized);

for (const key of [
  "sslmode",
  "sslrootcert",
  "sslcert",
  "sslkey",
  "sslnegotiation",
]) {
  assert.equal(
    normalizedUrl.searchParams.has(key),
    false,
    `${key} must be removed from DATABASE_URL`
  );
}

assert.equal(
  normalizedUrl.searchParams.get("channel_binding"),
  "require",
  "non-SSL PostgreSQL query parameters must be preserved"
);

assert.equal(
  normalizedUrl.searchParams.get("application_name"),
  "mmhb",
  "unrelated query parameters must be preserved"
);

assert.deepEqual(
  getPostgresSslConfig({ NODE_ENV: "production" }),
  { rejectUnauthorized: true },
  "production must verify server certificates by default"
);

assert.throws(
  () =>
    getPostgresSslConfig({
      NODE_ENV: "production",
      DATABASE_SSL: "false",
    }),
  /not permitted/,
  "production must reject DATABASE_SSL=false"
);

assert.equal(
  getPostgresSslConfig({
    NODE_ENV: "test",
    DATABASE_SSL: "false",
  }),
  false,
  "CI/local test environments must retain the explicit TLS-off escape hatch"
);

const caPem = [
  "-----BEGIN CERTIFICATE-----",
  "MMHB_TEST_CA_ONLY",
  "-----END CERTIFICATE-----",
].join("\n");

assert.deepEqual(
  getPostgresSslConfig({
    NODE_ENV: "production",
    DATABASE_SSL_CA_PEM: caPem,
  }),
  {
    rejectUnauthorized: true,
    ca: caPem,
  },
  "DATABASE_SSL_CA_PEM must supply explicit CA trust"
);

assert.deepEqual(
  getPostgresSslConfig({
    NODE_ENV: "production",
    PGSSLROOTCERT: caPem,
  }),
  {
    rejectUnauthorized: true,
    ca: caPem,
  },
  "historical direct-PEM PGSSLROOTCERT behavior must remain compatible"
);

const tempDir = mkdtempSync(join(tmpdir(), "mmhb-postgres-tls-"));
const rootCertPath = join(tempDir, "root.pem");

try {
  writeFileSync(rootCertPath, caPem);

  assert.deepEqual(
    getPostgresSslConfig({
      NODE_ENV: "production",
      PGSSLROOTCERT: rootCertPath,
    }),
    {
      rejectUnauthorized: true,
      ca: caPem,
    },
    "PGSSLROOTCERT file-path semantics must load the root CA"
  );
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log("POSTGRES_TLS_POLICY_VERIFICATION=PASS");
