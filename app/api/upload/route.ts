import { NextRequest } from 'next/server';
import { uploadFile } from '@/services/storageService';
import { db } from '@/config/database';
import { v7 as uuid } from 'uuid';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return apiError('No file provided', 400);
        }

        const arrayBuffer = await file.arrayBuffer();
        const body = Buffer.from(arrayBuffer);

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
                created_at: new Date(),
                updated_at: new Date(),
            });

            return apiSuccess(
                {
                    file: {
                        id: fileId,
                        name: file.name,
                        url: result.url,
                        type: fileType,
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        date: new Date().toISOString(),
                    },
                },
                'File uploaded successfully'
            );
        } else {
            return apiError(result.error || 'Upload failed', 500);
        }
    } catch (error) {
        console.error('Upload API error:', error);
        return apiError('Internal server error', 500);
    }
}
