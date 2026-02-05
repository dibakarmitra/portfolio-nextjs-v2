import React from 'react';
import { ResumeContent, ContentType } from '@/types';
import { Plus, Calendar, MapPin, Building2, Briefcase } from 'lucide-react';
import { Pagination } from '@/components/admin/ui/Pagination';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';

interface ExperiencePageProps {
    experiences: ResumeContent[];
    onEdit: (note: ResumeContent) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string | number) => void;
    onStatusChange: (id: string | number, status: ResumeContent['status']) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({
    experiences,
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
        currentItems: currentExperiences,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(experiences, {
        searchFields: ['title', 'company', 'location'],
        filterField: 'status',
        itemsPerPage: 5,
        initialSort: 'newest',
    });

    return (
        <div className="space-y-8">
            <PageHeader
                title="Work Experience"
                description="Professional timeline and career milestones."
                action={
                    <button
                        onClick={() => onNew(ContentType.EXPERIENCE)}
                        className="flex items-center justify-center px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-medium rounded-md transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Role
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search experience..."
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
                {currentExperiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8 group">
                        <div
                            className={`
              absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-zinc-200 dark:border-zinc-950 
              ${index === 0 && currentPage === 1 ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-zinc-400 dark:bg-zinc-700'}
            `}
                        ></div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                        {exp.title}
                                        {exp.status === 'published' && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                                        <Building2 size={14} />
                                        <span>{exp.company}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-mono mr-2">
                                        <Calendar size={12} className="mr-1.5" />
                                        {new Date(exp.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}{' '}
                                        — {exp.endDate || 'Present'}
                                    </span>

                                    <ActionButtons
                                        onEdit={() => onEdit(exp)}
                                        onDelete={() => onDelete(exp.id)}
                                        onStatusChange={() =>
                                            onStatusChange(
                                                exp.id,
                                                exp.status === 'published' ? 'draft' : 'published'
                                            )
                                        }
                                        status={exp.status}
                                    />
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none text-zinc-600 dark:text-zinc-400 mb-4 dark:prose-invert">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {exp.content.replace(/^# .+\n/, '')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                {exp.tags.map((tag) => (
                                    <span
                                        key={typeof tag === 'string' ? tag : tag.id}
                                        className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-md"
                                    >
                                        {typeof tag === 'string' ? tag : tag.name}
                                    </span>
                                ))}
                                {exp.location && (
                                    <span className="ml-auto flex items-center text-xs text-zinc-500">
                                        <MapPin size={12} className="mr-1" />
                                        {exp.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {currentExperiences.length === 0 && (
                    <div className="pl-6">
                        <EmptyState icon={Briefcase} message="No experience entries found." />
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
