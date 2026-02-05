'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Search, Filter } from 'lucide-react';
import FadeIn from '../ui/FadeIn';
import { useNotes } from '@/hooks/useNotes';
import { DebounceInput } from '../ui/DebounceInput';
import { Category } from '@/types';

const AllNotes: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [categories, setCategories] = React.useState<Category[]>([]);

    // fetch categories on mount
    React.useEffect(() => {
        fetch('/api/published-categories')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCategories(data.data);
            })
            .catch((err) => console.error('Failed to fetch categories', err));
    }, []);

    const { notes, pagination, isLoading } = useNotes(page, 5, { search, category });

    const handlePrev = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    const handleNext = () => {
        if (page < pagination.totalPages) setPage((p) => p + 1);
    };

    // reset page when filters change
    React.useEffect(() => {
        setPage(1);
    }, [search, category]);

    return (
        <div className="pt-12 pb-12 min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Notes</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2 mb-8">
                        Thoughts, tutorials, and insights on software development and technology.
                    </p>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                size={18}
                            />
                            <DebounceInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search notes..."
                                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div className="relative min-w-[200px]">
                            <Filter
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                size={18}
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-10 pr-8 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm text-zinc-600 dark:text-zinc-300"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {notes.map((note, index) => (
                                <FadeIn key={note.id || index} delay={index * 50}>
                                    <Link
                                        href={`/notes/${note.slug}`}
                                        className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                                    {note.title}
                                                </h3>
                                                <span className="text-xs text-zinc-500 font-mono">
                                                    {note.date
                                                        ? new Date(note.date).toLocaleDateString()
                                                        : ''}
                                                </span>
                                            </div>
                                            <ArrowRight
                                                size={18}
                                                className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0 -rotate-45 group-hover:rotate-0"
                                            />
                                        </div>

                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                                            {note.excerpt}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {note.tags?.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] text-zinc-600 dark:text-zinc-300 font-mono"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={handlePrev}
                                disabled={page === 1}
                                className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                                    page === 1
                                        ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer'
                                }`}
                            >
                                <ArrowLeft size={16} className="mr-2" /> Previous
                            </button>

                            <span className="text-sm text-zinc-500 font-mono">
                                Page {page} of {pagination.totalPages || 1}
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={page >= pagination.totalPages}
                                className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                                    page >= pagination.totalPages
                                        ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer'
                                }`}
                            >
                                Next <ArrowRight size={16} className="ml-2" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AllNotes;
