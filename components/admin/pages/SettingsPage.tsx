import React, { useState, useCallback, useMemo } from 'react';
import {
    Save,
    Settings,
    Globe,
    Lock,
    Database,
    Mail,
    Bell,
    Shield,
    Monitor,
    Moon,
    Sun,
    Zap,
    Search,
} from 'lucide-react';
import { FormField } from '@/components/admin/ui/FormField';
import { Setting } from '@/types/domain/settings';

interface SettingsPageProps {
    settings: Setting[];
    onSave: (settings: Record<string, any>) => void;
    onDiscard: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = React.memo(
    ({ settings, onSave, onDiscard }) => {
        // convert settings array to a usable object
        const settingsObject = useMemo(() => {
            const obj: Record<string, any> = {};
            settings.forEach((setting) => {
                obj[setting.key] = setting.value;
            });
            return obj;
        }, [settings]);

        const [formData, setFormData] = useState<Record<string, any>>({
            'site.name': settingsObject['site.name'] || '',
            'site.description': settingsObject['site.description'] || '',
            'site.url': settingsObject['site.url'] || '',
            'site.adminEmail': settingsObject['site.adminEmail'] || '',
            'features.notifications': settingsObject['features.notifications'] || false,
            'features.analytics': settingsObject['features.analytics'] || false,
            'features.maintenanceMode': settingsObject['features.maintenanceMode'] || false,
            'upload.maxSize': settingsObject['upload.maxSize'] || 10,
            'upload.allowedTypes': settingsObject['upload.allowedTypes'] || [],
            'theme.mode': settingsObject['theme.mode'] || 'system',
            'site.language': settingsObject['site.language'] || 'en',
            'site.timezone': settingsObject['site.timezone'] || 'UTC',
            'seo.title': settingsObject['seo.title'] || '',
            'seo.description': settingsObject['seo.description'] || '',
            'seo.keywords': settingsObject['seo.keywords'] || '',
        });

        const handleChange = useCallback((field: string, value: any) => {
            setFormData((prev: any) => ({ ...prev, [field]: value }));
        }, []);

        const handleArrayChange = useCallback((field: string, value: string) => {
            const array = value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
            setFormData((prev: any) => ({ ...prev, [field]: array }));
        }, []);

        // memoize form sections to prevent unnecessary re-renders
        const GeneralSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                            <Globe className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            General Settings
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <FormField
                                label="Site Name"
                                value={formData['site.name']}
                                onChange={(e) => handleChange('site.name', e.target.value)}
                                placeholder="Your site name"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Site URL"
                                value={formData['site.url']}
                                onChange={(e) => handleChange('site.url', e.target.value)}
                                placeholder="https://yourdomain.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <FormField
                                label="Site Description"
                                value={formData['site.description']}
                                onChange={(e) => handleChange('site.description', e.target.value)}
                                placeholder="Brief description of your site"
                                component="textarea"
                                rows={3}
                            />
                        </div>
                        <div>
                            <FormField
                                label="Admin Email"
                                type="email"
                                value={formData['site.adminEmail']}
                                onChange={(e) => handleChange('site.adminEmail', e.target.value)}
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Language"
                                value={formData['site.language']}
                                onChange={(e) => handleChange('site.language', e.target.value)}
                                component="select"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="zh">Chinese</option>
                            </FormField>
                        </div>
                        <div>
                            <FormField
                                label="Timezone"
                                value={formData['site.timezone']}
                                onChange={(e) => handleChange('site.timezone', e.target.value)}
                                component="select"
                            >
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                            </FormField>
                        </div>
                    </div>
                </div>
            ),
            [formData, handleChange]
        );

