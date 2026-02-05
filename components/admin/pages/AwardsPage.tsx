import React from 'react';
import { Post, ContentType } from '@/types';
import { Plus, Award, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { Card } from '@/components/admin/ui/Card';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';
import { IconBadge } from '@/components/admin/ui/IconBadge';

interface AwardsPageProps {
    awards: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const AwardsPage: React.FC<AwardsPageProps> = ({
    awards,
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
        currentItems: currentAwards,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(awards, {
        searchFields: ['title', 'company'],
        filterField: 'status',
        itemsPerPage: 6,
        initialSort: 'newest',
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Awards & Honors"
                description="Recognition and achievements."
                action={
                    <button
                        onClick={() => onNew(ContentType.AWARD)}
                        className="flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-amber-500/20 dark:shadow-amber-900/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Award
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search awards..."
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

            <div className="space-y-4">
                {currentAwards.map((award) => (
                    <Card
                        key={award.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <IconBadge icon={Award} color="amber" />
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">
                                    {award.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    <span>{award.company}</span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {new Date(award.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                {award.excerpt && (
                                    <p className="text-sm text-zinc-600 dark:text-zinc-500 mt-1 max-w-xl">
                                        {award.excerpt}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="ml-auto md:ml-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtons
                                onEdit={() => onEdit(award)}
                                onDelete={() => onDelete(award.id)}
                                onStatusChange={() =>
                                    onStatusChange(
                                        award.id,
                                        award.status === 'published' ? 'draft' : 'published'
                                    )
                                }
                                status={award.status}
                            />
                        </div>
                    </Card>
                ))}

                {currentAwards.length === 0 && (
                    <EmptyState icon={Award} message="No awards found." />
                )}
            </div>
        </div>
    );
};
