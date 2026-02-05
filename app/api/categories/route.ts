import { NextRequest } from 'next/server';
import * as categoriesService from '@/services/categoriesService';
import { apiSuccess, apiCreated, apiError } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') === 'true';

        const categories = activeOnly
            ? await categoriesService.getActiveCategories()
            : await categoriesService.getAllCategories();

        return apiSuccess(categories, 'Categories retrieved successfully');
    } catch (error) {
        console.error('Error fetching categories:', error);
        return apiError('Failed to fetch categories', 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const category = await categoriesService.createCategory(body);

        return apiCreated(category, 'Category created successfully');
    } catch (error) {
        console.error('Error creating category:', error);
        return apiError('Failed to create category', 500);
    }
}
