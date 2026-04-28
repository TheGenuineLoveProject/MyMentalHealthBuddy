// server/biometrics/pipeline.mjs
//
// BiometricIngestionService — single seam through which every reading
// reaches the database. Validates against the canonical metric
// registry, scores quality, and upserts via the unique (user, source,
// metric, recorded_at) constraint so the same data point can be
// re-ingested idempotently.
//
// Provider-specific REST is in providers.mjs. This file owns:
//   - storeReadings(userId, normalizedReadings[])
//   - syncProvider(connection)  →  fetch + normalize + store
//   - upsertConnection(...)     →  encrypted token persistence
//   - getConnection / listConnections / disconnect

import { sql } from "drizzle-orm";
import { db } from "../db.mjs";
import {
  validateAndScore,
  normalizeOuraSleepDetail,
  normalizeOuraDailyActivity,
  normalizeOuraDailyReadiness,
  normalizeOuraDailySleep,
  normalizeGoogleFitPoint,
  normalizeWhoopRecovery,
  normalizeWhoopSleep,
} from "./normalizers.mjs";
import { encryptToken, decryptToken } from "./crypto.mjs";
import { getProvider, NotConfiguredError } from "./providers.mjs";

export class BiometricIngestionService {
  /**
   * Persist already-normalized readings. Skips invalid/out-of-range
   * values, deduplicates against the unique index. Returns counts.
   */
  async storeReadings(userId, readings) {
    if (!Array.isArray(readings) || readings.length === 0) {
      return { stored: 0, rejected: 0, deduped: 0, rejections: [] };
    }
    let stored = 0;
    let rejected = 0;
    let deduped = 0;
    const rejections = [];

    for (const r of readings) {
      const v = validateAndScore({
        deviceSource: r.deviceSource,
        metricType: r.metricType,
        value: r.value,
        unit: r.unit,
      });
      if (!v.ok) {
        rejected++;
        rejections.push({ metricType: r.metricType, reason: v.reason });
        continue;
      }
      try {
        const result = await db.execute(sql`
          INSERT INTO biometric_readings
            (user_id, device_source, metric_type, value, unit, quality_score, recorded_at, metadata)
          VALUES
            (${userId}, ${r.deviceSource}, ${r.metricType}, ${String(r.value)},
             ${r.unit}, ${v.qualityScore}, ${r.recordedAt instanceof Date ? r.recordedAt.toISOString() : r.recordedAt},
             ${JSON.stringify(r.metadata || {})}::jsonb)
          ON CONFLICT (user_id, device_source, metric_type, recorded_at)
          DO NOTHING
          RETURNING id
        `);
        const inserted = (result.rows || result || []).length;
        if (inserted > 0) stored++;
        else deduped++;
      } catch (err) {
        rejected++;
        rejections.push({ metricType: r.metricType, reason: "db_error" });
      }
    }
    return { stored, rejected, deduped, rejections };
  }

  /**
   * Convenience: upload from manual or HealthKit (already normalized).
   */
  async ingest(userId, readings) {
    return this.storeReadings(userId, readings);
  }

  /**
   * Sync a Connected provider. Returns { stored, rejected, deduped }.
   * Throws NotConfiguredError if credentials missing — caller maps to 501.
   */
  async syncProvider(connection) {
    const { id, userId, deviceSource } = connection;
    const provider = getProvider(deviceSource);
    if (!provider) throw new Error(`no_provider_for:${deviceSource}`);

    let accessToken = decryptToken(connection.encryptedAccessToken);
    if (!accessToken) {
      await this._markConnectionError(id, "no_access_token");
      return { stored: 0, rejected: 0, deduped: 0 };
    }

    // Refresh proactively if within 5 minutes of expiry.
    const exp = connection.tokenExpiresAt ? new Date(connection.tokenExpiresAt).getTime() : 0;
    if (exp && exp - Date.now() < 5 * 60 * 1000 && connection.encryptedRefreshToken) {
      try {
        const refreshTok = decryptToken(connection.encryptedRefreshToken);
        const refreshed = await provider.refresh(refreshTok);
        accessToken = refreshed.access_token || accessToken;
        await this._updateTokens(id, refreshed);
      } catch (err) {
        if (err instanceof NotConfiguredError) throw err;
        // Token refresh failure is non-fatal; we'll try with current token.
      }
    }

    const since = connection.lastSyncAt ? new Date(connection.lastSyncAt).toISOString() : null;
    let raw;
    try {
      raw = await provider.fetchRecent(accessToken, since);
    } catch (err) {
      if (err instanceof NotConfiguredError) throw err;
      await this._markConnectionError(id, err.message?.slice(0, 200) || "fetch_failed");
      throw err;
    }

    const normalized = this._normalizeProviderResponse(deviceSource, raw);
    const result = await this.storeReadings(userId, normalized);

    await db.execute(sql`
      UPDATE biometric_connections
         SET last_sync_at = now(),
             last_sync_error = NULL,
             updated_at = now()
       WHERE id = ${id}
    `);
    return result;
  }

