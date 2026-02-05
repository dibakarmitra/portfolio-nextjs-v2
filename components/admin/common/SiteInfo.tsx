import React from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';

interface SiteInfoProps {
    showDescription?: boolean;
    showEmail?: boolean;
    className?: string;
}

export function SiteInfo({
    showDescription = true,
    showEmail = false,
    className = '',
}: SiteInfoProps) {
    const { site, isLoading } = useAppSettings();

    if (isLoading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-32 mb-2"></div>
                {showDescription && (
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-48"></div>
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{site.name}</h1>
            {showDescription && site.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{site.description}</p>
            )}
            {showEmail && site.adminEmail && (
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                    Contact: {site.adminEmail}
                </p>
            )}
        </div>
    );
}
