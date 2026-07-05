import assert from "node:assert/strict";

import { DELETE_TABLES, EXPORT_TABLES } from "../userOwnedDataRegistry.mjs";
import { getDeletionPlan } from "../userDataDeletionEngine.mjs";
import { getExportPlan } from "../userDataExportEngine.mjs";
import { getSessionCleanupPlan } from "../userSessionCleanupEngine.mjs";

const deletionPlan = getDeletionPlan();
const exportPlan = getExportPlan();
const cleanupPlan = getSessionCleanupPlan();

assert.equal(deletionPlan.length, DELETE_TABLES.length, "Deletion plan must match DELETE_TABLES");
assert.equal(exportPlan.length, EXPORT_TABLES.length, "Export plan must match EXPORT_TABLES");
assert.equal(cleanupPlan.length, 3, "Session cleanup plan must include refresh tokens, sessions, cookies");

for (const item of deletionPlan) {
  assert.equal(item.action, "delete");
  assert.ok(item.key);
  assert.ok(item.column);
}

for (const item of exportPlan) {
  assert.equal(item.action, "export");
  assert.ok(item.key);
  assert.ok(item.column);
}

console.log({
  ok: true,
  deletionPlan: deletionPlan.length,
  exportPlan: exportPlan.length,
  cleanupPlan: cleanupPlan.length,
});
