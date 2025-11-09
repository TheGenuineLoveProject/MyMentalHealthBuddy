/**
 * Production-Grade Logger System
 * Replaces console statements with structured logging
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
class Logger {
    minLevel;
    isDevelopment;
    constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production';
        this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [${level}] ${message}${contextStr}`;
    }
    shouldLog(level) {
        return level >= this.minLevel;
    }
    debug(message, context) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(this.formatMessage('DEBUG', message, context));
        }
    }
    info(message, context) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(this.formatMessage('INFO', message, context));
        }
    }
    warn(message, context) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage('WARN', message, context));
        }
    }
    error(message, error, context) {
        if (this.shouldLog(LogLevel.ERROR)) {
            const errorContext = error instanceof Error
                ? { error: error.message, stack: error.stack, ...context }
                : { ...error, ...context };
            console.error(this.formatMessage('ERROR', message, errorContext));
        }
    }
    http(method, path, statusCode, duration) {
        const durationStr = duration ? ` (${duration}ms)` : '';
        this.info(`${method} ${path} ${statusCode}${durationStr}`);
    }
    metric(name, value, unit) {
        const unitStr = unit ? ` ${unit}` : '';
        this.info(`Metric: ${name} = ${value}${unitStr}`);
    }
}
export const logger = new Logger();
