import { NextRequest } from 'next/server';
import { db } from '@/config/database';
import { apiSuccess, apiError, apiCreated } from '@/lib/apiResponse';
import { v7 as uuid } from 'uuid';

export const runtime = 'nodejs';

// GET /api/media - List all media files
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filterType = searchParams.get('type') || undefined;

        let query = db('media_files').select('*').orderBy('created_at', 'desc');

        if (filterType && ['image', 'file'].includes(filterType)) {
            query = query.where('type', filterType);
        }

        const files = await query;

        const transformedFiles = files.map((file) => ({
            id: file.id,
            name: file.name,
            url: file.url,
            type: file.type,
            size: file.size_bytes ? `${(file.size_bytes / 1024).toFixed(1)} KB` : 'Unknown',
            date: file.created_at,
            alt: file.alt,
            contentType: file.content_type,
            source: file.source,
            caption: file.caption,
        }));

        return apiSuccess({ files: transformedFiles }, 'Media files retrieved successfully');
    } catch (error) {
        console.error('List media API error:', error);
        return apiError('Failed to list media files', 500);
    }
}

// POST /api/media - Upload media files
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return apiError('No file provided', 400);
        }

        // Validate file size (10MB max)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            return apiError('File size exceeds 10MB limit', 400);
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
        ];
        if (!allowedTypes.includes(file.type)) {
            return apiError(
                'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG, PDF',
                415,
                'UNSUPPORTED_MEDIA_TYPE',
                { allowedTypes }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const body = Buffer.from(arrayBuffer);

        const { uploadFile } = await import('@/services/storageService');

        const result = await uploadFile(body, {
            fileName: file.name,
            contentType: file.type,
        });

        if (result.success) {
            const fileId = uuid();
            const fileType = file.type.startsWith('image/') ? 'image' : 'file';

            await db('media_files').insert({
                id: fileId,
                key: result.key,
                url: result.url,
                name: file.name,
                type: fileType,
                content_type: file.type,
                size_bytes: file.size,
                source: 'media',
                alt: null,
                caption: null,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const fileData = {
                id: fileId,
                name: file.name,
                url: result.url,
                type: fileType,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                date: new Date().toISOString(),
            };

            return apiCreated({ file: fileData }, 'File uploaded successfully');
        } else {
            return apiError(result.error || 'Upload failed', 500);
        }
    } catch (error) {
        console.error('Upload media API error:', error);
        return apiError('Failed to upload file', 500);
    }
}
