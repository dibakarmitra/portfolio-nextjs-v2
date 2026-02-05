import { NextRequest } from 'next/server';

export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    source: string;
    message: string;
    metadata?: Record<string, any>;
    userAgent?: string;
    ip?: string;
    url?: string;
}

let logs: LogEntry[] = [];
const MAX_LOGS = 1000;

export class Logger {
    private static generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private static addLog(
        level: LogEntry['level'],
        source: string,
        message: string,
        metadata?: Record<string, any>
    ) {
        const log: LogEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            level,
            source,
            message,
            metadata,
        };

        logs.unshift(log);

        if (logs.length > MAX_LOGS) {
            logs = logs.slice(0, MAX_LOGS);
        }

        const consoleMethod = level.toLowerCase() as 'info' | 'warn' | 'error' | 'debug';
        if (console[consoleMethod]) {
            console[consoleMethod](`[${source}] ${message}`, metadata || '');
        }
    }

    static info(source: string, message: string, metadata?: Record<string, any>) {
        this.addLog('INFO', source, message, metadata);
    }

    static warn(source: string, message: string, metadata?: Record<string, any>) {
        this.addLog('WARN', source, message, metadata);
    }

    static error(source: string, message: string, metadata?: Record<string, any>) {
        this.addLog('ERROR', source, message, metadata);
    }

    static debug(source: string, message: string, metadata?: Record<string, any>) {
        this.addLog('DEBUG', source, message, metadata);
    }

    static getLogs(level?: LogEntry['level'] | 'ALL', limit?: number): LogEntry[] {
        let filteredLogs = logs;

        if (level && level !== 'ALL') {
            filteredLogs = logs.filter((log) => log.level === level);
        }

        if (limit) {
            filteredLogs = filteredLogs.slice(0, limit);
        }

        return filteredLogs;
    }

    static clearLogs() {
        logs = [];
    }

    static getLogStats() {
        const stats = {
            total: logs.length,
            byLevel: {
                INFO: 0,
                WARN: 0,
                ERROR: 0,
                DEBUG: 0,
            } as Record<LogEntry['level'], number>,
            bySource: {} as Record<string, number>,
        };

        logs.forEach((log) => {
            stats.byLevel[log.level]++;
            stats.bySource[log.source] = (stats.bySource[log.source] || 0) + 1;
        });

        return stats;
    }
}

export function logRequest(request: NextRequest, source: string = 'http-request') {
    const url = request.url;
    const method = request.method;
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip =
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    Logger.info(source, `${method} ${url}`, {
        method,
        url,
        userAgent,
        ip,
    });
}

export class ClientLogger {
    static info(source: string, message: string, metadata?: Record<string, any>) {
        Logger.info(source, message, {
            ...metadata,
            userAgent: navigator.userAgent,
            url: window.location.href,
        });
    }

    static warn(source: string, message: string, metadata?: Record<string, any>) {
        Logger.warn(source, message, {
            ...metadata,
            userAgent: navigator.userAgent,
            url: window.location.href,
        });
    }

    static error(source: string, message: string, metadata?: Record<string, any>) {
        Logger.error(source, message, {
            ...metadata,
            userAgent: navigator.userAgent,
            url: window.location.href,
        });
    }

    static debug(source: string, message: string, metadata?: Record<string, any>) {
        Logger.debug(source, message, {
            ...metadata,
            userAgent: navigator.userAgent,
            url: window.location.href,
        });
    }
}
