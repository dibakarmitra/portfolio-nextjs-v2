import React, { useState } from 'react';
import { Tag } from '@/types';
import { Plus, Tag as TagIcon, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';
import { Pagination } from '@/components/admin/ui/Pagination';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { TagEditorDialog } from '@/components/admin/editor/TagEditorDialog';

interface TagsPageProps {
    tags: Tag[];
    onSave: (tag: Partial<Tag>) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export const TagsPage: React.FC<TagsPageProps> = ({ tags, onSave, onDelete }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const {
        search,
        setSearch,
        sortBy,
        setSortBy,
        currentItems: currentTags,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(tags, {
        searchFields: ['name', 'slug'],
        itemsPerPage: 20,
        initialSort: 'name_asc',
    });

    const handleNew = () => {
        setEditingTag(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setIsEditorOpen(true);
    };

    const handleSaveCallback = async (data: Partial<Tag>) => {
        await onSave({ ...data, id: editingTag?.id });
        setIsEditorOpen(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tags"
                description="Manage content tags."
                action={
                    <button
                        onClick={handleNew}
                        className="flex items-center justify-center px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        New Tag
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search tags..."
                sortValue={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: 'Name (A-Z)', value: 'name_asc' },
                    { label: 'Name (Z-A)', value: 'name_desc' },
                ]}
                filterValue="all"
                onFilterChange={() => {}}
                filterOptions={[{ label: 'All', value: 'all' }]}
            />

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {currentTags.map((tag) => (
                                <tr
                                    key={tag.id}
                                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">
                                        <div className="flex items-center gap-2">
                                            <TagIcon size={14} className="text-zinc-400" />
                                            {tag.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-500 font-mono">
                                        {tag.slug}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(tag)}
                                                className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(tag.id)}
                                                className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {currentTags.length === 0 && (
                    <EmptyState icon={TagIcon} message="No tags found matching your filters." />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNext={nextPage}
                    onPrev={prevPage}
                    className="p-4"
                />
            </div>

            <TagEditorDialog
                isOpen={isEditorOpen}
                initialTag={editingTag}
                onSave={handleSaveCallback}
                onCancel={() => setIsEditorOpen(false)}
            />
        </div>
    );
};
