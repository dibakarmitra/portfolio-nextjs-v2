import { env } from './env';

const appConfig = {
    name: env.APP_NAME,
    title: `${env.OWNER_NAME} - ${env.OWNER_ROLE}`,
    description: env.OWNER_BIO,
    url: env.APP_URL,
    keywords: 'Developer, Portfolio, Software Engineer, Professional',
    social: {
        github: 'johndoe',
        linkedin: 'johndoe',
        email: env.OWNER_EMAIL,
    },

    adminName: 'Portfolio Next.js v2',
    adminDescription: 'Portfolio Next.js v2 for managing portfolio content',
    version: '0.0.1',

    features: {
        aiIntegration: true,
        darkMode: true,
        analytics: true,
        socialSharing: true,
        maintenanceMode: false,
    },

    pagination: {
        defaultPageSize: 10,
        itemsPerPage: 6,
    },

    limits: {
        maxTitleLength: 200,
        maxDescriptionLength: 500,
        maxContentLength: 50000,
        maxTagsPerItem: 10,
    },

    storage: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        allowedDocTypes: ['application/pdf', 'application/msword'],
    },

    timeouts: {
        apiRequest: 30000,
        debounce: 300,
        session: 24 * 60 * 60 * 1000, // 24 hours
    },

    ui: {
        toastDuration: 4000,
        debounceDelay: 300,
    },

    sorting: {
        defaultField: 'date',
        defaultOrder: 'desc' as const,
    },
};

export const APP_CONFIG = appConfig;
export default appConfig;
