import assert from "node:assert/strict";

import {
  USER_DATA_EXPORT_CONTRACT_STATUS,
  USER_DATA_EXPORT_VERSION,
  USER_DATA_EXPORT_SECTIONS,
  createEmptyUserDataExportEnvelope,
} from "../userDataExportContract.mjs";

const testUserId = "00000000-0000-0000-0000-000000000000";
const generatedAt = "2026-07-05T00:00:00.000Z";
const envelope = createEmptyUserDataExportEnvelope({ userId: testUserId, generatedAt });

assert.equal(USER_DATA_EXPORT_CONTRACT_STATUS.track, "E6S");
assert.equal(USER_DATA_EXPORT_CONTRACT_STATUS.status, "contract-helper-skeleton-not-wired");

assert.equal(envelope.ok, true);
assert.equal(envelope.exportVersion, USER_DATA_EXPORT_VERSION);
assert.equal(envelope.generatedAt, generatedAt);
assert.equal(envelope.userId, testUserId);
assert.equal(envelope.source, "mymentalhealthbuddy-account-export");

assert.deepEqual(Object.keys(envelope), [
  "ok",
  "exportVersion",
  "generatedAt",
  "userId",
  "source",
  "sections",
  "counts",
  "warnings",
]);

assert.deepEqual(Object.keys(envelope.sections), USER_DATA_EXPORT_SECTIONS);
assert.equal(USER_DATA_EXPORT_SECTIONS.length, 9);
assert.deepEqual(envelope.counts, {});
assert.deepEqual(envelope.warnings, []);

for (const section of USER_DATA_EXPORT_SECTIONS) {
  assert.deepEqual(envelope.sections[section], {}, `${section} must start as empty object`);
}

assert.equal(JSON.stringify(envelope).includes("passwordHash"), false);
assert.equal(JSON.stringify(envelope).includes("session"), false);

console.log({
  ok: true,
  exportVersion: USER_DATA_EXPORT_VERSION,
  sectionCount: USER_DATA_EXPORT_SECTIONS.length,
  envelopeKeys: Object.keys(envelope).length,
});
