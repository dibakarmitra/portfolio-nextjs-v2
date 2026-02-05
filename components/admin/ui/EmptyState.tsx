'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => (
    <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
        <Icon className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
        <p>{message}</p>
    </div>
);
