import "./userOwnedDataRegistry.test.mjs";
import "./userDataEngines.test.mjs";
import "./userDataExportContract.test.mjs";
import "./userDataExportSectionMap.test.mjs";

console.log({
  ok: true,
  suite: "account-data-lifecycle",
  tests: [
    "userOwnedDataRegistry.test.mjs",
    "userDataEngines.test.mjs",
    "userDataExportContract.test.mjs",
    "userDataExportSectionMap.test.mjs",
  ],
});
