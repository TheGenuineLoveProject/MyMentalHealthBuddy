#!/usr/bin/env bash
# Run from the existing MMHB Replit project root. No installation or app startup.
# Reads one token's metadata through the workspace DATABASE_URL, then rolls back.
set +x
set +v
set -euo pipefail
unset NODE_OPTIONS NODE_PATH
trap 'unset MMHB_PRIVATE_RESET_LINK' EXIT

mmhb_probe() {
  env -u NODE_OPTIONS -u NODE_PATH node --input-type=module - "$1" <<'MMHB_RECORD_JS'
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const mode = process.argv[2];
const report = {
  command: 'MMHB-INSPECT-RESET-RECORD-20260921',
  status: 'STARTING',
  context: 'WORKSPACE_DATABASE_NOT_CONFIRMED_AS_PRODUCTION',
  referenceAttemptUtc: '2026-09-21T21:11:39.704Z',
  productionDatabaseVerified: false,
  databaseConnectionsAttempted: 0,
  transactionReadOnlyVerified: false,
  rollbackCompleted: false,
  sourceFilesChanged: 0,
  databaseWritesAttempted: 0,
  applicationRequestsSent: 0,
  emailsSent: 0,
  passwordsChanged: 0,
  deploymentRuns: 0,
};
const sourceVersions = new Map([
  ['65400980480646560bdfa2cea8a09ac9c02a383bde302647e15dd0becf778b97', 'INSPECTED_REPOSITORY_COPY'],
  ['e766374c5bc57032a5ad8573ed1c9bb37ef66dceb703957bf2bba289a5acd331', 'PRIOR_WORKSPACE_BASELINE'],
  ['1ff6658175622c23e282ddfa211a6b9ac6e2a4786585ec2f515765710042185d', 'WORKSPACE_EMAIL_RESULT_REPAIR'],
]);
const sslHash = '5cd34b8606acc79303666990a55bcaa355f67b34a02e0973dacb0d6c534e62fa';
const knownErrors = new Set([
  '28P01', '28000', '42501', '42P01', '42703', '57014', '08006', '08001',
  '3D000', '25006', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET',
  'CERT_HAS_EXPIRED', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'SELF_SIGNED_CERT_IN_CHAIN', 'DEPTH_ZERO_SELF_SIGNED_CERT',
]);
const hashFile = path => createHash('sha256').update(readFileSync(path)).digest('hex');
function stop(status) { const error = new Error(status); error.safeStatus = status; throw error; }
function safeTime(value) {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}$/.test(value) ? value : null;
}
let client;
let connected = false;
let transaction = false;
let emitted = false;
function emit() {
  if (emitted) return;
  emitted = true;
  console.log(JSON.stringify(report, null, 2));
}
const deadline = setTimeout(() => {
  report.status = 'STOPPED_TOTAL_TIMEOUT';
  emit();
  process.exit(1);
}, 45000);

