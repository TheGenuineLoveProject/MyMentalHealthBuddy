// server/account/userDataLifecyclePolicy.mjs
// Track E7B — machine-readable lifecycle policy draft.
// Not wired into deletion/export routes yet.

export const USER_DATA_LIFECYCLE_POLICY_STATUS = {
  track: "E7B",
  status: "policy-draft-not-wired",
  rule: "Policy must be approved before runtime wiring.",
};

export const USER_DATA_LIFECYCLE_POLICY = {
  deleteTables: {
    decision: "APPROVED_DRAFT",
    action: "hard-delete-user-owned-private-records",
  },

  anonymizeTables: {
    decision: "APPROVED_DRAFT",
    action: "retain-content-remove-user-identity",
  },

  retainPolicyReviewTables: {
    auditLog: "LEGAL_REVIEW",
    sessions: "RETAIN_LIMITED_THEN_DESTROY",
    webhookEvents: "RETAIN_LIMITED",
    publishingEvents: "RETAIN_LIMITED",
    agentDecisions: "RETAIN_LIMITED",
    leads: "DELETE_OR_UNSUBSCRIBE_ON_REQUEST",
    invites: "RETAIN_LIMITED_OR_DELETE_ON_REQUEST",
    newsletterSubscribers: "DELETE_OR_UNSUBSCRIBE_ON_REQUEST",
    users: "DELETE_ACCOUNT_ROW_AFTER_CHILD_LIFECYCLE_COMPLETE",
  },

  exportTables: {
    decision: "APPROVED_DRAFT",
    action: "export-all-registered-export-tables",
  },

  sessionCleanup: {
    revokeRefreshTokens: true,
    destroyServerSessions: true,
    clearAuthCookies: true,
    forceLogoutAfterDeletion: true,
  },

  auditLogRetention: {
    decision: "LEGAL_REVIEW",
    recommendedAction: "retain-minimal-tombstoned-audit-trail",
  },

  gdprCompletenessTests: {
    decision: "APPROVED_DRAFT",
    requiredBeforeWiring: true,
  },
};

export function getLifecyclePolicySummary() {
  return {
    track: USER_DATA_LIFECYCLE_POLICY_STATUS.track,
    status: USER_DATA_LIFECYCLE_POLICY_STATUS.status,
    wired: false,
    runtimeBehaviorChanged: false,
    pendingLegalReview: Object.entries(USER_DATA_LIFECYCLE_POLICY.retainPolicyReviewTables)
      .filter(([, decision]) => String(decision).includes("LEGAL_REVIEW"))
      .map(([key]) => key),
    sessionCleanupApprovedDraft: USER_DATA_LIFECYCLE_POLICY.sessionCleanup,
  };
}
