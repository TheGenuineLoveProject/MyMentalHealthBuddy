/**
 * Security Headers - 360° Security Enhancement
 * Configures CSP, HSTS, and other security headers
 */
import type { Express } from 'express';
/**
 * Configure comprehensive security headers
 */
export declare function configureSecurityHeaders(app: Express): void;
/**
 * CORS configuration for production
 */
export declare function getCorsOptions(): {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    optionsSuccessStatus: number;
};
