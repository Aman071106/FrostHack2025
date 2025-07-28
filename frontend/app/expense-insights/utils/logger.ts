// app/expense-insights/utils/logger.ts
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Determine if we're running in browser or Node.js
const isBrowser = typeof window !== 'undefined';

// Set current log level based on environment
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LogLevel.INFO 
  : LogLevel.DEBUG;

class Logger {
  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  private _formatMessage(message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.module}] ${message}`;
  }

  private _shouldLog(level: LogLevel): boolean {
    return level <= CURRENT_LOG_LEVEL;
  }

  error(message: string, error: Error | null = null): void {
    if (this._shouldLog(LogLevel.ERROR)) {
      const formatted = this._formatMessage(`ERROR: ${message}`);
      if (isBrowser) {
        console.error(formatted);
        if (error) console.error(error);
      } else {
        // This will show in terminal/server logs
        console.error(formatted);
        if (error) console.error(error.stack || error);
      }
    }
  }

  warn(message: string): void {
    if (this._shouldLog(LogLevel.WARN)) {
      const formatted = this._formatMessage(`WARN: ${message}`);
      isBrowser ? console.warn(formatted) : console.warn(formatted);
    }
  }

  info(message: string): void {
    if (this._shouldLog(LogLevel.INFO)) {
      const formatted = this._formatMessage(`INFO: ${message}`);
      isBrowser ? console.info(formatted) : console.info(formatted);
    }
  }

  debug(message: string, data: any = null): void {
    if (this._shouldLog(LogLevel.DEBUG)) {
      const formatted = this._formatMessage(`DEBUG: ${message}`);
      if (isBrowser) {
        console.debug(formatted);
        if (data) console.debug(data);
      } else {
        console.debug(formatted);
        if (data) console.debug(JSON.stringify(data, null, 2));
      }
    }
  }
}

export const createLogger = (module: string): Logger => new Logger(module);
export default new Logger('expense-insights');