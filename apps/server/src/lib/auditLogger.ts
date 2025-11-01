/**
 * 360° Comprehensive Audit Logging System
 * Logs all security-sensitive operations for compliance and security auditing
 */

import type { Request } from 'express';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
}

/**
 * Log an audit event
 * @param entry - The audit log entry details
 * @param storageInstance - Optional storage instance for logging (if not provided, logs to console)
 */
export async function logAudit(entry: AuditLogEntry, storageInstance?: any): Promise<void> {
  try {
    if (storageInstance && storageInstance.createAuditLog) {
      await storageInstance.createAuditLog({
        userId: entry.userId || null,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId || null,
        changes: entry.changes || null,
        ipAddress: entry.ipAddress || null,
        userAgent: entry.userAgent || null,
        status: entry.status,
        errorMessage: entry.errorMessage || null,
        createdAt: new Date()
      });
    } else {
      console.log('[AUDIT]', JSON.stringify({
        ...entry,
        timestamp: new Date().toISOString()
      }));
    }
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Extract client information from request
 */
function getClientInfo(req: Request) {
  return {
    ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  };
}

/**
 * Log authentication event
 */
export async function logAuth(
  action: 'login' | 'logout' | 'login_failed' | 'signup' | 'password_change',
  req: Request,
  userId?: string,
  details?: Record<string, any>
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId,
    action,
    resourceType: 'user',
    resourceId: userId,
    changes: details,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: action.includes('failed') ? 'failure' : 'success',
    errorMessage: details?.error
  });
}

/**
 * Log data access event
 */
export async function logDataAccess(
  action: 'view' | 'export' | 'delete',
  resourceType: string,
  resourceId: string,
  req: Request,
  userId?: string
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId,
    action: `${resourceType}_${action}`,
    resourceType,
    resourceId,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: 'success'
  });
}

/**
 * Log payment/subscription event
 */
export async function logPayment(
  action: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'payment_succeeded' | 'payment_failed',
  req: Request,
  userId: string,
  details: Record<string, any>
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId,
    action,
    resourceType: 'subscription',
    resourceId: details.subscriptionId || details.paymentId,
    changes: details,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: action.includes('failed') ? 'failure' : 'success',
    errorMessage: details.error
  });
}

/**
 * Log admin action
 */
export async function logAdminAction(
  action: string,
  req: Request,
  userId: string,
  targetResourceType: string,
  targetResourceId?: string,
  changes?: Record<string, any>
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId,
    action: `admin_${action}`,
    resourceType: targetResourceType,
    resourceId: targetResourceId,
    changes,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: 'success'
  });
}

/**
 * Log content creation/modification
 */
export async function logContentChange(
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish',
  resourceType: 'post' | 'template' | 'media' | 'journal',
  resourceId: string,
  req: Request,
  userId: string,
  changes?: Record<string, any>
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId,
    action: `${resourceType}_${action}`,
    resourceType,
    resourceId,
    changes,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: 'success'
  });
}

/**
 * Log AI usage for compliance
 */
export async function logAIUsage(
  action: 'chat' | 'image_generation' | 'content_generation',
  req: Request,
  userId: string,
  details: {
    model?: string;
    tokensUsed?: number;
    prompt?: string;
    result?: string;
  }
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId,
    action: `ai_${action}`,
    resourceType: 'ai_usage',
    changes: {
      model: details.model,
      tokensUsed: details.tokensUsed,
      promptLength: details.prompt?.length || 0,
      resultLength: details.result?.length || 0
    },
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: 'success'
  });
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  action: 'csrf_failed' | 'rate_limit_exceeded' | 'unauthorized_access' | 'suspicious_activity',
  req: Request,
  details?: Record<string, any>
): Promise<void> {
  const clientInfo = getClientInfo(req);
  
  await logAudit({
    userId: req.userId,
    action: `security_${action}`,
    resourceType: 'security',
    changes: details,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    status: 'failure',
    errorMessage: details?.reason
  });
}
