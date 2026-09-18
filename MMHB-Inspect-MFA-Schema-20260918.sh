#!/usr/bin/env bash
# MMHB only: inspect catalog metadata using the workspace's DATABASE_URL.
# No installs, application startup, account-row reads, migrations or publishing.
env -u NODE_OPTIONS -u NODE_PATH node --no-global-search-paths --input-type=module <<'MMHB_MFA_METADATA'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = fs.realpathSync('.');
const say = value => console.log(JSON.stringify(value));
const stop = code => { throw Object.assign(new Error(), { code }); };
const read = name => {
  const full = path.join(root, name);
  const stat = fs.lstatSync(full);
  if (!stat.isFile() || fs.realpathSync(full) !== full || stat.size > 2097152)
    stop('FILE_NEEDS_REVIEW');
  return fs.readFileSync(full);
};
const safeCode = err => /^[A-Z0-9_]{2,64}$/.test(err?.code || '') ? err.code : 'CHECK_FAILED';
let client, transaction = false, connectionError = null, report;
const unchanged = { sourceFilesChanged: 0, accountRowsRead: 0,
  databaseWrites: 0, deploymentRuns: 0, productionDatabaseVerified: false };
const watchdog = setTimeout(() => {
  say({ status: 'STOP', reason: 'CHECK_TIMEOUT', ...unchanged });
  process.exit(1);
}, 30000);
watchdog.unref();

try {
  if (JSON.parse(read('package.json')).name !== 'mymentalhealthbuddy') stop('WRONG_PROJECT');
  if (!process.env.DATABASE_URL) stop('DATABASE_URL_NOT_SET');
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') stop('TLS_OVERRIDE_NEEDS_REVIEW');
  const tlsFile = 'server/db/sslConfig.mjs';
  const tlsHash = crypto.createHash('sha256').update(read(tlsFile)).digest('hex');
  if (tlsHash !== '5cd34b8606acc79303666990a55bcaa355f67b34a02e0973dacb0d6c534e62fa')
    stop('TLS_HELPER_NEEDS_REVIEW');
  // This reviewed helper is pure configuration; do not import connection.mjs.
  const tls = await import(pathToFileURL(path.join(root, tlsFile)).href);
  let ssl;
  try { ssl = tls.getPostgresSslConfig({ ...process.env, NODE_ENV: 'production' }); }
  catch { stop('TLS_CONFIGURATION_NEEDS_REVIEW'); }
  if (!ssl || ssl.rejectUnauthorized !== true) stop('TLS_CONFIGURATION_NEEDS_REVIEW');
  const require = createRequire(path.join(root, 'package.json'));
  const { Client } = require('pg');
  client = new Client({
    connectionString: tls.getPostgresConnectionString(process.env.DATABASE_URL),
    ssl, application_name: 'mmhb-mfa-metadata-readonly',
    connectionTimeoutMillis: 5000, statement_timeout: 5000,
    query_timeout: 7000, lock_timeout: 1000,
  });
  client.on('error', err => { connectionError = err; });
  await client.connect();
  await client.query('BEGIN READ ONLY');
  transaction = true;
  const readonly = await client.query('SHOW transaction_read_only');
  if (readonly.rows[0]?.transaction_read_only !== 'on') stop('READ_ONLY_NOT_CONFIRMED');

  const tables = await client.query(`
    SELECT pg_catalog.to_regclass('public.mfa_login_challenges') IS NOT NULL AS challenge_table_present,
           pg_catalog.to_regclass('public.users') IS NOT NULL AS users_table_present
  `);
  const columns = await client.query(`
    SELECT c.relname AS table_name, a.attname AS column_name,
           pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
           a.attnotnull AS not_null
    FROM pg_catalog.pg_attribute a
    JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE a.attrelid IN (pg_catalog.to_regclass('public.mfa_login_challenges'),
                        pg_catalog.to_regclass('public.users'))
      AND a.attnum > 0 AND NOT a.attisdropped
      AND ((c.relname = 'mfa_login_challenges' AND a.attname = 'user_id')
        OR (c.relname = 'users' AND a.attname = 'id'))
    ORDER BY c.relname, a.attname
    LIMIT 4
  `);
  const constraints = await client.query(`
    SELECT c.conname AS constraint_name, c.contype AS constraint_type,
           c.convalidated AS validated,
           pg_catalog.pg_get_constraintdef(c.oid, true) AS definition
    FROM pg_catalog.pg_constraint c
    WHERE (c.conrelid = pg_catalog.to_regclass('public.mfa_login_challenges') AND c.contype = 'f')
       OR (c.conrelid = pg_catalog.to_regclass('public.users') AND c.contype IN ('p', 'u'))
    ORDER BY c.conrelid, c.conname
    LIMIT 30
  `);
  await client.query('ROLLBACK');
  transaction = false;
  if (connectionError) throw connectionError;
  report = { status: 'MFA_SCHEMA_METADATA_REPORTED', databaseContext: 'workspace_DATABASE_URL',
    readOnlyConfirmed: true, tables: tables.rows[0], columns: columns.rows,
    constraints: constraints.rows, originalWarningCauseProven: false, ...unchanged };
} catch (err) {
  report = { status: 'STOP', reason: safeCode(err), ...unchanged };
  process.exitCode = 1;
} finally {
  if (client) {
    if (transaction) { try { await client.query('ROLLBACK'); } catch {} }
    try { await client.end(); }
    catch {
      report = { status: 'STOP', reason: 'CLIENT_CLOSE_FAILED', ...unchanged };
      process.exitCode = 1;
    }
  }
  clearTimeout(watchdog);
}
say(report);
MMHB_MFA_METADATA
