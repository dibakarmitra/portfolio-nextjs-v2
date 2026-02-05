import { NextRequest } from 'next/server';
import * as notesService from '@/services/notesService';
import { apiSuccess, apiError, apiNotFound } from '@/lib/apiResponse';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const note = await notesService.getNoteBySlug(slug);

        if (!note) {
            return apiNotFound('Note');
        }

        // Increment views
        await notesService.incrementNoteViews(note.id);

        return apiSuccess(note, 'Note retrieved successfully');
    } catch (error) {
        console.error('Error fetching note by slug:', error);
        return apiError('Failed to fetch note', 500);
    }
}
