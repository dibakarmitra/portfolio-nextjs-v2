'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onNext,
    onPrev,
    className = '',
}) => {
    if (totalPages <= 1) return null;

    return (
        <div
            className={`flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800 ${className}`}
        >
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
                <button
                    onClick={onPrev}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
