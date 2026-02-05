import { NextRequest } from 'next/server';
import {
    getAllResumeContents,
    getResumeContentsGroupedByType,
    createResumeContent,
} from '@/services/resumeService';
import { apiSuccess, apiCreated, apiError } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const grouped = searchParams.get('grouped') === 'true';

        let data;
        if (grouped) {
            data = await getResumeContentsGroupedByType();
        } else {
            data = await getAllResumeContents();
        }

        return apiSuccess(data);
    } catch (error) {
        console.error('Error fetching resume contents:', error);
        return apiError('Failed to fetch resume contents', 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newContent = await createResumeContent(body);

        return apiCreated(newContent, 'Resume content created successfully');
    } catch (error) {
        console.error('Error creating resume content:', error);
        return apiError('Failed to create resume content', 500);
    }
}
