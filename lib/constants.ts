import APP_CONFIG from '@/config/app';

export const ITEMS_PER_PAGE = APP_CONFIG.pagination.itemsPerPage;
export const MAX_FILE_SIZE = APP_CONFIG.storage.maxFileSize;
export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
];

export const API_ENDPOINTS = {
    UPLOAD: '/api/upload',
    AI: '/api/ai',
    MEDIA: '/api/media',
    NOTES: '/api/notes',
    SETTINGS: '/api/settings',
    PROFILE: '/api/profile',
    RESUME: '/api/resume',
    CATEGORIES: '/api/categories',
    TAGS: '/api/tags',
};

export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;

export const TOAST_DURATION_CONFIG = APP_CONFIG.ui.toastDuration; // milliseconds
export const DEBOUNCE_DELAY_CONFIG = APP_CONFIG.ui.debounceDelay; // milliseconds
