import "./userOwnedDataRegistry.test.mjs";
import "./userDataEngines.test.mjs";
import "./userDataExportContract.test.mjs";
import "./userDataExportSectionMap.test.mjs";
import "./userDataLifecyclePolicy.test.mjs";
import "./userDataApprovalManifestHelpers.test.mjs";
import "./userDataApprovalManifest.test.mjs";

console.log({
  ok: true,
  suite: "account-data-lifecycle",
  tests: [
    "userOwnedDataRegistry.test.mjs",
    "userDataEngines.test.mjs",
    "userDataExportContract.test.mjs",
    "userDataExportSectionMap.test.mjs",
    "userDataLifecyclePolicy.test.mjs",
    "userDataApprovalManifestHelpers.test.mjs",
    "userDataApprovalManifest.test.mjs",
  ],
});
