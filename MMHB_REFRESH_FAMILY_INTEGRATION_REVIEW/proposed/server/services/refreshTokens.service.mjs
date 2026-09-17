// Refresh-family service facade. Uses the existing application database client.
// Requires an approved mmhb_refresh_v1 database cutover before application startup.
// Deliberately no legacy fallback, schema installation, or alternate connection.
import { sql } from "drizzle-orm";
import { db } from "../db/client.mjs";
import { hashToken } from "../auth/tokens.mjs";
import { createRefreshFamilyService } from "./refreshFamilyAdapter.mjs";

const service = createRefreshFamilyService({ db, sql, hashToken });
export const {
  storeRefreshToken,
  findValidRefreshToken,
  verifyRefreshToken,
  rotateRefreshToken,
  revokeRefreshTokenByToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} = service;
