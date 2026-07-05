// server/account/userDataExportEngine.mjs
// Track E6M — export engine skeleton only.
// Not wired into account export route yet.

import { EXPORT_TABLES } from "./userOwnedDataRegistry.mjs";

export const USER_DATA_EXPORT_ENGINE_STATUS = {
  track: "E6M",
  status: "skeleton-not-wired",
  rule: "Do not execute export from account route until export contract is approved.",
};

export function getExportPlan() {
  return EXPORT_TABLES.map(({ key, column }) => ({
    key,
    column,
    action: "export",
  }));
}

export async function exportUserOwnedDataDraftOnly() {
  throw new Error(
    "exportUserOwnedDataDraftOnly is not wired or executable yet. Approval gate required."
  );
}
