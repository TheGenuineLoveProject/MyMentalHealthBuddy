#!/usr/bin/env bash
# MMHB only. Default: read-only qualification. --apply: one guarded source edit.
# Rollback: bash this-script --rollback /absolute/backup/directory
set -euo pipefail
env -u NODE_OPTIONS -u NODE_PATH node --input-type=module - "$@" <<'MMHB_RECOVERY_RESULT'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const originalHash = 'e766374c5bc57032a5ad8573ed1c9bb37ef66dceb703957bf2bba289a5acd331';
const helperHash = '9a787e04026ec9225fca35420546d744fc78874958739eab76a0c9754fef7113';
const target = 'server/routes/account.mjs';
const before = `    if (emailResult?.skipped) {
      logger.warn("Password reset email skipped because email service is not configured", { email });
    } else {
      logger.info("Password reset email queued", { email });
    }`;
const after = `    // MMHB_RECOVERY_PROVIDER_ACCEPTANCE_V1: acceptance is not inbox delivery.
    if (
      emailResult?.ok === true &&
      !emailResult?.result?.error &&
      typeof emailResult?.result?.data?.id === "string" &&
      emailResult.result.data.id.trim().length > 0
    ) {
      logger.info("Password reset email accepted by provider", { requestId: req.requestId });
    } else {
      logger.warn("Password reset email not accepted by provider", {
        requestId: req.requestId,
        reason: emailResult?.skipped
          ? "EMAIL_NOT_CONFIGURED"
          : emailResult?.result?.error
            ? "EMAIL_PROVIDER_REJECTED"
            : "EMAIL_ACCEPTANCE_UNCONFIRMED",
      });
    }`;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fail = code => { throw Object.assign(new Error(code), { safeCode: code }); };
const say = value => console.log(JSON.stringify(value));
const root = fs.realpathSync('.');
const args = process.argv.slice(2);
let backup = null;
let changed = 0;
const context = {
  applicationStarted: false, databaseConnections: 0, accountRowsRead: 0,
  emailsSent: 0, networkRequests: 0, buildRuns: 0, deploymentRuns: 0,
  productionVerified: false,
};

