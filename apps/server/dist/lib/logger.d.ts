/**
 * Production-Grade Logger System
 * Replaces console statements with structured logging
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
interface LogContext {
    [key: string]: any;
}
declare class Logger {
    private minLevel;
    private isDevelopment;
    constructor();
    private formatMessage;
    private shouldLog;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error | LogContext, context?: LogContext): void;
    http(method: string, path: string, statusCode: number, duration?: number): void;
    metric(name: string, value: number, unit?: string): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map