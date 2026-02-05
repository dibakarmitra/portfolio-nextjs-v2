import { NextRequest } from 'next/server';
import {
    getResumeContentById,
    updateResumeContent,
    deleteResumeContent,
} from '@/services/resumeService';
import { apiSuccess, apiError, apiNotFound } from '@/lib/apiResponse';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const resumeContent = await getResumeContentById(Number(id));

        if (!resumeContent) {
            return apiNotFound('Resume content');
        }

        return apiSuccess(resumeContent);
    } catch (error) {
        console.error('Error fetching resume content:', error);
        return apiError('Failed to fetch resume content', 500);
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updatedContent = await updateResumeContent(Number(id), body);

        return apiSuccess(updatedContent, 'Resume content updated successfully');
    } catch (error) {
        console.error('Error updating resume content:', error);
        return apiError('Failed to update resume content', 500);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const success = await deleteResumeContent(Number(id));

        if (!success) {
            return apiError('Failed to delete resume content', 500);
        }

        return apiSuccess(null, 'Resume content deleted successfully');
    } catch (error) {
        console.error('Error deleting resume content:', error);
        return apiError('Failed to delete resume content', 500);
    }
}
