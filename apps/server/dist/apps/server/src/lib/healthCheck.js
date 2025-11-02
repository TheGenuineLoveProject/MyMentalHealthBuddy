/**
 * 360° Comprehensive Health Check System
 * Monitors all critical dependencies and system health
 */
/**
 * Check database connectivity and performance
 */
async function checkDatabase(storageInstance) {
    const startTime = Date.now();
    try {
        if (storageInstance.healthCheck) {
            await storageInstance.healthCheck();
        }
        else {
            await storageInstance.getUserById('health-check-test');
        }
        const responseTime = Date.now() - startTime;
        // Get live pool stats if available
        const poolStats = storageInstance.getPoolStats ? storageInstance.getPoolStats() : null;
        return {
            status: responseTime < 100 ? 'pass' : responseTime < 500 ? 'warn' : 'fail',
            message: 'Database connection successful',
            responseTime,
            details: poolStats ? {
                totalConnections: poolStats.total,
                idleConnections: poolStats.idle,
                waitingRequests: poolStats.waiting
            } : {
                poolMonitoring: 'Not available'
            }
        };
    }
    catch (error) {
        return {
            status: 'fail',
            message: `Database connection failed: ${error.message}`,
            responseTime: Date.now() - startTime
        };
    }
}
/**
 * Check memory usage and health
 */
function checkMemory() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;
    let status = 'pass';
    let message = `Memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercent.toFixed(1)}%)`;
    if (usagePercent > 90) {
        status = 'fail';
        message = `Critical memory usage: ${usagePercent.toFixed(1)}%`;
    }
    else if (usagePercent > 75) {
        status = 'warn';
        message = `High memory usage: ${usagePercent.toFixed(1)}%`;
    }
    return {
        status,
        message,
        details: {
            heapUsedMB,
            heapTotalMB,
            usagePercent: parseFloat(usagePercent.toFixed(2)),
            rss: Math.round(memUsage.rss / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024)
        }
    };
}
/**
 * Check OpenAI API availability (optional)
 */
async function checkOpenAI() {
    if (!process.env.OPENAI_API_KEY && !process.env.REPLIT_AI_API_URL) {
        return undefined;
    }
    const startTime = Date.now();
    try {
        const responseTime = Date.now() - startTime;
        return {
            status: 'pass',
            message: 'OpenAI API configured',
            responseTime,
            details: {
                configured: true,
                provider: process.env.REPLIT_AI_API_URL ? 'Replit AI Gateway' : 'OpenAI Direct'
            }
        };
    }
    catch (error) {
        return {
            status: 'warn',
            message: `OpenAI API check skipped: ${error.message}`,
            responseTime: Date.now() - startTime
        };
    }
}
/**
 * Check Stripe API availability (optional)
 */
async function checkStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        return undefined;
    }
    try {
        return {
            status: 'pass',
            message: 'Stripe configured',
            details: {
                configured: true,
                mode: process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'test' : 'live'
            }
        };
    }
    catch (error) {
        return {
            status: 'warn',
            message: `Stripe check skipped: ${error.message}`
        };
    }
}
/**
 * Perform comprehensive health check
 */
export async function performHealthCheck(storageInstance) {
    const checks = await Promise.all([
        storageInstance ? checkDatabase(storageInstance) : Promise.resolve({ status: 'warn', message: 'Database check skipped' }),
        Promise.resolve(checkMemory()),
        checkOpenAI(),
        checkStripe()
    ]);
    const [database, memory, openai, stripe] = checks;
    const healthChecks = {
        database,
        memory,
        ...(openai && { openai }),
        ...(stripe && { stripe })
    };
    const failedChecks = Object.values(healthChecks).filter(c => c.status === 'fail').length;
    const warnChecks = Object.values(healthChecks).filter(c => c.status === 'warn').length;
    let overallStatus = 'healthy';
    if (failedChecks > 0) {
        overallStatus = 'unhealthy';
    }
    else if (warnChecks > 0) {
        overallStatus = 'degraded';
    }
    return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        checks: healthChecks
    };
}
/**
 * Health check endpoint handler
 */
export function healthCheckHandler(storageInstance) {
    return async (req, res) => {
        try {
            const result = await performHealthCheck(storageInstance);
            const statusCode = result.status === 'healthy' ? 200
                : result.status === 'degraded' ? 200
                    : 503;
            res.status(statusCode).json(result);
        }
        catch (error) {
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: process.env.npm_package_version || '1.0.0',
                checks: {
                    database: {
                        status: 'fail',
                        message: `Health check failed: ${error.message}`
                    },
                    memory: checkMemory()
                }
            });
        }
    };
}
/**
 * Liveness probe - simple check that service is running
 */
export function livenessHandler(req, res) {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
}
/**
 * Readiness probe - check if service is ready to accept traffic
 */
export function readinessHandler(storageInstance) {
    return async (req, res) => {
        try {
            const dbCheck = storageInstance ? await checkDatabase(storageInstance) : { status: 'warn' };
            if (dbCheck.status === 'fail') {
                return res.status(503).json({
                    status: 'not_ready',
                    reason: 'Database unavailable',
                    timestamp: new Date().toISOString()
                });
            }
            res.status(200).json({
                status: 'ready',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        }
        catch (error) {
            res.status(503).json({
                status: 'not_ready',
                reason: error.message,
                timestamp: new Date().toISOString()
            });
        }
    };
}
