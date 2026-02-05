import React from 'react';
import { Post, ContentType } from '@/types';
import { Plus, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Pagination } from '@/components/admin/ui/Pagination';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';

interface EducationPageProps {
    education: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({
    education,
    onEdit,
    onNew,
    onDelete,
    onStatusChange,
}) => {
    const {
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        currentItems: currentEducation,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(education, {
        searchFields: ['title', 'company', 'location'],
        filterField: 'status',
        itemsPerPage: 5,
        initialSort: 'newest',
    });

    return (
        <div className="space-y-8">
            <PageHeader
                title="Education"
                description="Academic background and certifications."
                action={
                    <button
                        onClick={() => onNew(ContentType.EDUCATION)}
                        className="flex items-center justify-center px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-medium rounded-md transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Education
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search education..."
                filterValue={filterStatus}
                onFilterChange={setFilterStatus}
                filterOptions={[
                    { label: 'All', value: 'all' },
                    { label: 'Published', value: 'published' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' },
                ]}
                sortValue={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: 'Newest First', value: 'newest' },
                    { label: 'Oldest First', value: 'oldest' },
                ]}
            />

            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-8">
                {currentEducation.map((edu, index) => (
                    <div key={edu.id} className="relative pl-8 group">
                        {/* Timeline Dot */}
                        <div
                            className={`
              absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-zinc-200 dark:border-zinc-950 
              ${index === 0 && currentPage === 1 ? 'bg-purple-500 ring-4 ring-purple-500/20' : 'bg-zinc-400 dark:bg-zinc-700'}
            `}
                        ></div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                        {edu.title}
                                        <StatusBadge status={edu.status} className="ml-2" />
                                    </h3>
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                                        <GraduationCap size={14} />
                                        <span>{edu.company}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-mono mr-2">
                                        <Calendar size={12} className="mr-1.5" />
                                        {new Date(edu.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}{' '}
                                        — {edu.endDate || 'Present'}
                                    </span>

                                    <ActionButtons
                                        onEdit={() => onEdit(edu)}
                                        onDelete={() => onDelete(edu.id)}
                                        onStatusChange={() =>
                                            onStatusChange(
                                                edu.id,
                                                edu.status === 'published' ? 'draft' : 'published'
                                            )
                                        }
                                        status={edu.status}
                                    />
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none text-zinc-600 dark:text-zinc-400 mb-4 dark:prose-invert">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {edu.content.replace(/^# .+\n/, '')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                {edu.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/20 rounded-md"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {edu.location && (
                                    <span className="ml-auto flex items-center text-xs text-zinc-500">
                                        <MapPin size={12} className="mr-1" />
                                        {edu.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {currentEducation.length === 0 && (
                    <div className="pl-6">
                        <EmptyState icon={GraduationCap} message="No education entries found." />
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={nextPage}
                onPrev={prevPage}
                className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6"
            />
        </div>
    );
};
