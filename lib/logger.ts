/**
 * Centralized logging service for the admin dashboard
 * Provides consistent logging across the application
 * Can be extended to integrate with external logging services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  error?: Error;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  private log(level: LogLevel, message: string, error?: Error, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      error,
      context,
    };

    // Add to in-memory log storage
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Only log to console in development
    if (this.isDevelopment) {
      const logFn = console[level] || console.log;
      logFn(`[${entry.timestamp}] ${message}`, error || '', context || '');
    }

    // In production, you would send to a logging service here
    // Example: sendToSentry(entry);
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, undefined, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, undefined, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, error, context);

    // In production, send to error tracking service
    // if (!this.isDevelopment) {
    //   this.sendToErrorTracking(message, error, context);
    // }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log('debug', message, undefined, context);
    }
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  // TODO: Implement error tracking service integration
  // Example: Integrate with Sentry, LogRocket, or similar service
  // private sendToErrorTracking(message: string, error?: Error, context?: Record<string, unknown>) {
  //   Sentry.captureException(error, { extra: context });
  // }
}

// Export singleton instance
export const logger = new Logger();
export default logger;