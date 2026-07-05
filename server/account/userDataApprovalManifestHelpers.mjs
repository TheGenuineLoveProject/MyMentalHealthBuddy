// server/account/userDataApprovalManifestHelpers.mjs
// Track E8B — approval manifest helper design only.
// Does not modify approval manifest.
// Does not enable runtime.
// Not wired into routes.

import {
  USER_DATA_APPROVAL_MANIFEST,
  getApprovalSummary,
} from "./userDataApprovalManifest.mjs";

export const USER_DATA_APPROVAL_MANIFEST_HELPERS_STATUS = {
  track: "E8B",
  status: "helper-design-only-not-wired",
  runtimeChanged: false,
  approvalsChanged: false,
};

export function getApprovalGateKeys() {
  return Object.keys(USER_DATA_APPROVAL_MANIFEST);
}

export function previewApprovalChange({ gateKey, approved }) {
  if (!getApprovalGateKeys().includes(gateKey)) {
    throw new Error(`Unknown approval gate: ${gateKey}`);
  }

  const nextManifest = {
    ...USER_DATA_APPROVAL_MANIFEST,
    [gateKey]: Boolean(approved),
  };

  const approvedCount = Object.values(nextManifest).filter(Boolean).length;
  const total = Object.keys(nextManifest).length;

  return {
    mode: "preview-only",
    approvalsChanged: false,
    runtimeChanged: false,
    gateKey,
    proposedValue: Boolean(approved),
    currentValue: USER_DATA_APPROVAL_MANIFEST[gateKey],
    currentSummary: getApprovalSummary(),
    previewSummary: {
      approved: approvedCount,
      remaining: total - approvedCount,
      total,
      percentage: Math.round((approvedCount / total) * 100),
      runtimeAllowed: approvedCount === total,
    },
  };
}
