// server/account/userDataDeletionEngine.mjs
// Track E6Q — deletion engine dry-run only.
// Not wired into account deletion route yet.

import { DELETE_TABLES } from "./userOwnedDataRegistry.mjs";

export const USER_DATA_DELETION_ENGINE_STATUS = {
  track: "E6Q",
  status: "dry-run-only-not-wired",
  rule: "No destructive deletion until lifecycle approval gate is passed.",
};

export function getDeletionPlan() {
  return DELETE_TABLES.map(({ key, column }) => ({
    key,
    column,
    action: "delete",
  }));
}

export function getDeletionDryRunSummary() {
  const plan = getDeletionPlan();

  return {
    mode: "dry-run",
    destructive: false,
    tableCount: plan.length,
    tables: plan,
  };
}

export async function deleteUserOwnedDataDraftOnly() {
  throw new Error(
    "deleteUserOwnedDataDraftOnly is blocked. Dry-run only until approval gate is passed."
  );
}
