import assert from "node:assert/strict";

import {
  USER_DATA_APPROVAL_MANIFEST_HELPERS_STATUS,
  getApprovalGateKeys,
  previewApprovalChange,
} from "../userDataApprovalManifestHelpers.mjs";

assert.equal(USER_DATA_APPROVAL_MANIFEST_HELPERS_STATUS.track, "E8B");
assert.equal(USER_DATA_APPROVAL_MANIFEST_HELPERS_STATUS.status, "helper-design-only-not-wired");
assert.equal(USER_DATA_APPROVAL_MANIFEST_HELPERS_STATUS.runtimeChanged, false);
assert.equal(USER_DATA_APPROVAL_MANIFEST_HELPERS_STATUS.approvalsChanged, false);

const gates = getApprovalGateKeys();

assert.equal(gates.length, 11, "Expected 11 approval gates");
assert.ok(gates.includes("registryApproved"));
assert.ok(gates.includes("productionRolloutApproved"));

const previewOne = previewApprovalChange({
  gateKey: "registryApproved",
  approved: true,
});

assert.equal(previewOne.mode, "preview-only");
assert.equal(previewOne.approvalsChanged, false);
assert.equal(previewOne.runtimeChanged, false);
assert.equal(previewOne.currentValue, false);
assert.equal(previewOne.proposedValue, true);
assert.equal(previewOne.currentSummary.approved, 0);
assert.equal(previewOne.previewSummary.approved, 1);
assert.equal(previewOne.previewSummary.remaining, 10);
assert.equal(previewOne.previewSummary.total, 11);
assert.equal(previewOne.previewSummary.percentage, 9);
assert.equal(previewOne.previewSummary.runtimeAllowed, false);

const previewFalse = previewApprovalChange({
  gateKey: "registryApproved",
  approved: false,
});

assert.equal(previewFalse.previewSummary.approved, 0);
assert.equal(previewFalse.previewSummary.remaining, 11);
assert.equal(previewFalse.previewSummary.runtimeAllowed, false);

assert.throws(
  () => previewApprovalChange({ gateKey: "notARealGate", approved: true }),
  /Unknown approval gate/
);

console.log({
  ok: true,
  gates: gates.length,
  previewApproved: previewOne.previewSummary.approved,
  previewRemaining: previewOne.previewSummary.remaining,
  runtimeAllowed: previewOne.previewSummary.runtimeAllowed,
});
