import fs from 'fs';
import path from 'path';

// Define log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
}

// Create logs directory if it doesn't exist
const LOGS_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Simple logger class
export class Logger {
  private logFilePath: string;
  private level: LogLevel;
  private logToFile: boolean;

  constructor(options: { level?: LogLevel; logToFile?: boolean } = {}) {
    this.level = options.level || 'info';
    this.logToFile = options.logToFile !== false; // Default to true
    this.logFilePath = path.join(LOGS_DIR, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = { timestamp, level, message };
    
    if (meta) {
      logEntry.meta = meta;
    }

    // Format as JSON for structured logging
    return JSON.stringify(logEntry);
  }

  private writeLog(level: LogLevel, message: string, meta?: any) {
    if (!this.shouldLog(level)) return;

    const logMessage = this.formatMessage(level, message, meta);
    
    // Output to console
    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      default:
        console.log(logMessage);
    }

    // Write to file if enabled
    if (this.logToFile) {
      try {
        fs.appendFileSync(this.logFilePath, logMessage + '\n');
      } catch (err) {
        console.error('Failed to write to log file:', err);
      }
    }
  }

  debug(message: string, meta?: any) {
    this.writeLog('debug', message, meta);
  }

  info(message: string, meta?: any) {
    this.writeLog('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.writeLog('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.writeLog('error', message, meta);
  }
}

// Create a global logger instance
export const logger = new Logger({
  level: process.env.LOG_LEVEL as LogLevel || 'info',
  logToFile: process.env.LOG_TO_FILE !== 'false'
});

// Middleware to log API requests
export function logApiRequest(request: Request, startTime: number, result: 'success' | 'error', responseStatus?: number) {
  const duration = Date.now() - startTime;
  const method = request.method;
  const url = request.url;

  logger.info('API Request', {
    method,
    url,
    duration: `${duration}ms`,
    result,
    status: responseStatus,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  });
}