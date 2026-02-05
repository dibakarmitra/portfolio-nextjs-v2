import { NextRequest } from 'next/server';
import { db } from '@/config/database';
import { apiSuccess, apiError, apiNotFound, apiNoContent } from '@/lib/apiResponse';
import { deleteFile } from '@/services/storageService';

export const runtime = 'nodejs';

// PUT /api/media/[id] - Update media file
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, alt, caption } = body;

        if (!name || typeof name !== 'string') {
            return apiError('Name is required', 400);
        }

        const updatedFile = await db('media_files')
            .where('id', id)
            .update({
                name: name.trim(),
                alt: alt || null,
                caption: caption || null,
                updated_at: new Date(),
            })
            .returning('*')
            .then((rows) => rows[0]);

        if (!updatedFile) {
            return apiNotFound('Media file');
        }

        const transformedFile = {
            id: updatedFile.id,
            name: updatedFile.name,
            url: updatedFile.url,
            type: updatedFile.type,
            size: updatedFile.size_bytes
                ? `${(updatedFile.size_bytes / 1024).toFixed(1)} KB`
                : 'Unknown',
            date: updatedFile.created_at,
            alt: updatedFile.alt,
            caption: updatedFile.caption,
            contentType: updatedFile.content_type,
            source: updatedFile.source,
        };

        return apiSuccess({ file: transformedFile }, 'Media file updated successfully');
    } catch (error) {
        console.error('Update media API error:', error);
        return apiError('Failed to update media file', 500);
    }
}

// DELETE /api/media/[id] - Delete media file
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const file = await db('media_files').where('id', id).first();

        if (!file) {
            return apiNotFound('Media file');
        }

        await db('media_files').where('id', id).del();
        await deleteFile(file.key);

        return apiNoContent();
    } catch (error) {
        console.error('Delete media API error:', error);
        return apiError('Failed to delete media file', 500);
    }
}
