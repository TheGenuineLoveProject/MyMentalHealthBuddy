/**
 * Candidate adapter boundary for the SQL already qualified by MMHB's private
 * PostgreSQL runner. No environment reads, pools, migrations, or imports here.
 * The production wrapper must inject the existing db, Drizzle sql tag and
 * hashToken; this module does not authorize a live database cutover.
 */
export function createRefreshFamilyService({ db, sql, hashToken }) {
  if (!db || typeof db.execute !== 'function' || typeof sql !== 'function' ||
      typeof hashToken !== 'function') throw new TypeError('INVALID_ADAPTER_DEPENDENCIES');
  const uuid = value => {
    if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      throw new TypeError('INVALID_REFRESH_USER_ID');
    }
    return value.toLowerCase();
  };
  const fail = () => { throw new Error('REFRESH_DATABASE_RESPONSE_INVALID'); };
  const digest = token => {
    if (typeof token !== 'string' || token.length === 0 || token.length > 4096) return null;
    const value = hashToken(token);
    if (typeof value !== 'string' || !/^[0-9a-f]{64}$/.test(value)) throw new TypeError('INVALID_TOKEN_DIGEST');
    return value;
  };
  const object = value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail();
    return value;
  };
  const responseId = value => {
    try { return uuid(value); } catch { return fail(); }
  };
  const expiry = value => {
    // PostgreSQL jsonb timestamps are strings, unlike ordinary pg timestamp
    // columns. Normalize explicitly, preserving the service's Date contract.
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)) fail();
    const result = new Date(value);
    if (!Number.isFinite(result.getTime())) fail();
    return result;
  };
  async function execute(executor, statement) {
    if (!executor || typeof executor.execute !== 'function') throw new TypeError('INVALID_REFRESH_EXECUTOR');
    const response = await executor.execute(statement);
    if (!response || !Array.isArray(response.rows) || response.rows.length !== 1 ||
        !response.rows[0] || !Object.hasOwn(response.rows[0], 'result') ||
        response.rows[0].result === undefined) fail();
    return response.rows[0].result;
  }
  function credential(value, expectedHash, kind) {
    object(value);
    if (value.tokenHash !== expectedHash) fail();
    const out = {
      tokenHash: value.tokenHash,
      expiresAt: expiry(value.expiresAt),
      familyId: responseId(value.familyId),
    };
    if (kind !== 'issue') out.userId = responseId(value.userId);
    if (kind === 'find') out.id = responseId(value.id);
    return out;
  }
  function revocation(value) {
    object(value);
    if (typeof value.revoked !== 'boolean' || !Number.isInteger(value.revokedCount) ||
        value.revokedCount < 0 || value.revokedCount > 1 ||
        value.revoked !== (value.revokedCount === 1)) fail();
    return { revoked: value.revoked, revokedCount: value.revokedCount };
  }
  async function storeRefreshToken({ userId, token }) {
    const id = uuid(userId), hash = digest(token);
    if (!hash) throw new TypeError('INVALID_REFRESH_CREDENTIAL');
    return credential(await execute(db, sql`SELECT mmhb_refresh_v1.issue(${id}::uuid, ${hash}) AS result`), hash, 'issue');
  }
  async function findValidRefreshToken(token) {
    const hash = digest(token);
    if (!hash) return null;
    const value = await execute(db, sql`SELECT mmhb_refresh_v1.find_valid(${hash}) AS result`);
    return value === null ? null : credential(value, hash, 'find');
  }
  async function verifyRefreshToken({ userId, token }) {
    const id = uuid(userId), row = await findValidRefreshToken(token);
    return Boolean(row && row.userId === id);
  }
  async function rotateRefreshToken({ token, newToken }) {
    const before = digest(token), after = digest(newToken);
    if (!before || !after) return null;
    if (before === after) throw new TypeError('REFRESH_REPLACEMENT_MUST_DIFFER');
    const value = await execute(db, sql`SELECT mmhb_refresh_v1.rotate(${before}, ${after}) AS result`);
    return value === null ? null : credential(value, after, 'rotate');
  }
  async function revokeRefreshTokenByToken(token, executor = db) {
    const hash = digest(token);
    if (!hash) return { revoked: false, revokedCount: 0 };
    return revocation(await execute(executor, sql`SELECT mmhb_refresh_v1.revoke(${hash}) AS result`));
  }
  async function revokeRefreshToken({ userId, token }) {
    const id = uuid(userId), hash = digest(token);
    if (!hash) return;
    revocation(await execute(db, sql`SELECT mmhb_refresh_v1.revoke(${hash}, ${id}::uuid) AS result`));
    // Preserve the previous public service's undefined return contract.
  }
  async function revokeAllRefreshTokens(userId, executor = db) {
    const id = uuid(userId);
    const count = await execute(executor, sql`SELECT mmhb_refresh_v1.revoke_user(${id}::uuid) AS result`);
    if (!Number.isSafeInteger(count) || count < 0) fail();
    // Preserve undefined; importantly, execution used the caller's tx if supplied.
  }
  return Object.freeze({ storeRefreshToken, findValidRefreshToken, verifyRefreshToken,
    rotateRefreshToken, revokeRefreshTokenByToken, revokeRefreshToken, revokeAllRefreshTokens });
}
