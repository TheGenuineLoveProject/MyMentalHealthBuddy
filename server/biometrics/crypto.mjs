// server/biometrics/crypto.mjs
//
// AES-256-GCM token encryption for biometric_connections.
// Key is derived once via HKDF-SHA256 from JWT_SECRET with a fixed
// context label so we don't require a separate secret. Per-encryption
// 12-byte random IV; 16-byte auth tag is appended; storage is base64.
//
// Storage layout: base64( IV[12] || TAG[16] || CIPHERTEXT[*] )

import crypto from "node:crypto";

const ALG = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 12;
const TAG_LEN = 16;
const SALT = Buffer.from("mmhb-biometric-aead-v1-salt00000", "utf8");
const INFO = Buffer.from("biometric-token-encryption", "utf8");
export const HEALTHKIT_SIGNATURE_MAX_SKEW_MS = 5 * 60 * 1000;

let _cachedKey = null;

function getKey() {
  if (_cachedKey) return _cachedKey;
  const ikm = process.env.JWT_SECRET;
  if (!ikm || typeof ikm !== "string" || ikm.length < 16) {
    throw new Error("JWT_SECRET missing or too short for biometric token encryption");
  }
  const derived = crypto.hkdfSync("sha256", Buffer.from(ikm, "utf8"), SALT, INFO, KEY_LEN);
  _cachedKey = Buffer.from(derived);
  return _cachedKey;
}

export function encryptToken(plaintext) {
  if (plaintext == null || plaintext === "") return null;
  if (typeof plaintext !== "string") plaintext = String(plaintext);
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALG, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decryptToken(b64) {
  if (b64 == null || b64 === "") return null;
  const buf = Buffer.from(b64, "base64");
  if (buf.length < IV_LEN + TAG_LEN + 1) {
    throw new Error("biometric token ciphertext too short");
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ct = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALG, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

// Deterministic HMAC for HealthKit webhook signature verification.
// iOS companion app signs the JSON body with a shared secret;
// shared secret = HKDF(JWT_SECRET, "healthkit-webhook-v1").
let _webhookKey = null;
function getWebhookKey() {
  if (_webhookKey) return _webhookKey;
  const ikm = process.env.JWT_SECRET;
  if (!ikm) throw new Error("JWT_SECRET missing for healthkit webhook key");
  _webhookKey = Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(ikm, "utf8"),
      SALT,
      Buffer.from("healthkit-webhook-v1", "utf8"),
      32,
    ),
  );
  return _webhookKey;
}

export function verifyHealthKitSignature(rawBody, providedHexSig, userId, timestamp) {
  if (!rawBody || !providedHexSig || typeof providedHexSig !== "string") return false;
  if (!userId || typeof userId !== "string") return false;
  if (!timestamp || typeof timestamp !== "string") return false;

  const timestampMs = Date.parse(timestamp);
  if (Number.isNaN(timestampMs)) return false;
  if (Math.abs(Date.now() - timestampMs) > HEALTHKIT_SIGNATURE_MAX_SKEW_MS) return false;

  try {
    // HMAC binds identity + timestamp + exact raw body bytes.
    // Client canonical payload: `${userId}.${timestamp}.${rawBodyBytes}`.
    const data = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody));
    const signedPayload = Buffer.concat([
      Buffer.from(userId, "utf8"),
      Buffer.from(".", "utf8"),
      Buffer.from(timestamp, "utf8"),
      Buffer.from(".", "utf8"),
      data,
    ]);

    const expected = crypto.createHmac("sha256", getWebhookKey()).update(signedPayload).digest();
    const provided = Buffer.from(providedHexSig.toLowerCase(), "hex");
    if (provided.length !== expected.length) return false;
    return crypto.timingSafeEqual(expected, provided);
  } catch {
    return false;
  }
}
