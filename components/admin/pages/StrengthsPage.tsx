import React, { useState } from 'react';
import { Post, ContentType } from '@/types';
import { Plus, Zap } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { Card } from '@/components/admin/ui/Card';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';

interface StrengthsPageProps {
    strengths: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const StrengthsPage: React.FC<StrengthsPageProps> = ({
    strengths,
    onEdit,
    onNew,
    onDelete,
    onStatusChange,
}) => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>(
        'all'
    );
    const [sortBy, setSortBy] = useState<'name' | 'newest'>('newest');

    const filteredStrengths = strengths
        .filter(
            (item) =>
                (item.title.toLowerCase().includes(search.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(search.toLowerCase())) &&
                (filterStatus === 'all' || item.status === filterStatus)
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.title.localeCompare(b.title);
            if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
            return 0;
        });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Strengths"
                description="Soft skills, core competencies, and personal attributes."
                action={
                    <button
                        onClick={() => onNew(ContentType.STRENGTH)}
                        className="flex items-center justify-center px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-yellow-500/20 dark:shadow-yellow-900/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Strength
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search strengths..."
                filterValue={filterStatus}
                onFilterChange={(val) => setFilterStatus(val as any)}
                filterOptions={[
                    { label: 'All', value: 'all' },
                    { label: 'Published', value: 'published' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' },
                ]}
                sortValue={sortBy}
                onSortChange={(val) => setSortBy(val as any)}
                sortOptions={[
                    { label: 'Newest First', value: 'newest' },
                    { label: 'Name (A-Z)', value: 'name' },
                ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredStrengths.map((strength) => (
                    <Card key={strength.id} className="flex flex-col justify-between min-h-[140px]">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtons
                                onEdit={() => onEdit(strength)}
                                onDelete={() => onDelete(strength.id)}
                                onStatusChange={() =>
                                    onStatusChange(
                                        strength.id,
                                        strength.status === 'published' ? 'draft' : 'published'
                                    )
                                }
                                status={strength.status}
                            />
                        </div>

                        <div className="mb-2">
                            <div className="inline-block p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-500 mb-3">
                                <Zap size={20} />
                            </div>
                            <h3 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight">
                                {strength.title}
                            </h3>
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {strength.excerpt}
                        </p>
                    </Card>
                ))}

                {filteredStrengths.length === 0 && (
                    <EmptyState icon={Zap} message="No strengths found." />
                )}
            </div>
        </div>
    );
};
