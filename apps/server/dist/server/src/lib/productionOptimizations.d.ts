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
export declare const NODE_RUNTIME_FLAGS: {
    '--max-old-space-size': number;
};
/**
 * Generate NODE_OPTIONS string for production
 *
 * @example
 * // In deployment config:
 * NODE_OPTIONS="--max-old-space-size=512"
 */
export declare function getNodeOptionsString(): string;
/**
 * Memory monitoring and automatic cleanup
 * Prevents memory leaks in long-running processes
 */
export declare class MemoryMonitor {
    private thresholdMB;
    private checkIntervalMs;
    private timer;
    constructor(options?: {
        thresholdMB?: number;
        checkIntervalMs?: number;
    });
    /**
     * Start memory monitoring
     */
    start(): void;
    /**
     * Stop memory monitoring
     */
    stop(): void;
    /**
     * Check current memory usage and trigger GC if needed
     */
    private checkMemory;
    /**
     * Get current memory statistics
     */
    getStats(): {
        heapUsed: number;
        heapTotal: number;
        rss: number;
        external: number;
        unit: string;
        threshold: number;
    };
}
/**
 * Production runtime optimizations
 * Call this function on server startup in production
 */
export declare function enableProductionOptimizations(): {
    memoryMonitor: MemoryMonitor;
} | undefined;
/**
 * Connection pool best practices for Autoscale
 *
 * Cloud Run / Autoscale deployment considerations:
 * - Multiple instances share database connection limits
 * - Instances scale to zero (connections must close properly)
 * - Cold starts require fast connection initialization
 */
export declare const AUTOSCALE_DB_POOL_CONFIG: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    allowExitOnIdle: boolean;
    statement_timeout: number;
    query_timeout: number;
};
/**
 * Express server best practices for Autoscale
 */
export declare const AUTOSCALE_SERVER_CONFIG: {
    host: string;
    port: number;
    requestTimeoutMs: number;
    keepAliveTimeoutMs: number;
    headersTimeoutMs: number;
};
/**
 * Health check best practices
 */
export declare function createHealthCheck(checks?: {
    database?: () => Promise<boolean>;
    custom?: () => Promise<boolean>;
}): () => Promise<{
    healthy: boolean;
    checks: Record<string, boolean>;
}>;
