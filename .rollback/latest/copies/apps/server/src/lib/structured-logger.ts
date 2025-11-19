/**
 * Structured Logging System
 * Provides comprehensive logging with levels, contexts, and formatting
 */

export enum LogLevel {
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

export class StructuredLogger {
  private logLevel: LogLevel;
  private context: LogContext;
  private enableConsole: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize: number;

  constructor(
    logLevel: LogLevel = LogLevel.INFO,
    enableConsole = true,
    maxHistorySize = 1000
  ) {
    this.logLevel = logLevel;
    this.context = {};
    this.enableConsole = enableConsole;
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Set global context
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear global context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Debug log
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Info log
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Warning log
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Error log
   */
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
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
  critical(message: string, error?: Error, metadata?: Record<string, any>): void {
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
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: { name: string; message: string; stack?: string }
  ): void {
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
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
  private consoleOutput(entry: LogEntry): void {
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
  private getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m',  // Green
      WARN: '\x1b[33m',  // Yellow
      ERROR: '\x1b[31m', // Red
      CRITICAL: '\x1b[35m' // Magenta
    };
    return colors[level] || '\x1b[0m';
  }

  /**
   * Get icon for log level
   */
  private getLevelIcon(level: string): string {
    const icons: Record<string, string> = {
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
  getHistory(level?: LogLevel): LogEntry[] {
    if (level === undefined) {
      return [...this.logHistory];
    }

    return this.logHistory.filter(entry => 
      LogLevel[entry.level as keyof typeof LogLevel] >= level
    );
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }
}

/**
 * Performance logger for tracking operation timing
 */
export class PerformanceLogger {
  private timers: Map<string, number> = new Map();
  private logger: StructuredLogger;

  constructor(logger: StructuredLogger) {
    this.logger = logger;
  }

  /**
   * Start timing an operation
   */
  start(operation: string): void {
    this.timers.set(operation, Date.now());
  }

  /**
   * End timing and log duration
   */
  end(operation: string, metadata?: Record<string, any>): number {
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
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(operation);
    try {
      const result = await fn();
      this.end(operation, metadata);
      return result;
    } catch (error) {
      this.end(operation, { ...metadata, error: true });
      throw error;
    }
  }
}

/**
 * Singleton logger instance
 */
export const logger = new StructuredLogger(
  process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  true,
  5000
);

export const perfLogger = new PerformanceLogger(logger);
