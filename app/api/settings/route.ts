import { NextRequest } from 'next/server';
import { getAllSettings, updateSettings, resetSettings } from '@/services/settingsService';
import { requireAdmin } from '@/services/authService';
import { apiSuccess, apiError } from '@/lib/apiResponse';

// Define allowed settings schema for validation
const allowedSettings = [
    'site.name',
    'site.description',
    'site.url',
    'site.adminEmail',
    'site.language',
    'site.timezone',
    'theme.mode',
    'features.notifications',
    'features.analytics',
    'features.maintenanceMode',
    'upload.maxSize',
    'upload.allowedTypes',
    'seo.title',
    'seo.description',
    'seo.keywords',
];

// Helper function to validate settings data
function validateSettings(data: any): Record<string, any> {
    const validated: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
        if (!allowedSettings.includes(key)) {
            throw new Error(`Invalid setting key: ${key}`);
        }

        // Basic validation
        if (key === 'site.name' && typeof value !== 'string') {
            throw new Error('site.name must be a string');
        }
        if (key === 'site.url' && value && typeof value === 'string' && !isValidUrl(value)) {
            throw new Error('site.url must be a valid URL');
        }
        if (
            key === 'site.adminEmail' &&
            value &&
            typeof value === 'string' &&
            !isValidEmail(value)
        ) {
            throw new Error('site.adminEmail must be a valid email');
        }
        if (
            key === 'theme.mode' &&
            typeof value === 'string' &&
            !['light', 'dark', 'system'].includes(value)
        ) {
            throw new Error('theme.mode must be light, dark, or system');
        }

        validated[key] = value;
    }

    return validated;
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// GET all settings (admin only)
export async function GET(request: NextRequest) {
    try {
        // Use middleware to check authentication and admin role
        const authError = await requireAdmin(request);
        if (authError) return authError;

        const settings = await getAllSettings();

        // Filter out sensitive settings from response
        const publicSettings = settings.filter((setting) => {
            // Define sensitive keys that shouldn't be exposed
            const sensitiveKeys = ['api.key', 'database.password', 'smtp.password', 'jwt.secret'];
            return !sensitiveKeys.some((sensitiveKey) => setting.key.includes(sensitiveKey));
        });

        return apiSuccess(publicSettings, 'Settings retrieved successfully');
    } catch (error: any) {
        console.error('Error fetching settings:', error);
        // Don't expose error details to client
        return apiError('Internal server error', 500);
    }
}

// PUT update settings (admin only)
export async function PUT(request: NextRequest) {
    try {
        // Use middleware to check authentication and admin role
        const authError = await requireAdmin(request);
        if (authError) return authError;

        const data = await request.json();

        // Validate and sanitize input
        const validatedData = validateSettings(data);

        // Use transaction for atomic updates
        const updatedSettings = await updateSettings(validatedData);

        return apiSuccess(updatedSettings, 'Settings updated successfully');
    } catch (error: any) {
        console.error('Error updating settings:', error);

        // Don't expose error details to client
        return apiError('Internal server error', 500);
    }
}

// POST reset settings (admin only)
export async function POST(request: NextRequest) {
    try {
        // Use middleware to check authentication and admin role
        const authError = await requireAdmin(request);
        if (authError) return authError;

        const data = await request.json();

        if (data.action === 'reset') {
            const resetSettingsData = await resetSettings();
            return apiSuccess(resetSettingsData, 'Settings reset successfully');
        }

        return apiError('Invalid action', 400);
    } catch (error: any) {
        console.error('Error resetting settings:', error);
        // Don't expose error details to client
        return apiError('Internal server error', 500);
    }
}
