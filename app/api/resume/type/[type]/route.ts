import { NextRequest } from 'next/server';
import {
    getResumeContentsByType,
    getPublishedResumeContentsByType,
} from '@/services/resumeService';
import { apiSuccess, apiError } from '@/lib/apiResponse';

// GET resume content by type
export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
    try {
        const { type } = await params;
        const { searchParams } = new URL(request.url);
        const published = searchParams.get('published');

        let resumeContents;
        if (published === 'true') {
            resumeContents = await getPublishedResumeContentsByType(type as any);
        } else {
            resumeContents = await getResumeContentsByType(type as any);
        }

        return apiSuccess(resumeContents, 'Resume contents by type retrieved successfully');
    } catch (error: any) {
        return apiError(error.message, 500);
    }
}
