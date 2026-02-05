/**
 * Loading State Components
 * Reusable loading indicators for various UI contexts
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <Loader2
            className={`animate-spin text-blue-600 dark:text-blue-400 ${sizeClasses[size]} ${className}`}
        />
    );
};

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
            </div>
        </div>
    );
};

interface PageLoadingProps {
    message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message = 'Loading content...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
        </div>
    );
};

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`} />;
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-24" />
                    <Skeleton className="h-12 w-32" />
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
};

interface ButtonLoadingProps {
    isLoading: boolean;
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

export const ButtonWithLoading: React.FC<ButtonLoadingProps> = ({
    isLoading,
    children,
    className = '',
    ...props
}) => {
    return (
        <button
            disabled={isLoading}
            className={`relative ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            {...props}
        >
            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                </span>
            )}
            <span className={isLoading ? 'invisible' : ''}>{children}</span>
        </button>
    );
};
