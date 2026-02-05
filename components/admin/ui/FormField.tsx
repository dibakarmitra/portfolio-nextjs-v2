'use client';
import React, { InputHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
    label: string;
    icon?: LucideIcon;
    type?: string;
    component?: 'input' | 'textarea' | 'select';
    children?: ReactNode;
    rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    icon: Icon,
    type = 'text',
    component = 'input',
    className = '',
    children,
    ...props
}) => {
    return (
        <div className={className}>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                {label}
            </label>
            <div className="relative group">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                )}

                {component === 'textarea' ? (
                    <textarea
                        {...(props as any)}
                        className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors resize-none ${Icon ? 'pl-9' : ''}`}
                    />
                ) : component === 'select' ? (
                    <select
                        {...(props as any)}
                        className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 appearance-none transition-colors ${Icon ? 'pl-9' : ''}`}
                    >
                        {children}
                    </select>
                ) : (
                    <input
                        type={type}
                        {...(props as any)}
                        className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors ${Icon ? 'pl-10' : ''}`}
                    />
                )}
            </div>
        </div>
    );
};
