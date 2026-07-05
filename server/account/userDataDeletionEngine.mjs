// server/account/userDataDeletionEngine.mjs
// Track E6L — deletion engine skeleton only.
// Not wired into account deletion route yet.

import { DELETE_TABLES } from "./userOwnedDataRegistry.mjs";

export const USER_DATA_DELETION_ENGINE_STATUS = {
  track: "E6L",
  status: "skeleton-not-wired",
  rule: "Do not execute deletion from account route until lifecycle gate is approved.",
};

export function getDeletionPlan() {
  return DELETE_TABLES.map(({ key, column }) => ({
    key,
    column,
    action: "delete",
  }));
}

export async function deleteUserOwnedDataDraftOnly() {
  throw new Error(
    "deleteUserOwnedDataDraftOnly is not wired or executable yet. Approval gate required."
  );
}
