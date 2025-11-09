"use strict";
/**
 * Graceful Shutdown - 360° Deployment Enhancement
 * Ensures clean shutdown for Cloud Run deployments
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGracefulShutdown = setupGracefulShutdown;
exports.createShutdownAwareHealthCheck = createShutdownAwareHealthCheck;
/**
 * Configure graceful shutdown for the server
 */
function setupGracefulShutdown(server, options = {}) {
    const { timeout = 30000, // 30 seconds
    onShutdown } = options;
    let isShuttingDown = false;
    const connections = new Set();
    // Track all connections
    server.on('connection', (connection) => {
        connections.add(connection);
        connection.on('close', () => {
            connections.delete(connection);
        });
    });
    /**
     * Shutdown handler
     */
    async function shutdown(signal) {
        if (isShuttingDown) {
            console.log(`[SHUTDOWN] Already shutting down...`);
            return;
        }
        isShuttingDown = true;
        console.log(`\n[SHUTDOWN] Received ${signal}, starting graceful shutdown...`);
        // Stop accepting new connections
        server.close(() => {
            console.log('[SHUTDOWN] ✅ Server closed, no new connections accepted');
        });
        // Set shutdown timeout
        const shutdownTimeout = setTimeout(() => {
            console.error('[SHUTDOWN] ⚠️  Forced shutdown after timeout');
            // Force close all connections
            connections.forEach((connection) => {
                try {
                    connection.destroy();
                }
                catch (err) {
                    console.error('[SHUTDOWN] Error destroying connection:', err);
                }
            });
            process.exit(1);
        }, timeout);
        try {
            // Run cleanup function
            if (onShutdown) {
                console.log('[SHUTDOWN] Running cleanup tasks...');
                await onShutdown();
                console.log('[SHUTDOWN] ✅ Cleanup completed');
            }
            // Wait for all connections to close
            if (connections.size > 0) {
                console.log(`[SHUTDOWN] Waiting for ${connections.size} connections to close...`);
                // Give connections time to finish
                await new Promise((resolve) => {
                    const checkInterval = setInterval(() => {
                        if (connections.size === 0) {
                            clearInterval(checkInterval);
                            resolve(undefined);
                        }
                    }, 100);
                });
            }
            clearTimeout(shutdownTimeout);
            console.log('[SHUTDOWN] ✅ Graceful shutdown completed');
            process.exit(0);
        }
        catch (error) {
            clearTimeout(shutdownTimeout);
            console.error('[SHUTDOWN] ❌ Error during shutdown:', error);
            process.exit(1);
        }
    }
    // Listen for shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM')); // Cloud Run sends SIGTERM
    process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // Nodemon restart
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
        console.error('[FATAL] Uncaught exception:', error);
        shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('[FATAL] Unhandled rejection at:', promise, 'reason:', reason);
        shutdown('unhandledRejection');
    });
    console.log('✅ Graceful shutdown configured');
}
/**
 * Health check handler that respects shutdown state
 */
function createShutdownAwareHealthCheck() {
    let isShuttingDown = false;
    // Mark as shutting down on SIGTERM
    process.on('SIGTERM', () => {
        isShuttingDown = true;
    });
    return (req, res) => {
        if (isShuttingDown) {
            return res.status(503).json({
                status: 'shutting_down',
                message: 'Server is shutting down'
            });
        }
        res.status(200).json({
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    };
}
