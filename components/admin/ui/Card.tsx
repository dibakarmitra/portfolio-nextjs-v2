'use client';
import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hoverEffect = true,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 relative
        ${hoverEffect ? 'group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
