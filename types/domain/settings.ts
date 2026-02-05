export type SettingType = 'string' | 'number' | 'boolean' | 'json';

export interface Setting {
    id: number;
    key: string;
    value: string | null;
    type: SettingType;
    category: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SettingValue {
    key: string;
    value: any;
    type: SettingType;
    category: string;
    description?: string;
}

// Settings configuration - defines all possible settings
export interface SettingsConfig {
    // General Settings
    'site.name': string;
    'site.description': string;
    'site.url': string;
    'site.adminEmail': string;
    'site.language': string;
    'site.timezone': string;

    // Appearance Settings
    'theme.mode': 'light' | 'dark' | 'system';

    // Feature Settings
    'features.notifications': boolean;
    'features.analytics': boolean;
    'features.maintenanceMode': boolean;

    // Upload Settings
    'upload.maxSize': number;
    'upload.allowedTypes': string[];

    // SEO Settings
    'seo.title': string;
    'seo.description': string;
    'seo.keywords': string;
}

export interface CreateSettingData {
    key: string;
    value: any;
    type?: SettingType;
    category?: string;
    description?: string;
}

export interface UpdateSettingData {
    value: any;
    type?: SettingType;
    description?: string;
}
