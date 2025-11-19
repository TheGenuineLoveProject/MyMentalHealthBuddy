/**
 * 360° Comprehensive Audit Logging System
 * Logs all security-sensitive operations for compliance and security auditing
 */
/**
 * Log an audit event
 * @param entry - The audit log entry details
 * @param storageInstance - Optional storage instance for logging (if not provided, logs to console)
 */
export async function logAudit(entry, storageInstance) {
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
        }
        else {
            console.log('[AUDIT]', JSON.stringify({
                ...entry,
                timestamp: new Date().toISOString()
            }));
        }
    }
    catch (error) {
        console.error('Failed to write audit log:', error);
    }
}
/**
 * Extract client information from request
 */
function getClientInfo(req) {
    return {
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
    };
}
/**
 * Log authentication event
 */
export async function logAuth(action, req, userId, details) {
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
export async function logDataAccess(action, resourceType, resourceId, req, userId) {
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
export async function logPayment(action, req, userId, details) {
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
export async function logAdminAction(action, req, userId, targetResourceType, targetResourceId, changes) {
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
export async function logContentChange(action, resourceType, resourceId, req, userId, changes) {
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
export async function logAIUsage(action, req, userId, details) {
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
export async function logSecurityEvent(action, req, details) {
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
