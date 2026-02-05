'use client';

import React from 'react';
import { ContextProvider } from '@/context';
import { MaintenanceMode } from '@/components/admin/common/MaintenanceMode';
import { ThemeProvider } from '@/components/admin/providers/ThemeProvider';
import { ServerSettingsProvider } from '@/components/admin/providers/ServerSettingsProvider';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

interface ClientProvidersProps {
    children: React.ReactNode;
    initialSettings?: Record<string, any>;
}

export function ClientProviders({ children, initialSettings }: ClientProvidersProps) {
    const pathname = usePathname();

    // Only use session and admin context on admin or auth pages
    const isFullContextNeeded = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    const content = (
        <ServerSettingsProvider initialSettings={initialSettings}>
            <ThemeProvider>
                <MaintenanceMode>{children}</MaintenanceMode>
                <Analytics />
                <SpeedInsights />
            </ThemeProvider>
        </ServerSettingsProvider>
    );

    if (!isFullContextNeeded) {
        return content;
    }

    return (
        <SessionProvider>
            <ContextProvider>{content}</ContextProvider>
        </SessionProvider>
    );
}
