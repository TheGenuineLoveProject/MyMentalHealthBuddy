import assert from "node:assert/strict";

import { EXPORT_TABLES } from "../userOwnedDataRegistry.mjs";
import { USER_DATA_EXPORT_SECTIONS } from "../userDataExportContract.mjs";
import {
  USER_DATA_EXPORT_SECTION_MAP_STATUS,
  USER_DATA_EXPORT_SECTION_MAP,
  getExportSectionMapSummary,
} from "../userDataExportSectionMap.mjs";

assert.equal(USER_DATA_EXPORT_SECTION_MAP_STATUS.track, "E6W");
assert.equal(USER_DATA_EXPORT_SECTION_MAP_STATUS.status, "section-map-design-not-wired");

const summary = getExportSectionMapSummary();
assert.equal(summary.mode, "design-only");
assert.equal(summary.wired, false);

const sectionNames = Object.keys(USER_DATA_EXPORT_SECTION_MAP);
assert.deepEqual(sectionNames, USER_DATA_EXPORT_SECTIONS);

const mappedKeys = Object.values(USER_DATA_EXPORT_SECTION_MAP).flat();
const exportKeys = EXPORT_TABLES.map((entry) => entry.key);

assert.equal(mappedKeys.length, exportKeys.length, "Mapped table count must match EXPORT_TABLES count");
assert.deepEqual([...new Set(mappedKeys)].sort(), [...new Set(exportKeys)].sort());

for (const section of USER_DATA_EXPORT_SECTIONS) {
  assert.ok(Array.isArray(USER_DATA_EXPORT_SECTION_MAP[section]), `${section} must map to an array`);
}

console.log({
  ok: true,
  sectionCount: sectionNames.length,
  mappedTables: mappedKeys.length,
  exportTables: exportKeys.length,
});
