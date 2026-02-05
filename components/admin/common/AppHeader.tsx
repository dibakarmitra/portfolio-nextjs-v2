import React from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Settings, Bell, User } from 'lucide-react';

export function AppHeader() {
    const { site, features, isLoading } = useAppSettings();

    if (isLoading) {
        return (
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="px-6 py-4">
                    <div className="animate-pulse h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-48"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                            {site.name}
                        </h1>
                        {features.maintenanceMode && (
                            <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 rounded-full">
                                Maintenance Mode
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {features.notifications && (
                            <button className="relative p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        )}
                        <button className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                            <User className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
