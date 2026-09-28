import fs from "node:fs";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const EXPECTED = Object.freeze({
  "server/replit_integrations/auth/storage.mjs": "9eddeef15ea27bac5ecc38da25e61b4487b87b2f7e285e5d718e221a90fae7da",
  "server/routes/auth.mjs": "32c9aa86bfe2704e7e6872e9ca2cb51de2f37136fd62eab921f40e451ad601a9",
  "server/security/csrf.mjs": "e700c729408614c4a638365ef47a7b4a5c043112489b8be3f15b93d7178ce8bf",
  "client/src/context/AuthContext.jsx": "b63819acaacde6767da9df8c4901e1958131ec9d82d4b073cd66f35dbddcd046",
  "client/src/api/fetchWithAuth.js": "7dc437f7f008d48a3dbd4cb3b597821be67701de7d7d7b9b9505d5d0d8482660",
  "client/src/api/authGeneration.js": "7a47bd16d66b2db4cbed1047d79a5a2a7f1001be365e7c4003512c04bb8754ef",
  "server/services/refreshTokens.service.mjs": "57e7b6b9eae46b971a9494a1320cd739f23b036097cd738aaf078861c55e45be",
  "server/routes/account.mjs": "e766374c5bc57032a5ad8573ed1c9bb37ef66dceb703957bf2bba289a5acd331",
  "server/services/refreshFamilyAdapter.mjs": "8cb12cc57ca893d2b399ca8ebf61ca52378d5c2bc3c777d87190904b1999b2df",
  "server/db/refresh-family/refresh-family-v1.sql": "1feb46d6f7f142c34403032ca1a87e3f8a6f1e493e91a5b63cdf075624d4f340",
  "scripts/security/refresh-family/adapter-boundary.test.mjs": "07986b65d2bb56271c6d3f589f2e9acfe5fbab20604c02807c984736d72e99d8",
  "scripts/security/refresh-family/service-wiring.test.mjs": "d249bf4c085109cd22ed685589a5296f272858906f86cdca80674582dede3845"
});

const VERIFY_COMMAND =
  "node scripts/security/verify-auth-session-contracts.mjs";

const EXPECTED_TEST_PIPELINE =
  "npm run typecheck && npm run verify:auth-session-contracts && npm run verify:safety-guardrails && npm run verify:stripe-contract && npm run verify:rate-limit && npm run verify:healthkit && npm run verify:foundation";

function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function loadContents() {
  const contents = {};

  for (const file of [...Object.keys(EXPECTED), "package.json"]) {
    if (!fs.existsSync(file)) {
      throw new Error(`MISSING_FILE:${file}`);
    }

    contents[file] = fs.readFileSync(file);
  }

  return contents;
}

function evaluate(contents, emit = true) {
  const failures = [];

  const gate = (name, condition, detail = "") => {
    if (emit) {
      console.log(
        `GATE=${name} RESULT=${condition ? "PASS" : "FAIL"}${
          detail ? ` ${detail}` : ""
        }`
      );
    }

    if (!condition) failures.push(name);
  };

  for (const [file, expectedHash] of Object.entries(EXPECTED)) {
    const actualHash = contents[file]
      ? digest(contents[file])
      : "MISSING";

    const label =
      file === "server/routes/auth.mjs"
        ? "AUTH_SOURCE_HASH"
        : file === "server/services/refreshTokens.service.mjs"
          ? "REFRESH_SERVICE_HASH"
          : file === "server/routes/account.mjs"
            ? "ACCOUNT_SECURITY_SOURCE_HASH"
            : "SOURCE_HASH:" + file;

    gate(label, actualHash === expectedHash, `SHA256=${actualHash}`);
  }

  let pkg = null;

  try {
    pkg = JSON.parse(String(contents["package.json"] ?? ""));
  } catch {
    // Reported by PACKAGE_JSON_VALID.
  }

  gate("PACKAGE_JSON_VALID", Boolean(pkg));

  gate(
    "PACKAGE_COMMAND_EXACT",
    pkg?.scripts?.["verify:auth-session-contracts"] === VERIFY_COMMAND
  );

  gate(
    "TEST_PIPELINE_EXACT",
    pkg?.scripts?.test === EXPECTED_TEST_PIPELINE
  );

  gate(
    "VERIFIER_PRE_POST_HOOKS_ABSENT",
    !("preverify:auth-session-contracts" in (pkg?.scripts ?? {})) &&
      !("postverify:auth-session-contracts" in (pkg?.scripts ?? {}))
  );

  return failures;
}

function clone(contents) {
  return Object.fromEntries(
    Object.entries(contents).map(
      ([file, value]) => [file, Buffer.from(value)]
    )
  );
}

