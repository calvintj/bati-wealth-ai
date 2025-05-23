type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000; // Keep last 1000 logs
  private readonly isDevelopment = process.env.NODE_ENV === "development";
  private readonly isProduction = process.env.NODE_ENV === "production";

  private constructor() {
    // Initialize logger
    this.logs = [];
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
      "password",
      "token",
      "secret",
      "key",
      "authorization",
    ];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = "[REDACTED]";
      }
    });

    return sanitized;
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const sanitizedData = this.sanitizeData(data);

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: sanitizedData,
    };

    this.logs.push(logEntry);

    // Keep only the last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Console logging behavior based on environment
    if (this.isDevelopment) {
      const consoleMethod =
        level === "error"
          ? "error"
          : level === "warn"
          ? "warn"
          : level === "debug"
          ? "debug"
          : "log";
      console[consoleMethod](
        `[${level.toUpperCase()}] ${message}`,
        sanitizedData || ""
      );
    } else if (this.isProduction && level === "error") {
      // In production, only log errors to console
      console.error(`[${level.toUpperCase()}] ${message}`, sanitizedData || "");
    }
  }

  public info(message: string, data?: any) {
    this.addLog("info", message, data);
  }

  public warn(message: string, data?: any) {
    this.addLog("warn", message, data);
  }

  public error(message: string, data?: any) {
    this.addLog("error", message, data);
  }

  public debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.addLog("debug", message, data);
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
