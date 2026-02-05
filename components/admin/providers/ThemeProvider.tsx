'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useAppSettings } from '@/hooks/useAppSettings';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState('system');
    const { appearance, isLoading } = useAppSettings();

    // Update theme when settings are loaded
    useEffect(() => {
        if (!isLoading && appearance.theme) {
            setTheme(appearance.theme);
            console.log('Theme updated from settings:', appearance.theme);
        }
    }, [appearance.theme, isLoading]);

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme={theme}
            enableSystem
            storageKey="theme"
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