  _normalizeProviderResponse(deviceSource, raw) {
    const out = [];
    if (deviceSource === "oura") {
      for (const d of (raw.dailySleep || [])) out.push(...normalizeOuraDailySleep(d));
      for (const d of (raw.sleepDetail || [])) out.push(...normalizeOuraSleepDetail(d));
      for (const d of (raw.dailyActivity || [])) out.push(...normalizeOuraDailyActivity(d));
      for (const d of (raw.dailyReadiness || [])) out.push(...normalizeOuraDailyReadiness(d));
    } else if (deviceSource === "google_fit") {
      for (const [dt, points] of Object.entries(raw)) {
        if (dt.endsWith("__error")) continue;
        for (const p of (points || [])) {
          const r = normalizeGoogleFitPoint(p, dt);
          if (r) out.push(r);
        }
      }
    } else if (deviceSource === "whoop") {
      for (const d of (raw.recovery || [])) out.push(...normalizeWhoopRecovery(d));
      for (const d of (raw.sleep || [])) out.push(...normalizeWhoopSleep(d));
    }
    return out;
  }

  async _updateTokens(connectionId, tokenResponse) {
    const expSec = Number(tokenResponse.expires_in);
    const expiresAt = Number.isFinite(expSec)
      ? new Date(Date.now() + expSec * 1000)
      : null;
    await db.execute(sql`
      UPDATE biometric_connections
         SET encrypted_access_token = ${encryptToken(tokenResponse.access_token)},
             encrypted_refresh_token = ${tokenResponse.refresh_token ? encryptToken(tokenResponse.refresh_token) : sql`encrypted_refresh_token`},
             token_expires_at = ${expiresAt ? expiresAt.toISOString() : null},
             status = 'connected',
             updated_at = now()
       WHERE id = ${connectionId}
    `);
  }

  async _markConnectionError(connectionId, message) {
    await db.execute(sql`
      UPDATE biometric_connections
         SET last_sync_error = ${message},
             updated_at = now()
       WHERE id = ${connectionId}
    `);
  }

  /** Upsert from OAuth callback. */
  async upsertConnection({ userId, deviceSource, tokenResponse, externalAccountId, scopes }) {
    const expSec = Number(tokenResponse.expires_in);
    const expiresAt = Number.isFinite(expSec)
      ? new Date(Date.now() + expSec * 1000).toISOString()
      : null;
    const enc = encryptToken(tokenResponse.access_token);
    const encR = tokenResponse.refresh_token ? encryptToken(tokenResponse.refresh_token) : null;
    const result = await db.execute(sql`
      INSERT INTO biometric_connections
        (user_id, device_source, status, encrypted_access_token, encrypted_refresh_token,
         token_expires_at, scopes, external_account_id, last_sync_at, created_at, updated_at)
      VALUES
        (${userId}, ${deviceSource}, 'connected', ${enc}, ${encR},
         ${expiresAt}, ${scopes || []}, ${externalAccountId || null}, NULL, now(), now())
      ON CONFLICT (user_id, device_source) DO UPDATE
        SET status = 'connected',
            encrypted_access_token = EXCLUDED.encrypted_access_token,
            encrypted_refresh_token = COALESCE(EXCLUDED.encrypted_refresh_token, biometric_connections.encrypted_refresh_token),
            token_expires_at = EXCLUDED.token_expires_at,
            scopes = EXCLUDED.scopes,
            external_account_id = COALESCE(EXCLUDED.external_account_id, biometric_connections.external_account_id),
            last_sync_error = NULL,
            updated_at = now()
      RETURNING id, user_id, device_source, status, last_sync_at
    `);
    return (result.rows || result || [])[0];
  }

  async getConnection(userId, deviceSource) {
    const r = await db.execute(sql`
      SELECT id, user_id AS "userId", device_source AS "deviceSource",
             status, encrypted_access_token AS "encryptedAccessToken",
             encrypted_refresh_token AS "encryptedRefreshToken",
             token_expires_at AS "tokenExpiresAt",
             scopes, external_account_id AS "externalAccountId",
             last_sync_at AS "lastSyncAt", last_sync_error AS "lastSyncError"
        FROM biometric_connections
       WHERE user_id = ${userId} AND device_source = ${deviceSource}
       LIMIT 1
    `);
    return (r.rows || r || [])[0] || null;
  }

  async listConnections(userId) {
    const r = await db.execute(sql`
      SELECT device_source AS "deviceSource",
             status,
             token_expires_at AS "tokenExpiresAt",
             scopes,
             last_sync_at AS "lastSyncAt",
             last_sync_error AS "lastSyncError",
             updated_at AS "updatedAt"
        FROM biometric_connections
       WHERE user_id = ${userId}
       ORDER BY device_source
    `);
    return r.rows || r || [];
  }

  async disconnect(userId, deviceSource) {
    const r = await db.execute(sql`
      UPDATE biometric_connections
         SET status = 'revoked',
             encrypted_access_token = NULL,
             encrypted_refresh_token = NULL,
             updated_at = now()
       WHERE user_id = ${userId} AND device_source = ${deviceSource}
       RETURNING id
    `);
    return (r.rows || r || []).length > 0;
  }

  /** Active connections across all users (for the scheduler). */
  async listActiveConnections() {
    const r = await db.execute(sql`
      SELECT id, user_id AS "userId", device_source AS "deviceSource",
             encrypted_access_token AS "encryptedAccessToken",
             encrypted_refresh_token AS "encryptedRefreshToken",
             token_expires_at AS "tokenExpiresAt",
             last_sync_at AS "lastSyncAt"
        FROM biometric_connections
       WHERE status = 'connected'
         AND device_source <> 'apple_healthkit'
         AND device_source <> 'manual'
       ORDER BY COALESCE(last_sync_at, '1970-01-01'::timestamp) ASC
    `);
    return r.rows || r || [];
  }
}

let _instance = null;
export function getIngestionService() {
  if (!_instance) _instance = new BiometricIngestionService();
  return _instance;
}
