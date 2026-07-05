import assert from "node:assert/strict";
import {
  DELETE_TABLES,
  ANONYMIZE_TABLES,
  RETAIN_POLICY_REVIEW_TABLES,
  EXPORT_TABLES,
} from "../userOwnedDataRegistry.mjs";

const all = [
  ...DELETE_TABLES,
  ...ANONYMIZE_TABLES,
  ...RETAIN_POLICY_REVIEW_TABLES,
  ...EXPORT_TABLES,
];

for (const entry of all) {
  assert.ok(entry.key, "Every registry entry needs key");
  assert.ok(entry.table, `Missing table object for ${entry.key}`);
  assert.ok("column" in entry, `Missing column field for ${entry.key}`);
}

const deleteKeys = new Set(DELETE_TABLES.map((x) => x.key));
const anonymizeKeys = new Set(ANONYMIZE_TABLES.map((x) => x.key));

for (const entry of DELETE_TABLES) {
  assert.equal(entry.column, "userId", `${entry.key} delete table must use userId`);
}

for (const entry of EXPORT_TABLES) {
  assert.ok(
    deleteKeys.has(entry.key) || anonymizeKeys.has(entry.key),
    `${entry.key} export entry must be delete/anonymize-owned`
  );
}

console.log({
  ok: true,
  deleteTables: DELETE_TABLES.length,
  anonymizeTables: ANONYMIZE_TABLES.length,
  retainPolicyReviewTables: RETAIN_POLICY_REVIEW_TABLES.length,
  exportTables: EXPORT_TABLES.length,
});
