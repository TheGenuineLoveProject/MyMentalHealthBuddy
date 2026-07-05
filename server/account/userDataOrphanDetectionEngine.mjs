// server/account/userDataOrphanDetectionEngine.mjs
// Track E6V — orphan detection design engine only.
// Not wired into account deletion route yet.

import { DELETE_TABLES, EXPORT_TABLES } from "./userOwnedDataRegistry.mjs";

export const USER_DATA_ORPHAN_DETECTION_ENGINE_STATUS = {
  track: "E6V",
  status: "dry-run-design-not-wired",
  rule: "No database scan or destructive action until lifecycle approval gate is passed.",
};

export function getOrphanDetectionPlan() {
  return DELETE_TABLES.map(({ key, column }) => ({
    key,
    column,
    action: "count-remaining-user-owned-rows",
    expectedAfterDeletion: 0,
  }));
}

export function getExportCoveragePlan() {
  const exportKeys = new Set(EXPORT_TABLES.map((entry) => entry.key));

  return DELETE_TABLES.map(({ key }) => ({
    key,
    includedInExport: exportKeys.has(key),
  }));
}

export function getOrphanDetectionDryRunSummary() {
  const orphanPlan = getOrphanDetectionPlan();
  const exportCoverage = getExportCoveragePlan();

  return {
    mode: "dry-run",
    destructive: false,
    tableCount: orphanPlan.length,
    orphanPlan,
    exportCoverage,
  };
}
