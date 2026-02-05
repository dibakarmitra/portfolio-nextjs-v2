import { NextRequest } from 'next/server';
import * as tagsService from '@/services/tagsService';
import { apiSuccess, apiError, apiNotFound } from '@/lib/apiResponse';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tag = await tagsService.getTagById(Number(id));

        if (!tag) {
            return apiNotFound('Tag');
        }

        return apiSuccess(tag, 'Tag retrieved successfully');
    } catch (error) {
        console.error('Error fetching tag:', error);
        return apiError('Failed to fetch tag', 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const tag = await tagsService.updateTag(Number(id), body);

        return apiSuccess(tag, 'Tag updated successfully');
    } catch (error) {
        console.error('Error updating tag:', error);
        return apiError('Failed to update tag', 500);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await tagsService.deleteTag(Number(id));

        return apiSuccess(null, 'Tag deleted successfully');
    } catch (error) {
        console.error('Error deleting tag:', error);
        return apiError('Failed to delete tag', 500);
    }
}
