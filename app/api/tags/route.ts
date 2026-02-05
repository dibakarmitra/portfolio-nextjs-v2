import { NextRequest } from 'next/server';
import * as tagsService from '@/services/tagsService';
import { apiSuccess, apiCreated, apiError } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const activeOnly = searchParams.get('active') === 'true';

        const tags = search
            ? await tagsService.searchTags(search)
            : activeOnly
              ? await tagsService.getActiveTags()
              : await tagsService.getAllTags();

        return apiSuccess(tags, 'Tags retrieved successfully');
    } catch (error) {
        console.error('Error fetching tags:', error);
        return apiError('Failed to fetch tags', 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const tag = await tagsService.createTag(body);

        return apiCreated(tag, 'Tag created successfully');
    } catch (error) {
        console.error('Error creating tag:', error);
        return apiError('Failed to create tag', 500);
    }
}
