'use client';

import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { SettingsPage as Settings } from '@/components/admin/pages/SettingsPage';
import { useContextState } from '@/context';

// Memoize skeleton component to prevent unnecessary recreations
const SettingsPageSkeleton = React.memo(() => (
    <div className="space-y-8">
        <div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl p-6">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-40 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="space-y-2">
                                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-24"></div>
                                <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
));

SettingsPageSkeleton.displayName = 'SettingsPageSkeleton';

function SettingsPageContent() {
    const { settings, updateSettings, addToast } = useContextState();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = useCallback(
        async (settingsData: any) => {
            setIsSaving(true);
            try {
                await updateSettings(settingsData);
                addToast('Settings saved successfully', 'success');
            } catch (error) {
                console.error('Error saving settings:', error);
                addToast('Error saving settings', 'error');
            } finally {
                setIsSaving(false);
            }
        },
        [updateSettings, addToast]
    );

    const handleDiscard = useCallback(() => {
        addToast('Changes discarded', 'info');
    }, [addToast]);

    // Memoize the Settings component to prevent unnecessary re-renders
    const MemoizedSettings = useMemo(
        () => (
            <Settings
                key={JSON.stringify(settings)}
                settings={settings}
                onSave={handleSave}
                onDiscard={handleDiscard}
            />
        ),
        [settings, handleSave, handleDiscard]
    );

    return MemoizedSettings;
}

// Memoize the entire page component
const SettingsPageRoute = React.memo(() => (
    <Suspense fallback={<SettingsPageSkeleton />}>
        <SettingsPageContent />
    </Suspense>
));

SettingsPageRoute.displayName = 'SettingsPageRoute';

export default SettingsPageRoute;
