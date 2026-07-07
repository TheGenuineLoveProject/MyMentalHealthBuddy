import crypto from "node:crypto";
import express from "express";
import request from "supertest";

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

function verifyHealthKitSignature(rawBody, providedHexSig, userId, timestamp) {
  if (!rawBody || !providedHexSig || typeof providedHexSig !== "string") return false;
  if (!userId || typeof userId !== "string") return false;
  if (!timestamp || typeof timestamp !== "string") return false;

  const timestampMs = Date.parse(timestamp);
  if (Number.isNaN(timestampMs)) return false;
  if (Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) return false;

  try {
    const expected = sign(rawBody, userId, timestamp);
    const expectedBuf = Buffer.from(expected, "hex");
    const providedBuf = Buffer.from(providedHexSig.toLowerCase(), "hex");
    if (providedBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

function normalizeHealthKitSample(sample) {
  if (!sample || typeof sample !== "object" || Array.isArray(sample)) return null;
  if (sample.type !== "HKQuantityTypeIdentifierHeartRate") return null;
  if (sample.value == null || !sample.startDate) return null;
  const value = Number(sample.value);
  if (!Number.isFinite(value)) return null;
  const recordedAt = new Date(sample.startDate);
  if (Number.isNaN(recordedAt.getTime())) return null;
  if (value < 25 || value > 220) return null;
  return {
    deviceSource: "apple_healthkit",
    metricType: "HEART_RATE_AVG",
    value: String(value),
    unit: "bpm",
    recordedAt,
    metadata: {},
  };
}

function createWebhookContractApp() {
  const seenNonces = new Set();
  const app = express();

  app.use(express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      if (buf?.length) req.rawBody = Buffer.from(buf);
    },
  }));

  app.post("/api/biometrics/healthkit/webhook", async (req, res) => {
    const userId = req.header("x-mmhb-user-id");
    const sig = req.header("x-mmhb-signature");
    const timestamp = req.header("x-mmhb-timestamp");
    const nonce = req.header("x-mmhb-nonce");
    const raw = req.rawBody;

    if (!userId || !sig || !timestamp || !nonce || !raw) {
      return res.status(400).json({ ok: false, error: "missing_signature_or_user_or_body" });
    }
    if (!verifyHealthKitSignature(raw, sig, userId, timestamp)) {
      return res.status(401).json({ ok: false, error: "invalid_signature" });
    }
    if (seenNonces.has(nonce)) {
      return res.status(409).json({ ok: false, error: "replay_detected" });
    }
    seenNonces.add(nonce);

    const payload = req.body || {};
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(422).json({ ok: false, error: "invalid_payload" });
    }
    if (!Array.isArray(payload.samples)) {
      return res.status(422).json({ ok: false, error: "invalid_samples" });
    }

    const samples = payload.samples;
    if (samples.length === 0) {
      return res.json({ ok: true, stored: 0, rejected: 0, deduped: 0 });
    }
    if (samples.length > 1000) {
      return res.status(422).json({ ok: false, error: "too_many_samples", max: 1000 });
    }

    const normalized = samples.map((s) => normalizeHealthKitSample(s)).filter(Boolean);
    return res.json({
      ok: true,
      stored: normalized.length,
      rejected: samples.length - normalized.length,
      deduped: 0,
    });
  });

  return app;
}

function signedRequest(app, bodyObject, { userId, timestamp, nonce, tamperSig = false }) {
  const rawText = JSON.stringify(bodyObject);
  const rawBody = Buffer.from(rawText);
  const sig = tamperSig ? "00" : sign(rawBody, userId, timestamp);

  return request(app)
    .post("/api/biometrics/healthkit/webhook")
    .set("content-type", "application/json")
    .set("x-mmhb-user-id", userId)
    .set("x-mmhb-timestamp", timestamp)
    .set("x-mmhb-nonce", nonce)
    .set("x-mmhb-signature", sig)
    .send(rawText);
}

const app = createWebhookContractApp();
const userId = "00000000-0000-4000-8000-000000000001";
const timestamp = new Date().toISOString();

const validBody = {
  samples: [{
    type: "HKQuantityTypeIdentifierHeartRate",
    value: 72,
    unit: "count/min",
    startDate: timestamp,
    metadata: { sourceName: "Apple Watch" },
  }],
};

const checks = [];

{
  const res = await signedRequest(app, validBody, { userId, timestamp, nonce: "nonce-valid-1" });
  checks.push(["valid webhook accepted", res.status === 200 && res.body.ok === true && res.body.stored === 1]);
}

{
  const res = await signedRequest(app, validBody, { userId, timestamp, nonce: "nonce-valid-1" });
  checks.push(["same nonce replay rejected", res.status === 409 && res.body.error === "replay_detected"]);
}

{
  const res = await signedRequest(app, validBody, { userId, timestamp, nonce: "nonce-bad-sig", tamperSig: true });
  checks.push(["bad signature rejected", res.status === 401 && res.body.error === "invalid_signature"]);
}

{
  const res = await signedRequest(app, {}, { userId, timestamp, nonce: "nonce-invalid-samples" });
  checks.push(["missing samples rejected", res.status === 422 && res.body.error === "invalid_samples"]);
}

{
  const res = await signedRequest(app, { samples: new Array(1001).fill(validBody.samples[0]) }, { userId, timestamp, nonce: "nonce-too-many" });
  checks.push(["too many samples rejected", res.status === 422 && res.body.error === "too_many_samples"]);
}

{
  const res = await signedRequest(app, { samples: [{ ...validBody.samples[0], value: "abc" }] }, { userId, timestamp, nonce: "nonce-bad-value" });
  checks.push(["bad sample rejected not stored", res.status === 200 && res.body.ok === true && res.body.stored === 0 && res.body.rejected === 1]);
}

const failed = checks.filter(([, ok]) => !ok);

for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
}

if (failed.length) {
  console.error("HEALTHKIT_WEBHOOK_CONTRACT_FAIL");
  process.exit(1);
}

console.log("HEALTHKIT_WEBHOOK_CONTRACT_PASS");
