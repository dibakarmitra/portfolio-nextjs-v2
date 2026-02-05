'use server';

import { db } from '@/config/database';
import {
    Setting,
    SettingValue,
    CreateSettingData,
    UpdateSettingData,
} from '@/types/domain/settings';

interface ServerSettings {
    settings: Record<string, any>;
    lastUpdated: string;
}

let cachedSettings: ServerSettings | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface DBSetting {
    id: number;
    key: string;
    value: string | null;
    type: string;
    category: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

function settingToDBSetting(setting: Partial<Setting>): Partial<DBSetting> {
    return {
        key: setting.key,
        value: setting.value !== null ? JSON.stringify(setting.value) : null,
        type: setting.type,
        category: setting.category,
        description: setting.description || null,
    };
}

function dbSettingToSetting(dbSetting: DBSetting): Setting {
    let parsedValue: any = null;

    if (dbSetting.value !== null) {
        try {
            parsedValue = JSON.parse(dbSetting.value);
        } catch {
            parsedValue = dbSetting.value;
        }
    }

    return {
        id: dbSetting.id,
        key: dbSetting.key,
        value: parsedValue,
        type: dbSetting.type as 'string' | 'number' | 'boolean' | 'json',
        category: dbSetting.category,
        description: dbSetting.description,
        createdAt: new Date(dbSetting.created_at).toISOString(),
        updatedAt: new Date(dbSetting.updated_at).toISOString(),
    };
}

// default settings
const DEFAULT_SETTINGS: Record<string, SettingValue> = {
    // general settings
    'site.name': {
        key: 'site.name',
        value: 'Portfolio Next.js v2',
        type: 'string',
        category: 'general',
        description: 'Site name',
    },
    'site.description': {
        key: 'site.description',
        value: 'Professional portfolio and content management system',
        type: 'string',
        category: 'general',
        description: 'Site description',
    },
    'site.url': {
        key: 'site.url',
        value: 'https://yourdomain.com',
        type: 'string',
        category: 'general',
        description: 'Site URL',
    },
    'site.adminEmail': {
        key: 'site.adminEmail',
        value: 'admin@example.com',
        type: 'string',
        category: 'general',
        description: 'Admin email address',
    },
    'site.language': {
        key: 'site.language',
        value: 'en',
        type: 'string',
        category: 'general',
        description: 'Default language',
    },
    'site.timezone': {
        key: 'site.timezone',
        value: 'UTC',
        type: 'string',
        category: 'general',
        description: 'Default timezone',
    },

    // appearance settings
    'theme.mode': {
        key: 'theme.mode',
        value: 'system',
        type: 'string',
        category: 'appearance',
        description: 'Theme mode',
    },

    // feature settings
    'features.notifications': {
        key: 'features.notifications',
        value: true,
        type: 'boolean',
        category: 'features',
        description: 'Enable email notifications',
    },
    'features.analytics': {
        key: 'features.analytics',
        value: false,
        type: 'boolean',
        category: 'features',
        description: 'Enable analytics tracking',
    },
    'features.maintenanceMode': {
        key: 'features.maintenanceMode',
        value: false,
        type: 'boolean',
        category: 'features',
        description: 'Maintenance mode',
    },

    // upload settings
    'upload.maxSize': {
        key: 'upload.maxSize',
        value: 10,
        type: 'number',
        category: 'upload',
        description: 'Max upload size in MB',
    },
    'upload.allowedTypes': {
        key: 'upload.allowedTypes',
        value: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
        type: 'json',
        category: 'upload',
        description: 'Allowed file types',
    },

    // seo settings
    'seo.title': {
        key: 'seo.title',
        value: 'Portfolio Next.js v2',
        type: 'string',
        category: 'seo',
        description: 'SEO meta title',
    },
    'seo.description': {
        key: 'seo.description',
        value: 'Professional portfolio and content management system',
        type: 'string',
        category: 'seo',
        description: 'SEO meta description',
    },
    'seo.keywords': {
        key: 'seo.keywords',
        value: 'portfolio, admin, content, management',
        type: 'string',
        category: 'seo',
        description: 'SEO keywords',
    },
};

export async function getAllSettings(): Promise<Setting[]> {
    const dbSettings = await db('settings').orderBy('category', 'asc').orderBy('key', 'asc');

    if (dbSettings.length === 0) {
        await createDefaultSettings();
        return await getAllSettings();
    }

    return dbSettings.map(dbSettingToSetting);
}

export async function getSettingsByCategory(category: string): Promise<Setting[]> {
    const dbSettings = await db('settings').where('category', category).orderBy('key', 'asc');
    return dbSettings.map(dbSettingToSetting);
}

export async function getSettingByKey(key: string): Promise<Setting | null> {
    const dbSetting = await db('settings').where('key', key).first();
    return dbSetting ? dbSettingToSetting(dbSetting) : null;
}

export async function upsertSetting(
    key: string,
    data: CreateSettingData | UpdateSettingData
): Promise<Setting> {
    const existingSetting = await getSettingByKey(key);

    if (existingSetting) {
        let updateData: UpdateSettingData;
        if ('value' in data) {
            updateData = data as UpdateSettingData;
        } else {
            const createData = data as CreateSettingData;
            updateData = {
                value: createData.value,
                type: createData.type,
                description: createData.description,
            };
        }

        const dbUpdateData = {
            value: updateData.value !== null ? JSON.stringify(updateData.value) : null,
            type: updateData.type || existingSetting.type,
            description: updateData.description || existingSetting.description,
            updated_at: new Date(),
        };

        await db('settings').where('key', key).update(dbUpdateData);
    } else {
        const settingData: Partial<Setting> =
            'value' in data ? (data as UpdateSettingData) : (data as CreateSettingData);
        const dbSettingData = {
            key,
            ...settingToDBSetting(settingData),
            created_at: new Date(),
            updated_at: new Date(),
        };

        await db('settings').insert(dbSettingData);
    }

    const updatedSetting = await getSettingByKey(key);
    return updatedSetting!;
}

export async function createDefaultSettings(): Promise<Setting[]> {
    const createdSettings: Setting[] = [];

    for (const [key, settingValue] of Object.entries(DEFAULT_SETTINGS)) {
        const setting = await upsertSetting(key, settingValue);
        createdSettings.push(setting);
    }

    return createdSettings;
}

export async function updateSettings(settingsData: Record<string, any>): Promise<Setting[]> {
    const updatedSettings: Setting[] = [];

    for (const [key, value] of Object.entries(settingsData)) {
        const setting = await upsertSetting(key, { value });
        updatedSettings.push(setting);
    }

    return updatedSettings;
}

export async function resetSettings(): Promise<Setting[]> {
    await db('settings').del();
    return await createDefaultSettings();
}

export async function deleteSetting(key: string): Promise<void> {
    await db('settings').where({ key }).del();
}

// caching server settings
export async function getServerSettings(): Promise<ServerSettings> {
    const now = Date.now();

    if (cachedSettings && now < cacheExpiry) {
        return cachedSettings;
    }

    try {
        const settings = await getAllSettings();

        const settingsObject: Record<string, any> = {};
        settings.forEach((setting) => {
            settingsObject[setting.key] = setting.value;
        });

        cachedSettings = {
            settings: settingsObject,
            lastUpdated: new Date().toISOString(),
        };
        cacheExpiry = now + CACHE_DURATION;

        return cachedSettings;
    } catch (error) {
        console.error('Error fetching server settings:', error);

        return getDefaultServerSettings();
    }
}

export async function getDefaultServerSettings(): Promise<ServerSettings> {
    return {
        settings: {
            'site.name': 'Portfolio Next.js v2',
            'site.description': 'Professional portfolio and content management system',
            'site.url': 'https://yourdomain.com',
            'site.adminEmail': 'admin@example.com',
            'site.language': 'en',
            'site.timezone': 'UTC',
            'theme.mode': 'system',
            'features.notifications': true,
            'features.analytics': false,
            'features.maintenanceMode': false,
            'upload.maxSize': 10,
            'upload.allowedTypes': ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
            'seo.title': 'Portfolio Next.js v2',
            'seo.description': 'Professional portfolio and content management system',
            'seo.keywords': 'portfolio, admin, content, management',
        },
        lastUpdated: new Date().toISOString(),
    };
}
