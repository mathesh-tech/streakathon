export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogContext {
  userId?: string;
  action?: string;
  target?: string;
  [key: string]: any;
}

export class LoggingService {
  private static formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${
      context ? JSON.stringify(context) : ''
    }`;
  }

  static info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  static warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  static error(message: string, error?: unknown, context?: LogContext) {
    const errorDetails = error instanceof Error ? { error: error.message, stack: error.stack } : { error };
    console.error(this.formatMessage('error', message, { ...context, ...errorDetails }));
  }

  static debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}
