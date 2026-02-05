import { NextRequest } from 'next/server';
import * as categoriesService from '@/services/categoriesService';
import { apiSuccess, apiError, apiNotFound } from '@/lib/apiResponse';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return apiError('Invalid category ID', 400);
        }

        const category = await categoriesService.getCategoryById(categoryId);

        if (!category) {
            return apiNotFound('Category');
        }

        return apiSuccess(category, 'Category retrieved successfully');
    } catch (error) {
        console.error('Error fetching category:', error);
        return apiError('Failed to fetch category', 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return apiError('Invalid category ID', 400);
        }

        const body = await request.json();
        const category = await categoriesService.updateCategory(categoryId, body);

        return apiSuccess(category, 'Category updated successfully');
    } catch (error) {
        console.error('Error updating category:', error);
        return apiError('Failed to update category', 500);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return apiError('Invalid category ID', 400);
        }

        await categoriesService.deleteCategory(categoryId);

        return apiSuccess({ success: true }, 'Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error);
        return apiError('Failed to delete category', 500);
    }
}
