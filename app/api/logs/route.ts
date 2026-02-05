import { NextRequest } from 'next/server';
import { Logger } from '@/lib/logger';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let initialized = false;

function initializeLogs() {
    if (!initialized) {
        Logger.info('app-init', 'Application starting up', {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        });

        Logger.info('app-init', 'Logger system initialized', {
            maxLogs: 1000,
            pollingInterval: '5s',
        });

        Logger.info('system', 'Next.js application ready', {
            version: '16.0.0',
            runtime: 'Edge Runtime',
        });

        Logger.info('auth', 'Authentication system ready');
        Logger.info('database', 'Mock data loaded', {
            posts: 10,
            mediaFiles: 5,
        });

        initialized = true;
    }
}

export async function GET(request: NextRequest) {
    try {
        initializeLogs();

        const { searchParams } = new URL(request.url);
        const level = searchParams.get('level') as any;
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        const logs = Logger.getLogs(level || 'ALL', limit);
        const stats = Logger.getLogStats();

        return apiSuccess(
            {
                logs,
                stats,
                timestamp: new Date().toISOString(),
            },
            'Logs retrieved successfully'
        );
    } catch (error) {
        Logger.error('logs-api', 'Failed to fetch logs', { error: String(error) });
        return apiError('Failed to fetch logs', 500);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        initializeLogs();

        Logger.clearLogs();

        Logger.info('logs-api', 'Logs cleared by user');

        return apiSuccess(
            {
                message: 'Logs cleared successfully',
                timestamp: new Date().toISOString(),
            },
            'Logs cleared successfully'
        );
    } catch (error) {
        Logger.error('logs-api', 'Failed to clear logs', { error: String(error) });
        return apiError('Failed to clear logs', 500);
    }
}
