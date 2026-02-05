'use client';

import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    className = '',
    children,
    ...props
}) => {
    const baseStyles =
        'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30',
        ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50',
        danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-100 border border-red-500/30',
        success:
            'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-100 border border-emerald-500/30',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
