import React from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Settings, Globe, Palette, Shield, Upload, Search } from 'lucide-react';

export function SettingsDisplay() {
    const { site, appearance, features, upload, seo, isLoading } = useAppSettings();

    if (isLoading) {
        return (
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="animate-pulse">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-32 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-zinc-500" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Current Settings (Live)
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Site Settings */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Globe className="w-4 h-4" />
                        Site
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Name:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">{site.name}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Language:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">
                                {site.language}
                            </span>
                        </div>
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Timezone:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">
                                {site.timezone}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Palette className="w-4 h-4" />
                        Appearance
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Theme:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white capitalize">
                                {appearance.theme}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Feature Settings */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Shield className="w-4 h-4" />
                        Features
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Notifications:</span>
                            <span
                                className={`ml-2 ${features.notifications ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {features.notifications ? 'On' : 'Off'}
                            </span>
                        </div>
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Analytics:</span>
                            <span
                                className={`ml-2 ${features.analytics ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {features.analytics ? 'On' : 'Off'}
                            </span>
                        </div>
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Maintenance:</span>
                            <span
                                className={`ml-2 ${features.maintenanceMode ? 'text-red-600' : 'text-green-600'}`}
                            >
                                {features.maintenanceMode ? 'On' : 'Off'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Upload Settings */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Upload className="w-4 h-4" />
                        Upload
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Max Size:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">
                                {upload.maxSize}MB
                            </span>
                        </div>
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Types:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">
                                {upload.allowedTypes.slice(0, 3).join(', ')}
                                {upload.allowedTypes.length > 3 && '...'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        <Search className="w-4 h-4" />
                        SEO
                    </div>
                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Title:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">{seo.title}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 dark:text-zinc-400">Keywords:</span>
                            <span className="ml-2 text-zinc-900 dark:text-white">
                                {seo.keywords}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 This component updates automatically when settings change.
                    Try changing settings in the Settings page to see the immediate effect!
                </p>
            </div>
        </div>
    );
}
