import { useState, useMemo, useCallback, useEffect } from 'react';
import { Setting, UpdateSettingData } from '@/types/domain/settings';

export interface SettingsState {
    settings: Setting[];
    setSettings: React.Dispatch<React.SetStateAction<Setting[]>>;
    isSettingsLoading: boolean;
    isSettingsLoaded: boolean;
    isServerSettingsLoaded: boolean;
    refreshSettings: () => Promise<void>;
    updateSettings: (data: Record<string, any>) => Promise<void>;
    resetSettings: () => Promise<void>;

    // helper getters for easy access to setting values
    getSettingValue: (key: string, defaultValue?: any) => any;
    getSettingsByCategory: (category: string) => Record<string, any>;
    getAllSettingsAsObject: () => Record<string, any>;
    settingsObject: Record<string, any>; // memoized object for reactive updates
}

export const useSettings = (): SettingsState => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [isSettingsLoading, setIsSettingsLoading] = useState(false);
    const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
    const [isServerSettingsLoaded, setIsServerSettingsLoaded] = useState(false);

    const refreshSettings = useCallback(async () => {
        try {
            setIsSettingsLoading(true);
            const response = await fetch('/api/settings');

            if (response.ok) {
                const settingsData = await response.json();
                if (settingsData.success) {
                    setSettings(settingsData.data);
                    setIsSettingsLoaded(true);
                } else {
                    console.error(
                        'Failed to fetch settings:',
                        settingsData.error?.message || 'Unknown error'
                    );
                }
            } else {
                console.error('Failed to fetch settings: HTTP', response.status);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsSettingsLoading(false);
        }
    }, []);

    const updateSettingsData = useCallback(async (data: Record<string, any>) => {
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setSettings(result.data);
                    return result.data;
                } else {
                    throw new Error(result.error?.message || 'Failed to update settings');
                }
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }, []);

    const resetSettingsData = useCallback(async () => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'reset' }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setSettings(result.data);
                    return result.data;
                } else {
                    throw new Error(result.error?.message || 'Failed to reset settings');
                }
            } else {
                throw new Error('Failed to reset settings');
            }
        } catch (error) {
            console.error('Error resetting settings:', error);
            throw error;
        }
    }, []);

    // helper functions for easy access to setting values
    const getSettingValue = useCallback(
        (key: string, defaultValue: any = null) => {
            const setting = settings.find((s) => s.key === key);
            if (setting) {
                if (setting.type === 'boolean') {
                    return setting.value === 'true';
                } else if (setting.type === 'number') {
                    return setting.value ? parseFloat(setting.value) : 0;
                } else if (setting.type === 'json') {
                    try {
                        return setting.value ? JSON.parse(setting.value) : null;
                    } catch {
                        return defaultValue;
                    }
                } else {
                    return setting.value;
                }
            }

            return defaultValue;
        },
        [settings]
    );

    const getSettingsByCategory = useCallback(
        (category: string) => {
            const categorySettings = settings.filter((s) => s.category === category);
            const result: Record<string, any> = {};
            categorySettings.forEach((setting) => {
                result[setting.key] = getSettingValue(setting.key);
            });

            return result;
        },
        [settings, getSettingValue]
    );

    const getAllSettingsAsObject = useCallback(() => {
        const result: Record<string, any> = {};
        settings.forEach((setting) => {
            result[setting.key] = getSettingValue(setting.key);
        });

        return result;
    }, [settings, getSettingValue]);

    // memoized settings object for reactive updates
    const settingsObject = useMemo(
        () => getAllSettingsAsObject(),
        [settings, getAllSettingsAsObject]
    );

    const contextValue = useMemo(
        () => ({
            settings,
            setSettings,
            isSettingsLoading,
            isSettingsLoaded,
            isServerSettingsLoaded: isServerSettingsLoaded || isSettingsLoaded,
            refreshSettings,
            updateSettings: updateSettingsData,
            resetSettings: resetSettingsData,
            getSettingValue,
            getSettingsByCategory,
            getAllSettingsAsObject,
            settingsObject,
        }),
        [
            settings,
            setSettings,
            isSettingsLoading,
            refreshSettings,
            updateSettingsData,
            resetSettingsData,
            getSettingValue,
            getSettingsByCategory,
            getAllSettingsAsObject,
            settingsObject,
        ]
    );

    return contextValue;
};
