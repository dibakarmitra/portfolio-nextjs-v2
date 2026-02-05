'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
    icon: LucideIcon;
    size?: number;
    className?: string;
    color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'indigo' | 'yellow' | 'zinc';
}

export const IconBadge: React.FC<IconBadgeProps> = ({
    icon: Icon,
    size = 20,
    className = '',
    color = 'blue',
}) => {
    const colorStyles = {
        blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-zinc-700',
        emerald:
            'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-zinc-700',
        amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-zinc-700',
        purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-zinc-700',
        indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-zinc-700',
        yellow: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-100 dark:border-zinc-700',
        zinc: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    };

    return (
        <div className={`p-3 rounded-xl border shrink-0 ${colorStyles[color]} ${className}`}>
            <Icon size={size} />
        </div>
    );
};
