/**
 * 360° Performance Optimization: Production Environment Configuration
 *
 * Provides runtime optimizations and best practices for production deployments
 * on Cloud Run / Autoscale environments.
 */
/**
 * Node.js runtime optimizations for production
 * Apply these settings via NODE_OPTIONS environment variable
 *
 * ONLY VALID FLAGS (verified against Node.js documentation):
 * - Memory limits: --max-old-space-size, --max-semi-space-size
 * - GC exposure: --expose-gc (for manual GC in memory monitor)
 *
 * Deploy command example:
 * NODE_OPTIONS="--max-old-space-size=512" npm start
 */
export const NODE_RUNTIME_FLAGS = {
    // Memory optimization (VALID flags only)
    '--max-old-space-size': 512, // MB - Conservative for Autoscale (prevent OOM)
    // Optional: expose GC for manual memory management
    // '--expose-gc': true, // Uncomment if using manual GC in MemoryMonitor
};
/**
 * Generate NODE_OPTIONS string for production
 *
 * @example
 * // In deployment config:
 * NODE_OPTIONS="--max-old-space-size=512"
 */
export function getNodeOptionsString() {
    return '--max-old-space-size=512';
}
/**
 * Memory monitoring and automatic cleanup
 * Prevents memory leaks in long-running processes
 */
export class MemoryMonitor {
    thresholdMB;
    checkIntervalMs;
    timer = null;
    constructor(options = {}) {
        this.thresholdMB = options.thresholdMB || 400; // Trigger at 400MB
        this.checkIntervalMs = options.checkIntervalMs || 60000; // Check every minute
    }
    /**
     * Start memory monitoring
     */
    start() {
        if (this.timer) {
            return; // Already running
        }
        this.timer = setInterval(() => {
            this.checkMemory();
        }, this.checkIntervalMs);
        console.log(`📊 Memory monitor started (threshold: ${this.thresholdMB}MB, interval: ${this.checkIntervalMs}ms)`);
    }
    /**
     * Stop memory monitoring
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('📊 Memory monitor stopped');
        }
    }
    /**
     * Check current memory usage and trigger GC if needed
     */
    checkMemory() {
        const memUsage = process.memoryUsage();
        const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
        const rssMB = Math.round(memUsage.rss / 1024 / 1024);
        // Log memory stats
        console.log(`📊 Memory: ${heapUsedMB}MB / ${heapTotalMB}MB (RSS: ${rssMB}MB)`);
        // Trigger GC if memory exceeds threshold
        if (heapUsedMB > this.thresholdMB) {
            console.warn(`⚠️  High memory usage detected (${heapUsedMB}MB > ${this.thresholdMB}MB)`);
            // Suggest manual GC if available (requires --expose-gc flag)
            if (global.gc) {
                console.log('🗑️  Running garbage collection...');
                global.gc();
                const afterGC = process.memoryUsage();
                const afterGCMB = Math.round(afterGC.heapUsed / 1024 / 1024);
                console.log(`✅ GC complete: ${heapUsedMB}MB → ${afterGCMB}MB (freed ${heapUsedMB - afterGCMB}MB)`);
            }
            else {
                console.warn('⚠️  GC not available (start with --expose-gc to enable manual GC)');
            }
        }
    }
    /**
     * Get current memory statistics
     */
    getStats() {
        const memUsage = process.memoryUsage();
        return {
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
            rss: Math.round(memUsage.rss / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024),
            unit: 'MB',
            threshold: this.thresholdMB,
        };
    }
}
/**
 * Production runtime optimizations
 * Call this function on server startup in production
 */
export function enableProductionOptimizations() {
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
        console.log('⚠️  Skipping production optimizations (not in production mode)');
        return;
    }
    console.log('🚀 Enabling production optimizations...');
    // 1. Enable memory monitoring
    const memoryMonitor = new MemoryMonitor({
        thresholdMB: 400, // Alert at 400MB
        checkIntervalMs: 60000, // Check every minute
    });
    memoryMonitor.start();
    // 2. Process event handlers for optimization
    process.on('warning', (warning) => {
        console.warn('⚠️  Node.js warning:', {
            name: warning.name,
            message: warning.message,
            stack: warning.stack,
        });
    });
    // 3. Unhandled rejection handler (prevent memory leaks)
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Promise Rejection:', {
            reason,
            promise,
            timestamp: new Date().toISOString(),
        });
    });
    // 4. Uncaught exception handler
    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });
        // Graceful shutdown on critical errors
        process.exit(1);
    });
    console.log('✅ Production optimizations enabled');
    return {
        memoryMonitor,
    };
}
/**
 * Connection pool best practices for Autoscale
 *
 * Cloud Run / Autoscale deployment considerations:
 * - Multiple instances share database connection limits
 * - Instances scale to zero (connections must close properly)
 * - Cold starts require fast connection initialization
 */
export const AUTOSCALE_DB_POOL_CONFIG = {
    // Conservative max connections per instance
    max: 10,
    // CRITICAL: Set to 0 for Autoscale (no pre-warming)
    min: 0,
    // Close idle connections quickly
    idleTimeoutMillis: 30000, // 30 seconds
    // Fast connection timeout for cold starts
    connectionTimeoutMillis: 5000, // 5 seconds
    // Allow pool to exit when idle (important for scale-to-zero)
    allowExitOnIdle: true,
    // Query timeouts to prevent long-running queries
    statement_timeout: 30000, // 30 seconds
    query_timeout: 30000, // 30 seconds
};
/**
 * Express server best practices for Autoscale
 */
export const AUTOSCALE_SERVER_CONFIG = {
    // Bind to 0.0.0.0 for Cloud Run
    host: '0.0.0.0',
    // Port from environment or default
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    // Request timeout (prevent long-running requests)
    requestTimeoutMs: 30000, // 30 seconds
    // Keep-alive timeout (shorter than load balancer)
    keepAliveTimeoutMs: 65000, // 65 seconds
    // Headers timeout (must be > keepAliveTimeout)
    headersTimeoutMs: 66000, // 66 seconds
};
/**
 * Health check best practices
 */
export function createHealthCheck(checks = {}) {
    return async () => {
        const results = {};
        // Database check
        if (checks.database) {
            try {
                results.database = await checks.database();
            }
            catch (error) {
                results.database = false;
            }
        }
        // Custom checks
        if (checks.custom) {
            try {
                results.custom = await checks.custom();
            }
            catch (error) {
                results.custom = false;
            }
        }
        // Overall health: all checks must pass
        const healthy = Object.values(results).every(result => result);
        return { healthy, checks: results };
    };
}
