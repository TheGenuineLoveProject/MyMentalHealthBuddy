import assert from "node:assert/strict";

import {
  USER_DATA_APPROVAL_MANIFEST_STATUS,
  USER_DATA_APPROVAL_MANIFEST,
  getApprovalSummary,
} from "../userDataApprovalManifest.mjs";

assert.equal(
  USER_DATA_APPROVAL_MANIFEST_STATUS.track,
  "E7F"
);

assert.equal(
  USER_DATA_APPROVAL_MANIFEST_STATUS.status,
  "approval-freeze-active"
);

assert.equal(
  USER_DATA_APPROVAL_MANIFEST_STATUS.runtimeChanged,
  false
);

assert.equal(
  USER_DATA_APPROVAL_MANIFEST_STATUS.deletionExecutable,
  false
);

assert.equal(
  USER_DATA_APPROVAL_MANIFEST_STATUS.exportExecutable,
  false
);

const keys =
  Object.keys(
    USER_DATA_APPROVAL_MANIFEST
  );

assert.equal(
  keys.length,
  11,
  "Approval manifest must contain 11 gates"
);

for (const key of keys) {

  assert.equal(
    typeof USER_DATA_APPROVAL_MANIFEST[key],
    "boolean"
  );

  assert.equal(
    USER_DATA_APPROVAL_MANIFEST[key],
    false
  );

}

const summary =
  getApprovalSummary();

assert.equal(summary.approved, 0);
assert.equal(summary.remaining, 11);
assert.equal(summary.total, 11);
assert.equal(summary.percentage, 0);
assert.equal(summary.runtimeAllowed, false);

console.log({

  ok: true,

  gates:
    keys.length,

  approved:
    summary.approved,

  remaining:
    summary.remaining,

  runtimeAllowed:
    summary.runtimeAllowed

});
