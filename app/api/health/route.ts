import { NextResponse } from 'next/server';
import { db } from '@/config/database';
import { apiSuccess, apiError } from '@/lib/apiResponse';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
    try {
        // Check database connection
        await db.raw('SELECT 1');

        return apiSuccess(
            {
                services: {
                    database: 'connected',
                    api: 'operational',
                },
            },
            'System is healthy'
        );
    } catch (error) {
        console.error('Health check failed:', error);

        return apiError(
            'System is unhealthy - Database connection failed',
            503,
            'SERVICE_UNAVAILABLE',
            {
                services: {
                    database: 'disconnected',
                    api: 'operational',
                },
            }
        );
    }
}
