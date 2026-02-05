import { NextRequest } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/services/userService';
import { apiSuccess, apiError, apiNotFound, apiUnauthorized } from '@/lib/apiResponse';
import { auth } from '@/lib/auth';

// GET current user profile
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return apiUnauthorized('Please login to access this resource');
        }

        const userId = session.user.id;
        const profile = await getUserProfile(userId);

        if (!profile) {
            return apiNotFound('User profile');
        }

        return apiSuccess(profile, 'User profile retrieved successfully');
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return apiError(error.message, 500);
    }
}

// PUT update current user profile
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return apiUnauthorized('Please login to access this resource');
        }

        const userId = session.user.id;
        const profile = await request.json();

        const updated = await updateUserProfile(userId, profile);

        if (!updated) {
            return apiError('Failed to update profile', 500);
        }

        return apiSuccess(updated, 'User profile updated successfully');
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return apiError(error.message, 500);
    }
}
