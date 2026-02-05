import { NextRequest } from 'next/server';
import * as categoriesService from '@/services/categoriesService';
import { apiSuccess, apiError } from '@/lib/apiResponse';

/**
 * GET handler for active categories (Public API)
 */
export async function GET(request: NextRequest) {
    try {
        const categories = await categoriesService.getActiveCategories();

        return apiSuccess(categories, 'Categories retrieved successfully');
    } catch (error) {
        console.error('Error fetching public categories:', error);
        return apiError('Failed to fetch categories', 500);
    }
}
