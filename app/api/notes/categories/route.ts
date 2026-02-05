import { NextRequest } from 'next/server';
import * as categoriesService from '@/services/categoriesService';
import { apiSuccess, apiError, apiCreated } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const categories = await categoriesService.getActiveCategories();

        return apiSuccess(categories, 'Categories retrieved successfully');
    } catch (error) {
        console.error('Error fetching note categories:', error);
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
