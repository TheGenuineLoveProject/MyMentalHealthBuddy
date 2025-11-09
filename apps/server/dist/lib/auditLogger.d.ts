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
export declare function logAudit(entry: AuditLogEntry, storageInstance?: any): Promise<void>;
/**
 * Log authentication event
 */
export declare function logAuth(action: 'login' | 'logout' | 'login_failed' | 'signup' | 'password_change', req: Request, userId?: string, details?: Record<string, any>): Promise<void>;
/**
 * Log data access event
 */
export declare function logDataAccess(action: 'view' | 'export' | 'delete', resourceType: string, resourceId: string, req: Request, userId?: string): Promise<void>;
/**
 * Log payment/subscription event
 */
export declare function logPayment(action: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'payment_succeeded' | 'payment_failed', req: Request, userId: string, details: Record<string, any>): Promise<void>;
/**
 * Log admin action
 */
export declare function logAdminAction(action: string, req: Request, userId: string, targetResourceType: string, targetResourceId?: string, changes?: Record<string, any>): Promise<void>;
/**
 * Log content creation/modification
 */
export declare function logContentChange(action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish', resourceType: 'post' | 'template' | 'media' | 'journal', resourceId: string, req: Request, userId: string, changes?: Record<string, any>): Promise<void>;
/**
 * Log AI usage for compliance
 */
export declare function logAIUsage(action: 'chat' | 'image_generation' | 'content_generation', req: Request, userId: string, details: {
    model?: string;
    tokensUsed?: number;
    prompt?: string;
    result?: string;
}): Promise<void>;
/**
 * Log security event
 */
export declare function logSecurityEvent(action: 'csrf_failed' | 'rate_limit_exceeded' | 'unauthorized_access' | 'suspicious_activity', req: Request, details?: Record<string, any>): Promise<void>;
//# sourceMappingURL=auditLogger.d.ts.map