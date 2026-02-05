import React from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Lock, AlertCircle } from 'lucide-react';

interface MaintenanceModeProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function MaintenanceMode({ children, fallback }: MaintenanceModeProps) {
    const { features, isLoading } = useAppSettings();

    // Show loading state while settings are loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
            </div>
        );
    }

    // If maintenance mode is enabled, show maintenance page
    if (features.maintenanceMode) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4">
                <div className="text-center max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                            <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                        Under Maintenance
                    </h1>

                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        We're currently performing maintenance on the system. Please check back
                        soon.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle size={16} />
                        <span>Admin access is still available</span>
                    </div>
                </div>
            </div>
        );
    }

    // Normal operation - show children
    return <>{children}</>;
}
