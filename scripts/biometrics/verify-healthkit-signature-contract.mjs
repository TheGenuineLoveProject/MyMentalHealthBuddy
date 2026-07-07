import crypto from "node:crypto";
import { verifyHealthKitSignature } from "../../server/biometrics/crypto.mjs";

process.env.JWT_SECRET ||= "w11-healthkit-test-secret-minimum-32-chars";

const SALT = Buffer.from("mmhb-biometric-aead-v1-salt00000", "utf8");

function getWebhookKey() {
  return Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(process.env.JWT_SECRET, "utf8"),
      SALT,
      Buffer.from("healthkit-webhook-v1", "utf8"),
      32,
    ),
  );
}

function sign(rawBody, userId, timestamp) {
  const signedPayload = Buffer.concat([
    Buffer.from(userId, "utf8"),
    Buffer.from(".", "utf8"),
    Buffer.from(timestamp, "utf8"),
    Buffer.from(".", "utf8"),
    Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody)),
  ]);

  return crypto.createHmac("sha256", getWebhookKey()).update(signedPayload).digest("hex");
}

const userId = "00000000-0000-4000-8000-000000000001";
const timestamp = new Date().toISOString();
const body = Buffer.from(JSON.stringify({
  samples: [
    {
      type: "HKQuantityTypeIdentifierHeartRate",
      value: 72,
      unit: "count/min",
      startDate: timestamp,
      metadata: { sourceName: "Apple Watch" }
    }
  ]
}));

const goodSig = sign(body, userId, timestamp);

const checks = [
  ["valid signature", verifyHealthKitSignature(body, goodSig, userId, timestamp) === true],
  ["tampered body rejected", verifyHealthKitSignature(Buffer.from('{"samples":[]}'), goodSig, userId, timestamp) === false],
  ["wrong user rejected", verifyHealthKitSignature(body, goodSig, "00000000-0000-4000-8000-000000000002", timestamp) === false],
  ["bad timestamp rejected", verifyHealthKitSignature(body, goodSig, userId, "not-a-date") === false],
  ["bad signature rejected", verifyHealthKitSignature(body, "00", userId, timestamp) === false],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
}

if (failed.length) {
  console.error("HEALTHKIT_SIGNATURE_CONTRACT_FAIL");
  process.exit(1);
}

console.log("HEALTHKIT_SIGNATURE_CONTRACT_PASS");
