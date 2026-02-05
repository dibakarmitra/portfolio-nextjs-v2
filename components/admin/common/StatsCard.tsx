'use client';
import React, { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    iconBgColor?: string;
    iconColor?: string; // tailwind class
    trend?: string;
    trendColor?: string; // tailwind class
    action?: ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    iconBgColor = 'bg-zinc-50 dark:bg-zinc-800',
    iconColor = 'text-zinc-600 dark:text-zinc-400',
    trend,
    trendColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    action,
}) => {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-md ${iconBgColor} ${iconColor}`}>{icon}</div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendColor}`}>
                        {trend}
                    </span>
                )}
                {action}
            </div>
            <div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{value}</div>
                <div className="text-sm text-zinc-500">{title}</div>
            </div>
        </div>
    );
};
