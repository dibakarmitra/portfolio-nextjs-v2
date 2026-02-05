'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Github, ArrowUpRight, Folder, Loader2 } from 'lucide-react';
import FadeIn from '../ui/FadeIn';
import { useProjects } from '@/hooks/useProjects';

const AllProjects: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const { projects, pagination, isLoading } = useProjects(page, 10);

    const handlePrev = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    const handleNext = () => {
        if (page < pagination.totalPages) setPage((p) => p + 1);
    };

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
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                        All Projects
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                        A collection of projects I've worked on, from side hustles to experiments.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-zinc-400" size={32} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((project, index) => (
                                <FadeIn key={project.id || index} delay={index * 50}>
                                    <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                                                <Folder
                                                    size={18}
                                                    className="text-zinc-700 dark:text-zinc-100"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                {project.repoUrl && (
                                                    <a
                                                        href={project.repoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        aria-label={`View ${project.title} code`}
                                                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                    >
                                                        <Github size={18} />
                                                    </a>
                                                )}
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        aria-label={`View ${project.title} live`}
                                                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                    >
                                                        <ArrowUpRight size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500 font-mono mb-3">
                                            {project.date
                                                ? new Date(project.date).toLocaleDateString()
                                                : ''}
                                        </p>

                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex-grow leading-relaxed">
                                            {project.content}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                                            {project.tags?.map((t) => (
                                                <span
                                                    key={t.id}
                                                    className="px-1.5 py-0.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] text-zinc-600 dark:text-zinc-300 font-mono"
                                                >
                                                    {t.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
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
                                Next <ArrowUpRight size={16} className="ml-2 rotate-45" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AllProjects;
