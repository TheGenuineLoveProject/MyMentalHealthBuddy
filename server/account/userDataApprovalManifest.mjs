// server/account/userDataApprovalManifest.mjs
// Track E7F — approval manifest only.
// No runtime behavior.
// No route wiring.

export const USER_DATA_APPROVAL_MANIFEST_STATUS = {
  track: "E7F",
  status: "approval-freeze-active",
  runtimeChanged: false,
  deletionExecutable: false,
  exportExecutable: false,
};

export const USER_DATA_APPROVAL_MANIFEST = {

  registryApproved: false,

  deletePolicyApproved: false,

  anonymizationApproved: false,

  retentionApproved: false,

  exportApproved: false,

  exportContractApproved: false,

  sectionMappingApproved: false,

  sessionCleanupApproved: false,

  orphanDetectionApproved: false,

  gdprCompletenessApproved: false,

  productionRolloutApproved: false,

};

export function getApprovalSummary() {

  const approvals =
    Object.values(USER_DATA_APPROVAL_MANIFEST)
      .filter(Boolean)
      .length;

  const total =
    Object.keys(USER_DATA_APPROVAL_MANIFEST)
      .length;

  return {

    approved: approvals,

    remaining: total - approvals,

    total,

    percentage:
      Math.round(
        approvals / total * 100
      ),

    runtimeAllowed:
      approvals === total

  };

}
