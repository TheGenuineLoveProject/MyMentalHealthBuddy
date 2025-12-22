/**
 * Production-Grade Logger System
 * Replaces console statements with structured logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error instanceof Error 
        ? { error: error.message, stack: error.stack, ...context }
        : { ...error, ...context };
      console.error(this.formatMessage('ERROR', message, errorContext));
    }
  }

  http(method: string, path: string, statusCode: number, duration?: number): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    this.info(`${method} ${path} ${statusCode}${durationStr}`);
  }

  metric(name: string, value: number, unit?: string): void {
    const unitStr = unit ? ` ${unit}` : '';
    this.info(`Metric: ${name} = ${value}${unitStr}`);
  }
}

export const logger = new Logger();