function selfTest(baseline) {
  const cases = [
    {
      name: "BASELINE",
      expectedFailure: null,
      mutate: contents => contents,
    },
    {
      name: "AUTH_DRIFT",
      expectedFailure: "AUTH_SOURCE_HASH",
      mutate: contents => {
        contents["server/routes/auth.mjs"] = Buffer.concat([
          contents["server/routes/auth.mjs"],
          Buffer.from("\n"),
        ]);
        return contents;
      },
    },
    {
      name: "SERVICE_DRIFT",
      expectedFailure: "REFRESH_SERVICE_HASH",
      mutate: contents => {
        contents["server/services/refreshTokens.service.mjs"] =
          Buffer.concat([
            contents["server/services/refreshTokens.service.mjs"],
            Buffer.from("\n"),
          ]);
        return contents;
      },
    },
    {
      name: "ACCOUNT_SECURITY_DRIFT",
      expectedFailure: "ACCOUNT_SECURITY_SOURCE_HASH",
      mutate: contents => {
        contents["server/routes/account.mjs"] = Buffer.concat([
          contents["server/routes/account.mjs"],
          Buffer.from("\n"),
        ]);
        return contents;
      },
    },
    {
      name: "BYPASSED_TEST_STEP",
      expectedFailure: "TEST_PIPELINE_EXACT",
      mutate: contents => {
        const pkg = JSON.parse(String(contents["package.json"]));

        pkg.scripts.test = pkg.scripts.test.replace(
          "npm run verify:auth-session-contracts",
          "npm run verify:auth-session-contracts || true"
        );

        contents["package.json"] =
          Buffer.from(JSON.stringify(pkg));

        return contents;
      },
    },
    {
      name: "MISSING_EXACT_TEST_STEP",
      expectedFailure: "TEST_PIPELINE_EXACT",
      mutate: contents => {
        const pkg = JSON.parse(String(contents["package.json"]));

        pkg.scripts.test = pkg.scripts.test.replace(
          "npm run verify:auth-session-contracts",
          "npm run verify:auth-session-contracts:shadow"
        );

        contents["package.json"] =
          Buffer.from(JSON.stringify(pkg));

        return contents;
      },
    },
    {
      name: "INJECTED_PRE_HOOK",
      expectedFailure: "VERIFIER_PRE_POST_HOOKS_ABSENT",
      mutate: contents => {
        const pkg = JSON.parse(String(contents["package.json"]));

        pkg.scripts["preverify:auth-session-contracts"] =
          "exit 0";

        contents["package.json"] =
          Buffer.from(JSON.stringify(pkg));

        return contents;
      },
    },
  ];

  for (const file of Object.keys(EXPECTED)) {
    if (["server/routes/auth.mjs", "server/services/refreshTokens.service.mjs", "server/routes/account.mjs"].includes(file)) continue;
    cases.push({
      name: "ADDED_SOURCE_DRIFT:" + file,
      expectedFailure: "SOURCE_HASH:" + file,
      mutate: contents => { contents[file] = Buffer.concat([contents[file], Buffer.from("\n")]); return contents; },
    });
  }
  cases.push({
    name: "INJECTED_POST_HOOK",
    expectedFailure: "VERIFIER_PRE_POST_HOOKS_ABSENT",
    mutate: contents => {
      const pkg = JSON.parse(String(contents["package.json"]));
      pkg.scripts["postverify:auth-session-contracts"] = "exit 0";
      contents["package.json"] = Buffer.from(JSON.stringify(pkg)); return contents;
    },
  });

  let failed = 0;

  for (const testCase of cases) {
    const failures = evaluate(
      testCase.mutate(clone(baseline)),
      false
    );

    const correct = testCase.expectedFailure
      ? failures.includes(testCase.expectedFailure)
      : failures.length === 0;

    console.log(
      `SELF_TEST=${testCase.name} RESULT=${
        correct ? "PASS" : "FAIL"
      }`
    );

    if (!correct) failed += 1;
  }

  if (failed > 0) {
    throw new Error(`SELF_TEST_FAILURE_COUNT:${failed}`);
  }
}

function runLocalBehaviorChecks() {
  // No inherited NODE_OPTIONS, NODE_PATH, DATABASE_URL or dotenv preloads.
  const env = { PATH: process.env.PATH || "/usr/bin:/bin", LANG: "C", LC_ALL: "C",
    TZ: "UTC", NODE_DISABLE_COMPILE_CACHE: "1" };
  const commands = [
    ["scripts/security/refresh-family/adapter-boundary.test.mjs"],
    ["--experimental-vm-modules", "scripts/security/refresh-family/service-wiring.test.mjs"],
  ];
  for (const args of commands) {
    const p = spawnSync(process.execPath, args, { cwd: process.cwd(), env,
      encoding: "utf8", timeout: 15000, maxBuffer: 1024 * 1024 });
    if (p.stdout) process.stdout.write(p.stdout);
    if (p.error || p.status !== 0) {
      if (p.stderr) process.stderr.write(p.stderr);
      throw new Error("LOCAL_BEHAVIOR_CHECK_FAILED:" + args.at(-1));
    }
  }
}

try {
  const contents = loadContents();

  selfTest(contents);

  const failures = evaluate(contents);

  if (failures.length > 0) {
    console.error(
      `STATUS=AUTH_SESSION_CONTRACTS_FAILED FAILURE_COUNT=${failures.length}`
    );
    process.exit(1);
  }

  runLocalBehaviorChecks();
  console.log("STATUS=AUTH_SESSION_CONTRACTS_PASS");
  console.log(
    "CONTRACT=HASH_FROZEN_REVIEWED_SOURCE_EXACT_PIPELINE_AND_LOCAL_BOUNDARY_TESTS"
  );
  console.log("RUNTIME_LOGOUT_ISOLATION=UNKNOWN");
  console.log("LIVE_DATABASE_CUTOVER=NOT_QUALIFIED_BY_THIS_CHECK");
  console.log("DEPLOYED_ARTIFACT_PROVEN=NO");
} catch (error) {
  console.error("STATUS=AUTH_SESSION_CONTRACTS_FAILED");
  console.error(
    `FAILURE=${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
}
