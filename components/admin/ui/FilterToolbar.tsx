'use client';
import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Filter } from 'lucide-react';

interface FilterToolbarProps<T extends string, S extends string> {
    searchValue: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;

    filterValue: T;
    onFilterChange: (val: T) => void;
    filterOptions: { label: string; value: T }[];

    sortValue?: S;
    onSortChange?: (val: S) => void;
    sortOptions?: { label: string; value: S }[];
}

export const FilterToolbar = <T extends string, S extends string>({
    searchValue,
    onSearchChange,
    searchPlaceholder,
    filterValue,
    onFilterChange,
    filterOptions,
    sortValue,
    onSortChange,
    sortOptions,
}: FilterToolbarProps<T, S>) => {
    const [isSortOpen, setIsSortOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row gap-3 relative z-10 md:items-center mb-6">
            <div className="relative flex-1">
                <SearchBar
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder={searchPlaceholder}
                />
            </div>

            <div className="flex bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 shrink-0 overflow-x-auto max-w-full no-scrollbar">
                {filterOptions.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onFilterChange(opt.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all whitespace-nowrap ${filterValue === opt.value ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-transparent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 border border-transparent'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {sortOptions && onSortChange && (
                <div className="relative shrink-0">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`p-3 rounded-lg border transition-colors h-full flex items-center justify-center ${
                            isSortOpen
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                        title="Sort Options"
                    >
                        <Filter size={18} />
                    </button>
                    {isSortOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsSortOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1.5">
                                    <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                        Sort By
                                    </div>
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onSortChange(opt.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortValue === opt.value ? 'bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
