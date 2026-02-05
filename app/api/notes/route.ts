import { NextRequest, NextResponse } from 'next/server';
import * as notesService from '@/services/notesService';
import { requireAuth, getUserId } from '@/services/authService';
import {
    apiSuccess,
    apiCreated,
    apiError,
    apiValidationError,
    apiUnauthorized,
    apiPaginated,
} from '@/lib/apiResponse';

// Helper function to validate note data
function validateNoteData(data: any): any {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        throw new Error('Title is required and must be a non-empty string');
    }

    if (!data.content || typeof data.content !== 'string') {
        throw new Error('Content is required and must be a string');
    }

    if (!data.type || !['NOTE', 'BLOG', 'PROJECT'].includes(data.type)) {
        throw new Error('Type must be NOTE, BLOG, or PROJECT');
    }

    if (!data.status || !['draft', 'published', 'archived'].includes(data.status)) {
        throw new Error('Status must be draft, published, or archived');
    }

    return {
        title: data.title.trim(),
        content: data.content,
        type: data.type,
        status: data.status,
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: data.category || 'general',
    };
}

// GET all notes (authenticated users only)
export async function GET(request: NextRequest) {
    try {
        // Use middleware to check authentication
        const authError = await requireAuth(request);
        if (authError) return authError;

        const userId = await getUserId(request);
        if (!userId) {
            return apiUnauthorized('User ID not found');
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;
        const category = searchParams.get('category') || undefined;
        const search = searchParams.get('search') || undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const notes = await notesService.getAllNotes({
            status,
            category,
            search,
            page,
            limit,
        });

        const total = await notesService.countAllNotes({ status, category, search });

        return apiPaginated(notes, page, limit, total, 'Notes retrieved successfully');
    } catch (error: any) {
        console.error('Error fetching notes:', error);
        return apiError('Failed to fetch notes', 500);
    }
}

// POST create note (authenticated users only)
export async function POST(request: NextRequest) {
    try {
        // Use middleware to check authentication
        const authError = await requireAuth(request);
        if (authError) return authError;

        const userId = await getUserId(request);
        if (!userId) {
            return apiUnauthorized('User ID not found');
        }

        const data = await request.json();

        // Validate and sanitize input
        const validatedData = validateNoteData(data);

        // Create note with user ID
        const note = await notesService.createNote({
            ...validatedData,
            userId: userId, // Associate note with authenticated user
        });

        return apiCreated(note, 'Note created successfully');
    } catch (error: any) {
        console.error('Error creating note:', error);

        if (error.message.includes('required') || error.message.includes('must be')) {
            return apiValidationError({ message: error.message });
        }

        return apiError('Failed to create note', 500);
    }
}
