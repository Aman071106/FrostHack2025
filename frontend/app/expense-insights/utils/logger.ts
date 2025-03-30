// app/expense-insights/utils/logger.ts

/**
 * Logger utility for the expense insights module
 * Provides different log levels and formatted output
 */

enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
  }
  
  // Set current log level based on environment
  const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
    ? LogLevel.INFO 
    : LogLevel.DEBUG;
  
  class Logger {
    private module: string;
  
    constructor(module: string) {
      this.module = module;
    }
  
    // Format log message with timestamp and module name
    private _formatMessage(message: string): string {
      const timestamp = new Date().toISOString();
      return `[${timestamp}] [${this.module}] ${message}`;
    }
  
    // Check if this log level should be displayed
    private _shouldLog(level: LogLevel): boolean {
      return level <= CURRENT_LOG_LEVEL;
    }
  
    error(message: string, error: Error | null = null): void {
      if (this._shouldLog(LogLevel.ERROR)) {
        console.error(this._formatMessage(`ERROR: ${message}`));
        if (error && error.stack) {
          console.error(error.stack);
        }
      }
    }
  
    warn(message: string): void {
      if (this._shouldLog(LogLevel.WARN)) {
        console.warn(this._formatMessage(`WARN: ${message}`));
      }
    }
  
    info(message: string): void {
      if (this._shouldLog(LogLevel.INFO)) {
        console.info(this._formatMessage(`INFO: ${message}`));
      }
    }
  
    debug(message: string, data: any = null): void {
      if (this._shouldLog(LogLevel.DEBUG)) {
        console.debug(this._formatMessage(`DEBUG: ${message}`));
        if (data) {
          console.debug(data);
        }
      }
    }
  }
  
  // Export a function to create logger instances
  export const createLogger = (module: string): Logger => new Logger(module);
  
  // Default logger for general app usage
  export default new Logger('expense-insights');