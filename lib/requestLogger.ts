import { NextRequest, NextResponse } from 'next/server';

interface LogEntry {
    timestamp: string;
    method: string;
    url: string;
    status?: number;
    duration?: number;
    error?: string;
    ip?: string;
    userAgent?: string;
}

class RequestLogger {
    private logs: LogEntry[] = [];
    private maxLogs = 1000; // keep last 1000 requests
    private enabled = true;

    log(entry: LogEntry): void {
        if (!this.enabled) return;

        this.logs.push(entry);

        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        if (process.env.NODE_ENV === 'development') {
            const statusColor = entry.status && entry.status < 400 ? '\x1b[32m' : '\x1b[31m';
            const reset = '\x1b[0m';
            console.log(
                `[${entry.timestamp}] ${statusColor}${entry.method}${reset} ${entry.url} - ${entry.status || '?'} (${entry.duration || 0}ms)`
            );
            if (entry.error) {
                console.error(`  Error: ${entry.error}`);
            }
        }
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    getRecentLogs(count: number = 50): LogEntry[] {
        return this.logs.slice(-count);
    }

    clear(): void {
        this.logs = [];
    }

    filter(predicate: (entry: LogEntry) => boolean): LogEntry[] {
        return this.logs.filter(predicate);
    }

    getErrors(): LogEntry[] {
        return this.logs.filter((log) => log.error || (log.status && log.status >= 400));
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
}

export const requestLogger = new RequestLogger();

export function withRequestLogging<T extends NextRequest>(
    handler: (request: T) => Promise<NextResponse>
) {
    return async (request: T): Promise<NextResponse> => {
        const startTime = Date.now();
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            method: request.method,
            url: request.url,
            ip:
                request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
        };

        try {
            const response = await handler(request);

            logEntry.status = response.status;
            logEntry.duration = Date.now() - startTime;

            requestLogger.log(logEntry);

            response.headers.set('X-Response-Time', `${logEntry.duration}ms`);

            return response;
        } catch (error) {
            logEntry.error = error instanceof Error ? error.message : 'Unknown error';
            logEntry.duration = Date.now() - startTime;
            logEntry.status = 500;

            requestLogger.log(logEntry);

            throw error;
        }
    };
}

export function logRequest(
    method: string,
    url: string,
    status: number,
    duration: number,
    error?: string
): void {
    requestLogger.log({
        timestamp: new Date().toISOString(),
        method,
        url,
        status,
        duration,
        error,
    });
}

export function exportLogs(): string {
    return JSON.stringify(requestLogger.getLogs(), null, 2);
}
