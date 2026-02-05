'use client';
import React from 'react';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Note } from '@/types';

interface ActionButtonsProps {
    onEdit?: () => void;
    onView?: () => void;
    onDelete?: () => void;
    onStatusChange?: () => void;
    status?: Note['status'];
    className?: string;
    size?: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onEdit,
    onView,
    onDelete,
    onStatusChange,
    status,
    className = '',
    size = 14,
}) => {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {onStatusChange && status && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange();
                    }}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                    title={status === 'published' ? 'Unpublish' : 'Publish'}
                >
                    {status === 'published' ? <EyeOff size={size} /> : <Eye size={size} />}
                </button>
            )}
            {onEdit && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                    title="Edit"
                >
                    <Edit2 size={size} />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete"
                >
                    <Trash2 size={size} />
                </button>
            )}
        </div>
    );
};
