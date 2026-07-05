import assert from "node:assert/strict";

import {
  RETAIN_POLICY_REVIEW_TABLES,
} from "../userOwnedDataRegistry.mjs";

import {
  USER_DATA_LIFECYCLE_POLICY_STATUS,
  USER_DATA_LIFECYCLE_POLICY,
  getLifecyclePolicySummary,
} from "../userDataLifecyclePolicy.mjs";

assert.equal(USER_DATA_LIFECYCLE_POLICY_STATUS.track, "E7B");
assert.equal(USER_DATA_LIFECYCLE_POLICY_STATUS.status, "policy-draft-not-wired");

assert.equal(USER_DATA_LIFECYCLE_POLICY.deleteTables.decision, "APPROVED_DRAFT");
assert.equal(USER_DATA_LIFECYCLE_POLICY.anonymizeTables.decision, "APPROVED_DRAFT");
assert.equal(USER_DATA_LIFECYCLE_POLICY.exportTables.decision, "APPROVED_DRAFT");

const retainKeys = RETAIN_POLICY_REVIEW_TABLES.map((entry) => entry.key).sort();
const policyRetainKeys = Object.keys(USER_DATA_LIFECYCLE_POLICY.retainPolicyReviewTables).sort();

assert.deepEqual(policyRetainKeys, retainKeys, "Policy must cover every retain-policy-review table");

const sessionCleanup = USER_DATA_LIFECYCLE_POLICY.sessionCleanup;

assert.equal(sessionCleanup.revokeRefreshTokens, true);
assert.equal(sessionCleanup.destroyServerSessions, true);
assert.equal(sessionCleanup.clearAuthCookies, true);
assert.equal(sessionCleanup.forceLogoutAfterDeletion, true);

assert.equal(USER_DATA_LIFECYCLE_POLICY.auditLogRetention.decision, "LEGAL_REVIEW");
assert.equal(USER_DATA_LIFECYCLE_POLICY.gdprCompletenessTests.requiredBeforeWiring, true);

const summary = getLifecyclePolicySummary();

assert.equal(summary.wired, false);
assert.equal(summary.runtimeBehaviorChanged, false);
assert.deepEqual(summary.pendingLegalReview, ["auditLog"]);

console.log({
  ok: true,
  retainPolicyTables: retainKeys.length,
  pendingLegalReview: summary.pendingLegalReview,
  sessionCleanupApprovedDraft: sessionCleanup,
});
