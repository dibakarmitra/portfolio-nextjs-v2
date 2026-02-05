import { NextRequest } from 'next/server';
import * as resumeService from '@/services/resumeService';
import { apiPaginated, apiError } from '@/lib/apiResponse';
import { ResumeContentType } from '@/types';

/**
 * GET handler for published projects (Public API)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Only fetch published projects from resume_contents
        const allPublished = await resumeService.getPublishedResumeContentsByType(
            ResumeContentType.PROJECT
        );

        // Manual pagination since resumeService doesn't seem to have paginated published fetch yet
        const total = allPublished.length;
        const offset = (page - 1) * limit;
        const projects = allPublished.slice(offset, offset + limit);

        return apiPaginated(
            projects,
            page,
            limit,
            total,
            'Published projects retrieved successfully'
        );
    } catch (error) {
        console.error('Error fetching published projects:', error);
        return apiError('Failed to fetch projects', 500);
    }
}
