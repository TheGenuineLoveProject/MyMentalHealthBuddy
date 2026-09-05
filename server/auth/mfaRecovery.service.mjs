import crypto from "node:crypto";

const RECOVERY_CODE_COUNT = 6;
const RECOVERY_CODE_BYTES = 16;
const RECOVERY_STORAGE_VERSION = 2;
const RECOVERY_HASH_ALGORITHM = "sha256";

const NORMALIZED_CODE_RE =
  /^[0-9A-F]{32}$/;

const STORED_HASH_RE =
  /^[0-9a-f]{64}$/;

export function normalizeMfaRecoveryCode(code) {
  if (typeof code !== "string") {
    throw new Error(
      "MFA recovery code must be a string"
    );
  }

  const normalized = code
    .trim()
    .replace(/[\s-]/g, "")
    .toUpperCase();

  if (!NORMALIZED_CODE_RE.test(normalized)) {
    throw new Error(
      "Invalid MFA recovery code format"
    );
  }

  return normalized;
}

function formatRecoveryCode(raw) {
  if (
    !Buffer.isBuffer(raw) ||
    raw.length !== RECOVERY_CODE_BYTES
  ) {
    throw new Error(
      "Recovery code requires exactly 16 random bytes"
    );
  }

  return raw
    .toString("hex")
    .toUpperCase()
    .match(/.{4}/g)
    .join("-");
}

export function hashMfaRecoveryCode(code) {
  const normalized =
    normalizeMfaRecoveryCode(code);

  return crypto
    .createHash(RECOVERY_HASH_ALGORITHM)
    .update(
      Buffer.from(normalized, "hex")
    )
    .digest("hex");
}

function validateHashes(hashes) {
  if (
    !Array.isArray(hashes) ||
    hashes.some(
      value =>
        typeof value !== "string" ||
        !STORED_HASH_RE.test(value)
    )
  ) {
    throw new Error(
      "Invalid MFA recovery hash collection"
    );
  }

  if (
    new Set(hashes).size !==
    hashes.length
  ) {
    throw new Error(
      "Duplicate MFA recovery hash state"
    );
  }
}

function serializeRecoveryHashes(hashes) {
  validateHashes(hashes);

  return JSON.stringify({
    v: RECOVERY_STORAGE_VERSION,
    alg: RECOVERY_HASH_ALGORITHM,
    encoding: "hex-128",
    codes: hashes,
  });
}

export function generateMfaRecoverySet({
  count = RECOVERY_CODE_COUNT,
} = {}) {
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    count > 20
  ) {
    throw new Error(
      "Recovery code count must be 1 through 20"
    );
  }

  const codes = [];

  for (
    let i = 0;
    i < count;
    i += 1
  ) {
    codes.push(
      formatRecoveryCode(
        crypto.randomBytes(
          RECOVERY_CODE_BYTES
        )
      )
    );
  }

  const normalized =
    codes.map(
      normalizeMfaRecoveryCode
    );

  if (
    new Set(normalized).size !==
    normalized.length
  ) {
    throw new Error(
      "Duplicate MFA recovery credential generated"
    );
  }

  const hashes =
    codes.map(hashMfaRecoveryCode);

  return {
    codes,
    storage:
      serializeRecoveryHashes(hashes),
  };
}

export function parseMfaRecoveryStorage(stored) {
  if (
    typeof stored !== "string" ||
    !stored
  ) {
    throw new Error(
      "MFA recovery storage required"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(stored);
  } catch {
    throw new Error(
      "Invalid MFA recovery storage JSON"
    );
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    parsed.v !== RECOVERY_STORAGE_VERSION ||
    parsed.alg !== RECOVERY_HASH_ALGORITHM ||
    parsed.encoding !== "hex-128" ||
    !Array.isArray(parsed.codes)
  ) {
    throw new Error(
      "Unsupported MFA recovery storage format"
    );
  }

  validateHashes(parsed.codes);

  return {
    version: parsed.v,
    algorithm: parsed.alg,
    encoding: parsed.encoding,
    hashes: [...parsed.codes],
  };
}

function timingSafeHashEqual(a, b) {
  if (
    typeof a !== "string" ||
    typeof b !== "string" ||
    !STORED_HASH_RE.test(a) ||
    !STORED_HASH_RE.test(b)
  ) {
    return false;
  }

  const left =
    Buffer.from(a, "hex");

  const right =
    Buffer.from(b, "hex");

  return (
    left.length === right.length &&
    crypto.timingSafeEqual(
      left,
      right
    )
  );
}

function findRecoveryHashIndex({
  hashes,
  candidateHash,
}) {
  let matchIndex = -1;

  /*
   * Deliberately examine the complete hash collection rather than
   * returning immediately on the first match.
   */
  for (
    let i = 0;
    i < hashes.length;
    i += 1
  ) {
    const matches =
      timingSafeHashEqual(
        hashes[i],
        candidateHash
      );

    if (
      matches &&
      matchIndex === -1
    ) {
      matchIndex = i;
    }
  }

  return matchIndex;
}

export function verifyMfaRecoveryCode({
  stored,
  code,
}) {
  const state =
    parseMfaRecoveryStorage(stored);

  const candidateHash =
    hashMfaRecoveryCode(code);

  return (
    findRecoveryHashIndex({
      hashes: state.hashes,
      candidateHash,
    }) >= 0
  );
}

/**
 * Pure state transition.
 *
 * Database-level atomicity is intentionally implemented later inside
 * the joint MFA challenge + recovery-code PostgreSQL transaction.
 */
export function consumeMfaRecoveryCodeFromStorage({
  stored,
  code,
}) {
  const state =
    parseMfaRecoveryStorage(stored);

  const candidateHash =
    hashMfaRecoveryCode(code);

  const matchIndex =
    findRecoveryHashIndex({
      hashes: state.hashes,
      candidateHash,
    });

  if (matchIndex < 0) {
    return null;
  }

  const remaining =
    state.hashes.filter(
      (_, index) =>
        index !== matchIndex
    );

  return {
    storage:
      serializeRecoveryHashes(
        remaining
      ),
    remaining:
      remaining.length,
  };
}

export const MFA_RECOVERY_POLICY =
  Object.freeze({
    count:
      RECOVERY_CODE_COUNT,

    rawBytesPerCode:
      RECOVERY_CODE_BYTES,

    entropyBitsPerCode:
      RECOVERY_CODE_BYTES * 8,

    storageVersion:
      RECOVERY_STORAGE_VERSION,

    algorithm:
      RECOVERY_HASH_ALGORITHM,

    encoding:
      "hex-128",
  });