try {
  if (mode !== 'preflight' && mode !== 'inspect') stop('STOPPED_INVALID_MODE');
  report.accountSourceSha256 = hashFile('server/routes/account.mjs');
  report.sourceVersion = sourceVersions.get(report.accountSourceSha256) ?? 'UNREVIEWED';
  if (report.sourceVersion === 'UNREVIEWED') stop('STOPPED_SOURCE_CHANGED_RETURN_THIS_REPORT');
  if (hashFile('server/db/sslConfig.mjs') !== sslHash) stop('STOPPED_SSL_HELPER_CHANGED');
  if (!process.env.DATABASE_URL) stop('STOPPED_DATABASE_URL_NOT_AVAILABLE');
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') stop('STOPPED_TLS_VERIFICATION_DISABLED');
  const require = createRequire(pathToFileURL(resolve('package.json')));
  require.resolve('pg');
  const sslModule = await import(pathToFileURL(resolve('server/db/sslConfig.mjs')).href);
  if (sslModule.isPostgresSslDisabled()) stop('STOPPED_DATABASE_TLS_DISABLED');
  const ssl = sslModule.getPostgresSslConfig();
  if (ssl?.rejectUnauthorized !== true) stop('STOPPED_STRICT_TLS_REQUIRED');
  const connectionString = sslModule.getPostgresConnectionString(process.env.DATABASE_URL);
  const connectionUrl = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(connectionUrl.protocol) || !connectionUrl.hostname)
    stop('STOPPED_DATABASE_URL_FORMAT');

  if (mode === 'preflight') {
    report.status = 'PREFLIGHT_PASSED_NO_DATABASE_CONNECTION';
  } else {
    let input = process.env.MMHB_PRIVATE_RESET_LINK ?? '';
    delete process.env.MMHB_PRIVATE_RESET_LINK;
    if (input.length > 4096) stop('STOPPED_RESET_LINK_INPUT_INVALID');
    let link;
    try { link = new URL(input.trim()); } catch { stop('STOPPED_RESET_LINK_INPUT_INVALID'); }
    input = '';
    const token = link.searchParams.get('token');
    if (link.protocol !== 'https:' || link.username || link.password || link.port || link.hash ||
        !['www.mymentalhealthbuddy.com', 'mymentalhealthbuddy.com'].includes(link.hostname) ||
        link.pathname !== '/reset-password' || link.searchParams.getAll('token').length !== 1 ||
        !/^[0-9a-f]{64}$/.test(token ?? '')) stop('STOPPED_RESET_LINK_INPUT_INVALID');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    link = undefined;
    const { Client } = require('pg');
    client = new Client({
      connectionString, ssl, application_name: 'mmhb_reset_record_readonly',
      connectionTimeoutMillis: 8000, query_timeout: 6000,
    });
    // Suppress raw connection error strings, which may contain credentials or SQL.
    client.on('error', () => {});
    report.databaseConnectionsAttempted = 1;
    await client.connect();
    connected = true;
    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    transaction = true;
    const readOnly = await client.query('SHOW transaction_read_only');
    if (readOnly.rows[0]?.transaction_read_only !== 'on') stop('STOPPED_READ_ONLY_NOT_CONFIRMED');
    report.transactionReadOnlyVerified = true;
    await client.query("SET LOCAL statement_timeout = '5s'");
    await client.query("SET LOCAL lock_timeout = '1s'");
    const schema = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'password_reset_tokens'
      AND column_name IN ('token_hash', 'created_at', 'expires_at', 'used_at')
      ORDER BY column_name`);
    const columns = Object.fromEntries(schema.rows.map(row => [row.column_name, row.data_type]));
    if (schema.rows.length !== 4 || columns.token_hash !== 'character varying' ||
        ['created_at', 'expires_at', 'used_at'].some(name => columns[name] !== 'timestamp without time zone'))
      stop('STOPPED_RESET_TABLE_SCHEMA_DIFFERS');
    const result = await client.query(`
      SELECT
        to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS created_at_value,
        to_char(expires_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS expires_at_value,
        to_char(used_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS') AS used_at_value,
        expires_at > $2::timestamp AS expires_after_reference,
        used_at IS NOT NULL AS use_recorded,
        used_at <= $2::timestamp AS use_at_or_before_reference
      FROM public.password_reset_tokens
      WHERE token_hash = $1
      LIMIT 2`, [tokenHash, report.referenceAttemptUtc]);
    report.matchesFoundUpToTwo = result.rows.length;
    report.timestampBasis = 'RAW_TIMESTAMP_WITHOUT_TIME_ZONE; REFERENCE_USES_UTC_CLOCK_FIELDS';
    report.observationLimit = 'CURRENT_WORKSPACE_RECORD; NOT_A_HISTORICAL_SNAPSHOT_OR_PROOF_OF_BROWSER_PAYLOAD';
    report.records = result.rows.map(row => ({
      createdAtStored: safeTime(row.created_at_value),
      expiresAtStored: safeTime(row.expires_at_value),
      usedAtStored: safeTime(row.used_at_value),
      expiresAfterReferenceAttempt: row.expires_after_reference === true,
      useRecorded: row.use_recorded === true,
      useRecordedAtOrBeforeReferenceAttempt: row.use_at_or_before_reference === true,
    }));
    report.status = result.rows.length === 0 ? 'NO_MATCH_IN_WORKSPACE_DATABASE' :
      result.rows.length > 1 ? 'MULTIPLE_MATCHES_REQUIRE_REVIEW' : 'MATCH_FOUND_METADATA_ONLY';
  }
} catch (error) {
  report.status = error.safeStatus ?? 'STOPPED_INSPECTION_ERROR';
  report.errorCode = knownErrors.has(error.code) ? error.code : 'DETAILS_WITHHELD';
  process.exitCode = 1;
} finally {
  if (transaction) {
    try { await client.query('ROLLBACK'); report.rollbackCompleted = true; }
    catch { report.status = 'STOPPED_ROLLBACK_UNCONFIRMED'; process.exitCode = 1; }
  }
  if (client) {
    try { await client.end(); report.connectionClosed = true; }
    catch { report.connectionClosed = false; process.exitCode = 1; }
  }
  report.databaseConnectionEstablished = connected;
  clearTimeout(deadline);
  emit();
}
MMHB_RECORD_JS
}

mmhb_probe preflight
printf '\nPaste the plain link from the FAILED reset email here (hidden).\nDo not paste your password. Press Enter after the link.\n' > /dev/tty
IFS= read -r -s MMHB_PRIVATE_RESET_LINK < /dev/tty
printf '\n' > /dev/tty
export MMHB_PRIVATE_RESET_LINK
mmhb_probe inspect
