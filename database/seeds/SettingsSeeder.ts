import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    await knex('settings').del();

    const defaultSettings = [
        // general settings
        {
            key: 'site.name',
            value: '"Portfolio Next.js v2"',
            type: 'string',
            category: 'general',
            description: 'Site name',
        },
        {
            key: 'site.description',
            value: '"Professional portfolio and content management system"',
            type: 'string',
            category: 'general',
            description: 'Site description',
        },
        {
            key: 'site.url',
            value: '"https://yourdomain.com"',
            type: 'string',
            category: 'general',
            description: 'Site URL',
        },
        {
            key: 'site.adminEmail',
            value: '"admin@example.com"',
            type: 'string',
            category: 'general',
            description: 'Admin email address',
        },
        {
            key: 'site.language',
            value: '"en"',
            type: 'string',
            category: 'general',
            description: 'Default language',
        },
        {
            key: 'site.timezone',
            value: '"UTC"',
            type: 'string',
            category: 'general',
            description: 'Default timezone',
        },

        // appearance settings
        {
            key: 'theme.mode',
            value: '"system"',
            type: 'string',
            category: 'appearance',
            description: 'Theme mode',
        },

        // feature settings
        {
            key: 'features.notifications',
            value: 'true',
            type: 'boolean',
            category: 'features',
            description: 'Enable email notifications',
        },
        {
            key: 'features.analytics',
            value: 'false',
            type: 'boolean',
            category: 'features',
            description: 'Enable analytics tracking',
        },
        {
            key: 'features.maintenanceMode',
            value: 'false',
            type: 'boolean',
            category: 'features',
            description: 'Maintenance mode',
        },

        // upload settings
        {
            key: 'upload.maxSize',
            value: '10',
            type: 'number',
            category: 'upload',
            description: 'Max upload size in MB',
        },
        {
            key: 'upload.allowedTypes',
            value: '["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"]',
            type: 'json',
            category: 'upload',
            description: 'Allowed file types',
        },

        // seo settings
        {
            key: 'seo.title',
            value: '"Portfolio Next.js v2"',
            type: 'string',
            category: 'seo',
            description: 'SEO meta title',
        },
        {
            key: 'seo.description',
            value: '"Professional portfolio and content management system"',
            type: 'string',
            category: 'seo',
            description: 'SEO meta description',
        },
        {
            key: 'seo.keywords',
            value: '"portfolio, admin, content, management"',
            type: 'string',
            category: 'seo',
            description: 'SEO keywords',
        },
    ];

    const now = new Date();
    const settingsWithTimestamps = defaultSettings.map((setting) => ({
        ...setting,
        created_at: now,
        updated_at: now,
    }));

    await knex('settings').insert(settingsWithTimestamps);
}
