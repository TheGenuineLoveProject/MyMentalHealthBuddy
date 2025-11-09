/**
 * Structured Logging System
 * Provides comprehensive logging with levels, contexts, and formatting
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["CRITICAL"] = 4] = "CRITICAL";
})(LogLevel || (LogLevel = {}));
export class StructuredLogger {
    logLevel;
    context;
    enableConsole;
    logHistory = [];
    maxHistorySize;
    constructor(logLevel = LogLevel.INFO, enableConsole = true, maxHistorySize = 1000) {
        this.logLevel = logLevel;
        this.context = {};
        this.enableConsole = enableConsole;
        this.maxHistorySize = maxHistorySize;
    }
    /**
     * Set global context
     */
    setContext(context) {
        this.context = { ...this.context, ...context };
    }
    /**
     * Clear global context
     */
    clearContext() {
        this.context = {};
    }
    /**
     * Debug log
     */
    debug(message, metadata) {
        this.log(LogLevel.DEBUG, message, metadata);
    }
    /**
     * Info log
     */
    info(message, metadata) {
        this.log(LogLevel.INFO, message, metadata);
    }
    /**
     * Warning log
     */
    warn(message, metadata) {
        this.log(LogLevel.WARN, message, metadata);
    }
    /**
     * Error log
     */
    error(message, error, metadata) {
        const errorData = error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : undefined;
        this.log(LogLevel.ERROR, message, metadata, errorData);
    }
    /**
     * Critical error log
     */
    critical(message, error, metadata) {
        const errorData = error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : undefined;
        this.log(LogLevel.CRITICAL, message, metadata, errorData);
    }
    /**
     * Core logging method
     */
    log(level, message, metadata, error) {
        if (level < this.logLevel) {
            return;
        }
        const entry = {
            timestamp: new Date().toISOString(),
            level: LogLevel[level],
            message,
            context: Object.keys(this.context).length > 0 ? { ...this.context } : undefined,
            metadata,
            error
        };
        // Add to history
        this.logHistory.push(entry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }
        // Console output
        if (this.enableConsole) {
            this.consoleOutput(entry);
        }
    }
    /**
     * Output to console with formatting
     */
    consoleOutput(entry) {
        const color = this.getLevelColor(entry.level);
        const icon = this.getLevelIcon(entry.level);
        const parts = [
            `${icon} [${entry.timestamp}]`,
            `[${entry.level}]`,
            entry.message
        ];
        if (entry.context) {
            parts.push(`\nContext: ${JSON.stringify(entry.context, null, 2)}`);
        }
        if (entry.metadata) {
            parts.push(`\nMetadata: ${JSON.stringify(entry.metadata, null, 2)}`);
        }
        if (entry.error) {
            parts.push(`\nError: ${entry.error.name}: ${entry.error.message}`);
            if (entry.error.stack) {
                parts.push(`\n${entry.error.stack}`);
            }
        }
        const output = parts.join(' ');
        switch (entry.level) {
            case 'DEBUG':
                console.debug(output);
                break;
            case 'INFO':
                console.info(output);
                break;
            case 'WARN':
                console.warn(output);
                break;
            case 'ERROR':
            case 'CRITICAL':
                console.error(output);
                break;
        }
    }
    /**
     * Get color for log level
     */
    getLevelColor(level) {
        const colors = {
            DEBUG: '\x1b[36m', // Cyan
            INFO: '\x1b[32m', // Green
            WARN: '\x1b[33m', // Yellow
            ERROR: '\x1b[31m', // Red
            CRITICAL: '\x1b[35m' // Magenta
        };
        return colors[level] || '\x1b[0m';
    }
    /**
     * Get icon for log level
     */
    getLevelIcon(level) {
        const icons = {
            DEBUG: '🐛',
            INFO: 'ℹ️',
            WARN: '⚠️',
            ERROR: '❌',
            CRITICAL: '🚨'
        };
        return icons[level] || '📝';
    }
    /**
     * Get log history
     */
    getHistory(level) {
        if (level === undefined) {
            return [...this.logHistory];
        }
        return this.logHistory.filter(entry => LogLevel[entry.level] >= level);
    }
    /**
     * Clear log history
     */
    clearHistory() {
        this.logHistory = [];
    }
    /**
     * Export logs as JSON
     */
    exportLogs() {
        return JSON.stringify(this.logHistory, null, 2);
    }
}
/**
 * Performance logger for tracking operation timing
 */
export class PerformanceLogger {
    timers = new Map();
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Start timing an operation
     */
    start(operation) {
        this.timers.set(operation, Date.now());
    }
    /**
     * End timing and log duration
     */
    end(operation, metadata) {
        const startTime = this.timers.get(operation);
        if (!startTime) {
            this.logger.warn(`Timer not found for operation: ${operation}`);
            return 0;
        }
        const duration = Date.now() - startTime;
        this.timers.delete(operation);
        this.logger.info(`Operation completed: ${operation}`, {
            ...metadata,
            duration: `${duration}ms`
        });
        return duration;
    }
    /**
     * Measure async operation
     */
    async measure(operation, fn, metadata) {
        this.start(operation);
        try {
            const result = await fn();
            this.end(operation, metadata);
            return result;
        }
        catch (error) {
            this.end(operation, { ...metadata, error: true });
            throw error;
        }
    }
}
/**
 * Singleton logger instance
 */
export const logger = new StructuredLogger(process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG, true, 5000);
export const perfLogger = new PerformanceLogger(logger);
