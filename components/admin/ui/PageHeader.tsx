'use client';
import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {title}
            </h2>
            {description && (
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{description}</p>
            )}
        </div>
        {action}
    </div>
);
