import { useContextState } from '@/context/context';
import { useMemo } from 'react';

export const useAppSettings = () => {
    try {
        const { settings } = useContextState();

        const siteSettings = useMemo(
            () => ({
                name: settings.getSettingValue('site.name', 'Portfolio Next.js v2'),
                description: settings.getSettingValue('site.description', ''),
                url: settings.getSettingValue('site.url', ''),
                adminEmail: settings.getSettingValue('site.adminEmail', ''),
                language: settings.getSettingValue('site.language', 'en'),
                timezone: settings.getSettingValue('site.timezone', 'UTC'),
            }),
            [settings]
        );

        const appearanceSettings = useMemo(
            () => ({
                theme: settings.getSettingValue('theme.mode', 'system'),
            }),
            [settings]
        );

        const featureSettings = useMemo(
            () => ({
                notifications: settings.getSettingValue('features.notifications', true),
                analytics: settings.getSettingValue('features.analytics', false),
                maintenanceMode: settings.getSettingValue('features.maintenanceMode', false),
            }),
            [settings]
        );

        const uploadSettings = useMemo(
            () => ({
                maxSize: settings.getSettingValue('upload.maxSize', 10),
                allowedTypes: settings.getSettingValue('upload.allowedTypes', [
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                ]),
            }),
            [settings]
        );

        const seoSettings = useMemo(
            () => ({
                title: settings.getSettingValue('seo.title', siteSettings.name),
                description: settings.getSettingValue('seo.description', siteSettings.description),
                keywords: settings.getSettingValue('seo.keywords', ''),
            }),
            [settings, siteSettings]
        );

        const getSetting = (key: string, defaultValue?: any) => {
            return settings.getSettingValue(key, defaultValue);
        };

        const isMaintenanceMode = featureSettings.maintenanceMode;

        return {
            settings: settings.settingsObject,
            isLoading: settings.isSettingsLoading,
            getSetting,

            site: siteSettings,
            appearance: appearanceSettings,
            features: featureSettings,
            upload: uploadSettings,
            seo: seoSettings,

            isMaintenanceMode,
            theme: appearanceSettings.theme,
            siteName: siteSettings.name,

            updateSettings: settings.updateSettings,
            refreshSettings: settings.refreshSettings,
        };
    } catch (error) {
        console.warn('useAppSettings: Context not available, using fallback values');

        return {
            settings: {},
            isLoading: false,
            getSetting: (key: string, defaultValue?: any) => defaultValue,

            site: {
                name: 'Portfolio Next.js v2',
                description: '',
                url: '',
                adminEmail: '',
                language: 'en',
                timezone: 'UTC',
            },
            appearance: {
                theme: 'system',
            },
            features: {
                notifications: true,
                analytics: false,
                maintenanceMode: false,
            },
            upload: {
                maxSize: 10,
                allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
            },
            seo: {
                title: 'Portfolio Next.js v2',
                description: '',
                keywords: '',
            },

            isMaintenanceMode: false,
            theme: 'system',
            siteName: 'Portfolio Next.js v2',

            updateSettings: async () => {},
            refreshSettings: async () => {},
        };
    }
};
