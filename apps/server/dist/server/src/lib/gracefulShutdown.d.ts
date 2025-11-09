/**
 * Graceful Shutdown - 360° Deployment Enhancement
 * Ensures clean shutdown for Cloud Run deployments
 */
import type { Server } from 'http';
interface ShutdownOptions {
    timeout?: number;
    onShutdown?: () => Promise<void>;
}
/**
 * Configure graceful shutdown for the server
 */
export declare function setupGracefulShutdown(server: Server, options?: ShutdownOptions): void;
/**
 * Health check handler that respects shutdown state
 */
export declare function createShutdownAwareHealthCheck(): (req: any, res: any) => any;
export {};
