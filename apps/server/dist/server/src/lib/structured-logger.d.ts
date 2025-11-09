/**
 * Structured Logging System
 * Provides comprehensive logging with levels, contexts, and formatting
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    CRITICAL = 4
}
interface LogContext {
    requestId?: string;
    userId?: string;
    sessionId?: string;
    ip?: string;
    userAgent?: string;
    [key: string]: any;
}
interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
    metadata?: Record<string, any>;
}
export declare class StructuredLogger {
    private logLevel;
    private context;
    private enableConsole;
    private logHistory;
    private maxHistorySize;
    constructor(logLevel?: LogLevel, enableConsole?: boolean, maxHistorySize?: number);
    /**
     * Set global context
     */
    setContext(context: LogContext): void;
    /**
     * Clear global context
     */
    clearContext(): void;
    /**
     * Debug log
     */
    debug(message: string, metadata?: Record<string, any>): void;
    /**
     * Info log
     */
    info(message: string, metadata?: Record<string, any>): void;
    /**
     * Warning log
     */
    warn(message: string, metadata?: Record<string, any>): void;
    /**
     * Error log
     */
    error(message: string, error?: Error, metadata?: Record<string, any>): void;
    /**
     * Critical error log
     */
    critical(message: string, error?: Error, metadata?: Record<string, any>): void;
    /**
     * Core logging method
     */
    private log;
    /**
     * Output to console with formatting
     */
    private consoleOutput;
    /**
     * Get color for log level
     */
    private getLevelColor;
    /**
     * Get icon for log level
     */
    private getLevelIcon;
    /**
     * Get log history
     */
    getHistory(level?: LogLevel): LogEntry[];
    /**
     * Clear log history
     */
    clearHistory(): void;
    /**
     * Export logs as JSON
     */
    exportLogs(): string;
}
/**
 * Performance logger for tracking operation timing
 */
export declare class PerformanceLogger {
    private timers;
    private logger;
    constructor(logger: StructuredLogger);
    /**
     * Start timing an operation
     */
    start(operation: string): void;
    /**
     * End timing and log duration
     */
    end(operation: string, metadata?: Record<string, any>): number;
    /**
     * Measure async operation
     */
    measure<T>(operation: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T>;
}
/**
 * Singleton logger instance
 */
export declare const logger: StructuredLogger;
export declare const perfLogger: PerformanceLogger;
export {};
