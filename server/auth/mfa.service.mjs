import crypto from "node:crypto";
import { createRequire } from "node:module";
import jwt from "jsonwebtoken";

const require = createRequire(import.meta.url);
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const MFA_PURPOSE = "mfa-login";
const MFA_CHALLENGE_ISSUER = "mmhb-auth";
const MFA_CHALLENGE_AUDIENCE = "mmhb-mfa-login";
const MFA_CHALLENGE_TTL = "5m";

const MFA_HKDF_SALT = Buffer.from(
  "mmhb-auth-key-derivation-v1",
  "utf8"
);

const MFA_HKDF_INFO = Buffer.from(
  "mmhb:mfa-login:v1",
  "utf8"
);

function getRequiredSecret(name, minimumLength = 1) {
  const value = process.env[name];

  if (
    typeof value !== "string" ||
    value.length < minimumLength
  ) {
    throw new Error(
      `${name} is required and must be at least ${minimumLength} characters`
    );
  }

  return value;
}

/*
 * MFA challenge credentials intentionally live in a separate
 * cryptographic domain from normal access JWTs.
 *
 * A valid MFA challenge therefore cannot be accepted by the normal
 * access-token verifier even though both ultimately derive keying
 * material from JWT_SECRET.
 */
function getMfaChallengeKey() {
  const accessSecret = getRequiredSecret("JWT_SECRET", 32);

  return Buffer.from(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(accessSecret, "utf8"),
      MFA_HKDF_SALT,
      MFA_HKDF_INFO,
      32
    )
  );
}

const MFA_USER_ID_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isCanonicalMfaUserId(value) {
  return (
    typeof value === "string" &&
    MFA_USER_ID_UUID_RE.test(value)
  );
}

function requireCanonicalMfaUserId(value) {
  if (!isCanonicalMfaUserId(value)) {
    throw new Error(
      "MFA challenge requires a valid UUID user id"
    );
  }

  return value;
}

export function createMfaChallengeRecord(userId) {
  const subject =
    requireCanonicalMfaUserId(userId);

  const jti = crypto.randomUUID();

  const challenge = jwt.sign(
    {
      purpose: MFA_PURPOSE,
    },
    getMfaChallengeKey(),
    {
      algorithm: "HS256",
      expiresIn: MFA_CHALLENGE_TTL,
      issuer: MFA_CHALLENGE_ISSUER,
      audience: MFA_CHALLENGE_AUDIENCE,
      subject,
      jwtid: jti,
    }
  );

  const decoded = jwt.decode(challenge);

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.exp !== "number"
  ) {
    throw new Error(
      "Unable to determine MFA challenge expiration"
    );
  }

  return {
    challenge,
    jti,
    expiresAt: new Date(decoded.exp * 1000),
  };
}

export function createMfaChallenge(userId) {
  return createMfaChallengeRecord(userId).challenge;
}

export function verifyMfaChallenge(token) {
  if (!token || typeof token !== "string") {
    throw new Error("MFA challenge required");
  }

  const payload = jwt.verify(
    token,
    getMfaChallengeKey(),
    {
      algorithms: ["HS256"],
      issuer: MFA_CHALLENGE_ISSUER,
      audience: MFA_CHALLENGE_AUDIENCE,
    }
  );

  if (
    !payload ||
    typeof payload !== "object" ||
    payload.purpose !== MFA_PURPOSE ||
    !isCanonicalMfaUserId(payload.sub) ||
    typeof payload.jti !== "string" ||
    !payload.jti
  ) {
    throw new Error("Invalid MFA challenge");
  }

  return payload;
}

/*
 * Preserve the exact legacy encryption-key derivation and ciphertext
 * format already used by account.mjs:
 *
 *   key = SHA256(SESSION_SECRET)
 *   AES-256-GCM
 *   IV = 12 random bytes
 *   serialization = ivHex:authTagHex:ciphertextHex
 *
 * This allows existing encrypted MFA secrets to remain decryptable.
 */
function getMfaEncryptionKey() {
  const secret = getRequiredSecret("SESSION_SECRET");

  return crypto
    .createHash("sha256")
    .update(secret)
    .digest();
}

export function encryptMfaSecret(plainSecret) {
  if (!plainSecret || typeof plainSecret !== "string") {
    throw new Error("MFA secret required");
  }

  const key = getMfaEncryptionKey();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  let encrypted = cipher.update(
    plainSecret,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  const authTag = cipher
    .getAuthTag()
    .toString("hex");

  return (
    iv.toString("hex") +
    ":" +
    authTag +
    ":" +
    encrypted
  );
}

export function decryptMfaSecret(storedSecret) {
  if (!storedSecret || typeof storedSecret !== "string") {
    throw new Error("MFA secret required");
  }

  const parts = storedSecret.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid MFA secret format");
  }

  const [ivHex, authTagHex, encrypted] = parts;

  const key = getMfaEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(
    encrypted,
    "hex",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}

export async function createMfaEnrollment(accountLabel) {
  const label = String(
    accountLabel || "MyMentalHealthBuddy"
  );

  const generated = speakeasy.generateSecret({
    length: 20,
    name: label,
    issuer: "Genuine Love Project",
  });

  if (
    !generated?.base32 ||
    !generated?.otpauth_url
  ) {
    throw new Error(
      "Unable to generate MFA enrollment secret"
    );
  }

  const qrCodeDataUrl = await QRCode.toDataURL(
    generated.otpauth_url
  );

  return {
    secret: generated.base32,
    otpauthUrl: generated.otpauth_url,
    qrCodeDataUrl,
  };
}

export function verifyTotpCode(secret, code) {
  if (
    !secret ||
    typeof secret !== "string" ||
    typeof code !== "string" ||
    !/^\d{6}$/.test(code)
  ) {
    return false;
  }

  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: code,
    window: 1,
  });
}

export const MFA_SECURITY_POLICY = Object.freeze({
  purpose: MFA_PURPOSE,
  issuer: MFA_CHALLENGE_ISSUER,
  audience: MFA_CHALLENGE_AUDIENCE,
  challengeTtl: MFA_CHALLENGE_TTL,
  algorithm: "HS256",
  totpWindow: 1,
});
