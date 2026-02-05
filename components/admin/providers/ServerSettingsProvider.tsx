'use client';

import React, { useEffect } from 'react';
import { useSettings } from '@/context/settings';

interface ServerSettingsProviderProps {
    children: React.ReactNode;
    initialSettings?: Record<string, any>;
}

export function ServerSettingsProvider({ children, initialSettings }: ServerSettingsProviderProps) {
    const { setSettings, isServerSettingsLoaded } = useSettings();

    useEffect(() => {
        // If we have initial settings from server-side and server settings haven't been loaded yet
        if (initialSettings && !isServerSettingsLoaded) {
            console.log(
                'Injecting server-side settings:',
                Object.keys(initialSettings).length,
                'settings'
            );

            // Convert server settings to Setting objects
            const serverSettingsAsArray = Object.entries(initialSettings).map(([key, value]) => {
                let type: 'string' | 'number' | 'boolean' | 'json' = 'string';
                let stringValue: string | null = null;

                if (typeof value === 'boolean') {
                    type = 'boolean';
                    stringValue = value.toString();
                } else if (typeof value === 'number') {
                    type = 'number';
                    stringValue = value.toString();
                } else if (Array.isArray(value)) {
                    type = 'json';
                    stringValue = JSON.stringify(value);
                } else if (value !== null && value !== undefined) {
                    type = 'string';
                    stringValue = String(value);
                } else {
                    type = 'string';
                    stringValue = null;
                }

                return {
                    id: Math.abs(
                        key.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
                    ),
                    key,
                    value: stringValue,
                    type,
                    category: key.split('.')[0],
                    description: `Server setting: ${key}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
            });

            setSettings(serverSettingsAsArray);
        }
    }, [initialSettings, isServerSettingsLoaded, setSettings]);

    return <>{children}</>;
}
