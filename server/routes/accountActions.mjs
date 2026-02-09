/**
 * Account Actions Routes (P113, P119)
 * Session management and account deletion
 */

import { Router } from 'express';
import { sql } from 'drizzle-orm';
import db from '../db/client.mjs';
import { logger } from '../utils/logger.mjs';
import { success, unauthorized, badRequest, serverError } from '../utils/responses.mjs';
import { sendAccountDeletionEmail } from '../services/email.mjs';

const router = Router();

// P113: Get user sessions
router.get('/sessions', async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);

    const sessionsResult = await db.execute(sql`
      SELECT 
        id, 
        user_agent as "userAgent",
        ip_address as "ipAddress",
        created_at as "createdAt",
        last_active as "lastActive",
        CASE WHEN id = ${req.sessionID || ''} THEN true ELSE false END as "isCurrent"
      FROM sessions 
      WHERE user_id = ${req.dbUserId}
      ORDER BY last_active DESC NULLS LAST
      LIMIT 20
    `);

    const sessions = sessionsResult.rows?.map(s => ({
      id: s.id,
      userAgent: s.userAgent,
      deviceName: parseDeviceName(s.userAgent),
      createdAt: s.createdAt,
      lastActive: s.lastActive,
      isCurrent: s.isCurrent,
      location: null // Would need IP geolocation service
    })) || [];

    return success(res, { sessions });
  } catch (err) {
    logger.error('Sessions fetch error', { error: err.message, userId: req.dbUserId });
    return serverError(res, err);
  }
});

// P113: Revoke a session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);

    const { sessionId } = req.params;

    // Don't allow revoking current session via this endpoint
    if (sessionId === req.sessionID) {
      return badRequest(res, 'Cannot revoke current session. Use logout instead.');
    }

    const result = await db.execute(sql`
      DELETE FROM sessions 
      WHERE id = ${sessionId} AND user_id = ${req.dbUserId}
      RETURNING id
    `);

    if (result.rows?.length === 0) {
      return badRequest(res, 'Session not found');
    }

    logger.info('Session revoked', { userId: req.dbUserId, revokedSessionId: sessionId });
    return success(res, { message: 'Session revoked' });
  } catch (err) {
    logger.error('Session revoke error', { error: err.message, userId: req.dbUserId });
    return serverError(res, err);
  }
});

// P119: Request account deletion
router.post('/delete-request', async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);

    const { confirmation } = req.body;

    if (confirmation !== 'DELETE MY ACCOUNT') {
      return badRequest(res, 'Invalid confirmation');
    }

    // Create deletion request (don't actually delete yet)
    const existingRequest = await db.execute(sql`
      SELECT id FROM account_deletion_requests 
      WHERE user_id = ${req.dbUserId} AND status = 'pending'
      LIMIT 1
    `);

    if (existingRequest.rows?.length > 0) {
      return badRequest(res, 'A deletion request is already pending');
    }

    await db.execute(sql`
      INSERT INTO account_deletion_requests (user_id, requested_at, status, scheduled_deletion)
      VALUES (${req.dbUserId}, NOW(), 'pending', NOW() + INTERVAL '7 days')
      ON CONFLICT (user_id) WHERE status = 'pending' DO NOTHING
    `);

    logger.info('Account deletion requested', { userId: req.dbUserId });

    const scheduledDeletion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const userEmail = req.user?.email || req.user?.claims?.email;
    if (userEmail) {
      sendAccountDeletionEmail(
        userEmail, 
        req.user?.username || req.user?.name || "User", 
        scheduledDeletion
      ).catch(err => {
        logger.error('Failed to send deletion email', { error: err.message, userId: req.dbUserId });
      });
    }

    return success(res, { 
      message: 'Deletion request submitted',
      scheduledDeletion
    });
  } catch (err) {
    logger.error('Deletion request error', { error: err.message, userId: req.dbUserId });
    return serverError(res, err);
  }
});

// P119: Cancel deletion request
router.post('/cancel-delete-request', async (req, res) => {
  try {
    if (!req.dbUserId) return unauthorized(res);

    const result = await db.execute(sql`
      UPDATE account_deletion_requests 
      SET status = 'cancelled', cancelled_at = NOW()
      WHERE user_id = ${req.dbUserId} AND status = 'pending'
      RETURNING id
    `);

    if (result.rows?.length === 0) {
      return badRequest(res, 'No pending deletion request found');
    }

    logger.info('Account deletion cancelled', { userId: req.dbUserId });
    return success(res, { message: 'Deletion request cancelled' });
  } catch (err) {
    logger.error('Cancel deletion error', { error: err.message, userId: req.dbUserId });
    return serverError(res, err);
  }
});

function parseDeviceName(userAgent) {
  if (!userAgent) return 'Unknown Device';
  
  if (/iPhone/i.test(userAgent)) return 'iPhone';
  if (/iPad/i.test(userAgent)) return 'iPad';
  if (/Android/i.test(userAgent)) return 'Android Device';
  if (/Windows/i.test(userAgent)) return 'Windows PC';
  if (/Macintosh/i.test(userAgent)) return 'Mac';
  if (/Linux/i.test(userAgent)) return 'Linux PC';
  
  return 'Unknown Device';
}


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "accountActions", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
