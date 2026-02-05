import { NextRequest } from 'next/server';
import * as notesService from '@/services/notesService';
import { apiPaginated, apiError } from '@/lib/apiResponse';

/**
 * GET handler for published notes (Public API)
 * Supports pagination via page and limit query parameters
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category') || undefined;

        // Only fetch published notes
        const notes = await notesService.getAllNotes({
            status: 'published',
            category,
            page,
            limit,
        });

        const total = await notesService.countAllNotes({
            status: 'published',
            category,
        });

        return apiPaginated(notes, page, limit, total, 'Published notes retrieved successfully');
    } catch (error) {
        console.error('Error fetching published notes:', error);
        return apiError('Failed to fetch notes', 500);
    }
}
