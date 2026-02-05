import React, { useState } from 'react';
import { Post, ContentType } from '@/types';
import { Plus, Globe2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { Card } from '@/components/admin/ui/Card';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';

interface LanguagesPageProps {
    languages: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const LanguagesPage: React.FC<LanguagesPageProps> = ({
    languages,
    onEdit,
    onNew,
    onDelete,
    onStatusChange,
}) => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>(
        'all'
    );
    const [sortBy, setSortBy] = useState<'name' | 'proficiency'>('proficiency');

    const filteredLanguages = languages
        .filter(
            (lang) =>
                (lang.title.toLowerCase().includes(search.toLowerCase()) ||
                    lang.excerpt.toLowerCase().includes(search.toLowerCase())) &&
                (filterStatus === 'all' || lang.status === filterStatus)
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.title.localeCompare(b.title);
            if (sortBy === 'proficiency') return (b.views || 0) - (a.views || 0);
            return 0;
        });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Languages"
                description="Spoken and written languages proficiency."
                action={
                    <button
                        onClick={() => onNew(ContentType.LANGUAGE)}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Language
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search languages..."
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
                    { label: 'Highest Proficiency', value: 'proficiency' },
                    { label: 'Name (A-Z)', value: 'name' },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLanguages.map((lang) => (
                    <Card key={lang.id} className="flex items-center gap-4">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtons
                                onEdit={() => onEdit(lang)}
                                onDelete={() => onDelete(lang.id)}
                                onStatusChange={() =>
                                    onStatusChange(
                                        lang.id,
                                        lang.status === 'published' ? 'draft' : 'published'
                                    )
                                }
                                status={lang.status}
                            />
                        </div>

                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0 border border-indigo-100 dark:border-zinc-700">
                            {lang.title.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-zinc-900 dark:text-white text-lg truncate">
                                {lang.title}
                            </h3>
                            <p className="text-sm text-zinc-500 mb-2">{lang.excerpt}</p>

                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${lang.views || 0}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredLanguages.length === 0 && (
                    <EmptyState icon={Globe2} message="No languages found." />
                )}
            </div>
        </div>
    );
};