function read(full) {
  const stat = fs.lstatSync(full);
  if (!stat.isFile() || fs.realpathSync(full) !== full || stat.size > 2097152)
    fail('REGULAR_SOURCE_FILE_REQUIRED');
  return fs.readFileSync(full);
}
function once(text, oldText, newText) {
  if (text.split(oldText).length !== 2) fail('EXACT_SINGLE_BLOCK_REQUIRED');
  return text.replace(oldText, newText);
}
function syntax(text) {
  const checked = spawnSync(process.execPath, ['--check', '--input-type=module'], {
    input: text, encoding: 'utf8', timeout: 15000, maxBuffer: 1048576,
  });
  if (checked.status !== 0 || checked.error) fail('CANDIDATE_SYNTAX_FAILED');
}
function qualify() {
  const cases = [
    { value: { ok: true, result: { data: { id: 'test-id' }, error: null } }, accepted: true },
    { value: { ok: true, result: { data: { id: 'test-id' } } }, accepted: true },
    { value: { ok: true, result: { data: null, error: { name: 'validation_error', message: 'PRIVATE_SENTINEL' } } }, reason: 'EMAIL_PROVIDER_REJECTED' },
    { value: { ok: true, result: { data: { id: 'test-id' }, error: { message: 'PRIVATE_SENTINEL' } } }, reason: 'EMAIL_PROVIDER_REJECTED' },
    { value: { ok: false, skipped: true }, reason: 'EMAIL_NOT_CONFIGURED' },
    { value: { ok: true, result: { data: { id: '' } } }, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: { ok: true, result: { data: { id: '  ' } } }, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: { ok: true, result: { data: { id: 12 } } }, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: { ok: false, result: { data: { id: 'test-id' } } }, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: { ok: true, result: {} }, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: { ok: true }, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: null, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
    { value: undefined, reason: 'EMAIL_ACCEPTANCE_UNCONFIRMED' },
  ];
  let baselineFalseAcceptances = 0;
  for (const test of cases) {
    function run(source) {
      const logs = [];
      vm.runInNewContext(source, {
        emailResult: test.value, email: 'PRIVATE_SENTINEL@example.invalid',
        req: { requestId: 'synthetic-request' },
        logger: {
          info: (message, metadata) => logs.push({ level: 'info', message, metadata }),
          warn: (message, metadata) => logs.push({ level: 'warn', message, metadata }),
        },
      }, { timeout: 1000 });
      return logs;
    }
    const oldLogs = run(before);
    if (!test.accepted && oldLogs[0].level === 'info') baselineFalseAcceptances++;
    const logs = run(after);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].level, test.accepted ? 'info' : 'warn');
    assert.equal(logs[0].metadata.requestId, 'synthetic-request');
    if (!test.accepted) assert.equal(logs[0].metadata.reason, test.reason);
    assert.equal(JSON.stringify(logs).includes('PRIVATE_SENTINEL'), false);
  }
  assert.ok(baselineFalseAcceptances > 0);
  return { isolatedResultCases: cases.length, baselineFalseAcceptances };
}
function replaceAtomic(full, bytes, mode) {
  const temp = path.join(path.dirname(full), `.mmhb-recovery-${crypto.randomUUID()}.tmp`);
  fs.writeFileSync(temp, bytes, { flag: 'wx', mode });
  try {
    fs.chmodSync(temp, mode);
    fs.renameSync(temp, full);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}

try {
  const mode = args[0] || '--check';
  if (!['--check', '--apply', '--rollback', '--self-test'].includes(mode) ||
      (mode === '--rollback' ? args.length !== 2 : args.length > 1)) fail('INVALID_ARGUMENTS');
  const tests = qualify();
  if (mode === '--self-test') {
    say({ status: 'RECOVERY_RESULT_ISOLATED_TESTS_PASSED', ...tests, sourceFilesChanged: 0, ...context });
  } else {
    const manifest = JSON.parse(read(path.join(root, 'package.json')).toString('utf8'));
    if (manifest.name !== 'mymentalhealthbuddy') fail('WRONG_PROJECT');
    if (sha(read(path.join(root, 'server/utils/email.mjs'))) !== helperHash) fail('EMAIL_HELPER_CHANGED_REVIEW_REQUIRED');
    const full = path.join(root, target);
    const original = read(full);
    const text = original.toString('utf8');
    const permissions = fs.statSync(full).mode & 0o777;
    const already = text.includes(after);
    if (already) {
      if (sha(once(text, after, before)) !== originalHash) fail('ACCOUNT_SOURCE_CHANGED_REVIEW_REQUIRED');
    } else if (sha(original) !== originalHash) fail('ACCOUNT_SOURCE_CHANGED_REVIEW_REQUIRED');
    const candidate = already ? text : once(text, before, after);
    syntax(candidate);
    if (mode === '--rollback') {
      if (!already) fail('ROLLBACK_REQUIRES_EXACT_REPAIRED_SOURCE');
      const directory = args[1];
      if (!path.isAbsolute(directory) || fs.realpathSync(directory) !== directory) fail('INVALID_BACKUP_DIRECTORY');
      const receipt = JSON.parse(read(path.join(directory, 'receipt.json')).toString('utf8'));
      const saved = read(path.join(directory, 'account.mjs'));
      if (receipt.root !== root || receipt.target !== target || receipt.originalHash !== originalHash ||
          receipt.candidateHash !== sha(original) || sha(saved) !== originalHash) fail('BACKUP_MISMATCH');
      syntax(saved.toString('utf8'));
      if (sha(read(full)) !== sha(original)) fail('CONCURRENT_SOURCE_CHANGE');
      replaceAtomic(full, saved, permissions);
      changed = 1;
      if (sha(read(full)) !== originalHash) fail('ROLLBACK_VERIFICATION_FAILED');
      say({ status: 'RECOVERY_RESULT_ROLLED_BACK', sourceFilesChanged: changed, ...context });
    } else if (already) {
      say({ status: 'RECOVERY_RESULT_ALREADY_REPAIRED', ...tests, sourceFilesChanged: 0, ...context });
    } else if (mode === '--check') {
      say({ status: 'RECOVERY_RESULT_READY_TO_APPLY', ...tests, originalHash, candidateHash: sha(candidate),
        sourceFilesChanged: 0, ...context });
    } else {
      backup = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-recovery-result-'));
      fs.chmodSync(backup, 0o700);
      fs.writeFileSync(path.join(backup, 'account.mjs'), original, { flag: 'wx', mode: 0o600 });
      fs.writeFileSync(path.join(backup, 'receipt.json'), JSON.stringify({ root, target, originalHash,
        candidateHash: sha(candidate) }), { flag: 'wx', mode: 0o600 });
      if (sha(read(path.join(backup, 'account.mjs'))) !== originalHash) fail('BACKUP_VERIFICATION_FAILED');
      if (sha(read(full)) !== originalHash) fail('CONCURRENT_SOURCE_CHANGE');
      replaceAtomic(full, candidate, permissions);
      changed = 1;
      if (sha(read(full)) !== sha(candidate)) fail('WRITE_VERIFICATION_FAILED');
      say({ status: 'RECOVERY_RESULT_SOURCE_REPAIRED', ...tests, sourceFilesChanged: changed,
        backup, originalHash, candidateHash: sha(candidate), ...context });
    }
  }
} catch (error) {
  say({ status: 'STOP', reason: error.safeCode || 'INSPECTION_OR_QUALIFICATION_FAILED',
    sourceFilesChanged: changed, backup, ...context });
  process.exitCode = 1;
}
MMHB_RECOVERY_RESULT