        const AppearanceSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                            <Monitor className="text-purple-600 dark:text-purple-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Appearance
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                Theme
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => handleChange('theme.mode', 'light')}
                                    className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                                        formData['theme.mode'] === 'light'
                                            ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                                    }`}
                                >
                                    <Sun size={16} className="mr-2" />
                                    Light
                                </button>
                                <button
                                    onClick={() => handleChange('theme.mode', 'dark')}
                                    className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                                        formData['theme.mode'] === 'dark'
                                            ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                                    }`}
                                >
                                    <Moon size={16} className="mr-2" />
                                    Dark
                                </button>
                                <button
                                    onClick={() => handleChange('theme.mode', 'system')}
                                    className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                                        formData['theme.mode'] === 'system'
                                            ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                                    }`}
                                >
                                    <Monitor size={16} className="mr-2" />
                                    System
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            [formData, handleChange]
        );

        const FeaturesSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
                            <Zap className="text-green-600 dark:text-green-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Features & Integrations
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Bell className="text-zinc-500 dark:text-zinc-400 w-5 h-5" />
                                <div>
                                    <div className="font-medium text-zinc-900 dark:text-white">
                                        Email Notifications
                                    </div>
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Receive email alerts for important events
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    handleChange(
                                        'features.notifications',
                                        !formData['features.notifications']
                                    )
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData['features.notifications']
                                        ? 'bg-blue-600'
                                        : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData['features.notifications']
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="text-zinc-500 dark:text-zinc-400 w-5 h-5" />
                                <div>
                                    <div className="font-medium text-zinc-900 dark:text-white">
                                        Analytics
                                    </div>
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Track site usage and performance
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    handleChange(
                                        'features.analytics',
                                        !formData['features.analytics']
                                    )
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData['features.analytics']
                                        ? 'bg-blue-600'
                                        : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData['features.analytics']
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Lock className="text-zinc-500 dark:text-zinc-400 w-5 h-5" />
                                <div>
                                    <div className="font-medium text-zinc-900 dark:text-white">
                                        Maintenance Mode
                                    </div>
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Temporarily disable public access
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    handleChange(
                                        'features.maintenanceMode',
                                        !formData['features.maintenanceMode']
                                    )
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData['features.maintenanceMode']
                                        ? 'bg-red-600'
                                        : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData['features.maintenanceMode']
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            ),
            [formData, handleChange]
        );

        const UploadSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                            <Database className="text-orange-600 dark:text-orange-400 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Upload Settings
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <FormField
                                label="Max Upload Size (MB)"
                                type="number"
                                value={formData['upload.maxSize']}
                                onChange={(e) =>
                                    handleChange('upload.maxSize', parseInt(e.target.value) || 10)
                                }
                                min="1"
                                max="100"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Allowed File Types"
                                value={formData['upload.allowedTypes']?.join(', ') || ''}
                                onChange={(e) =>
                                    handleArrayChange('upload.allowedTypes', e.target.value)
                                }
                                placeholder="jpg, png, pdf, doc"
                            />
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                Comma-separated list of file extensions
                            </p>
                        </div>
                    </div>
                </div>
            ),
            [formData, handleChange, handleArrayChange]
        );

        const SEOSection = useMemo(
            () => (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                            <Search
                                size={14}
                                className="text-indigo-600 dark:text-indigo-400 w-5 h-5"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            SEO Settings
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <FormField
                                label="Meta Title"
                                value={formData['seo.title']}
                                onChange={(e) => handleChange('seo.title', e.target.value)}
                                placeholder="Site meta title for search engines"
                            />
                        </div>
                        <div>
                            <FormField
                                label="Meta Description"
                                value={formData['seo.description']}
                                onChange={(e) => handleChange('seo.description', e.target.value)}
                                placeholder="Search engine description"
                                component="textarea"
                                rows={3}
                            />
                        </div>
                        <div>
                            <FormField
                                label="Keywords"
                                value={formData['seo.keywords']}
                                onChange={(e) => handleChange('seo.keywords', e.target.value)}
                                placeholder="Comma-separated keywords"
                            />
                        </div>
                    </div>
                </div>
            ),
            [formData, handleChange]
        );

        const ActionButtons = useMemo(
            () => (
                <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={onDiscard}
                        className="px-6 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={() => {
                            onSave(formData);
                        }}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            ),
            [formData, onSave, onDiscard]
        );

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        System Settings
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Configure system-wide settings, appearance, and features.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {GeneralSection}
                    {AppearanceSection}
                    {FeaturesSection}
                    {UploadSection}
                    {SEOSection}
                </div>

                {ActionButtons}
            </div>
        );
    }
);
