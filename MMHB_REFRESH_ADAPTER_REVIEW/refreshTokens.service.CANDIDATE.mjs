// REVIEW CANDIDATE ONLY. Not installed by the qualification runner.
// Requires the versioned family SQL, approved grants and a coordinated cutover.
import { sql } from 'drizzle-orm';
import { db } from '../db/client.mjs';
import { hashToken } from '../auth/tokens.mjs';
import { createRefreshFamilyService } from './refreshFamilyAdapter.mjs';

const service = createRefreshFamilyService({ db, sql, hashToken });
export const {
  storeRefreshToken, findValidRefreshToken, verifyRefreshToken,
  rotateRefreshToken, revokeRefreshTokenByToken, revokeRefreshToken,
  revokeAllRefreshTokens,
} = service;
