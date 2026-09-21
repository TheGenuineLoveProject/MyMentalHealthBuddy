import fs from "node:fs";
import crypto from "node:crypto";

const EXPECTED = Object.freeze({
  "server/routes/auth.mjs":
    "fd4d9d7cfc75e23fc60dde5df5139ffb1fc826a338acf3c9cc7c2faba4ce362c",
  "server/services/refreshTokens.service.mjs":
    "5a9756caa3c772ac8c70f4a7860372dd42895e7df47c4e0956e42fa041528e8e",
  "server/routes/account.mjs":
    "665a3747fe926d1384c92c26e4457cee4b35bffd3864b75d675cdb65550a1752",
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
          : "ACCOUNT_SECURITY_SOURCE_HASH";

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

  console.log("STATUS=AUTH_SESSION_CONTRACTS_PASS");
  console.log(
    "CONTRACT=HASH_FROZEN_AUDITED_SOURCE_AND_EXACT_PIPELINE_WIRING"
  );
  console.log("RUNTIME_LOGOUT_ISOLATION=UNKNOWN");
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
