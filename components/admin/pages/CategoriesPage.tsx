import React, { useState } from 'react';
import { Category } from '@/types';
import { Plus, Cylinder, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';
import { Pagination } from '@/components/admin/ui/Pagination';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { CategoryEditorDialog } from '@/components/admin/editor/CategoryEditorDialog';

interface CategoriesPageProps {
    categories: Category[];
    onSave: (category: Partial<Category>) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, onSave, onDelete }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const {
        search,
        setSearch,
        sortBy,
        setSortBy,
        currentItems: currentCategories,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(categories, {
        searchFields: ['name', 'slug', 'description'],
        itemsPerPage: 10,
        initialSort: 'name_asc',
    });

    const handleNew = () => {
        setEditingCategory(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsEditorOpen(true);
    };

    const handleSaveCallback = async (data: Partial<Category>) => {
        await onSave({ ...data, id: editingCategory?.id });
        setIsEditorOpen(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Categories"
                description="Manage content categories."
                action={
                    <button
                        onClick={handleNew}
                        className="flex items-center justify-center px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        New Category
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search categories..."
                sortValue={sortBy}
                onSortChange={setSortBy}
                sortOptions={[
                    { label: 'Name (A-Z)', value: 'name_asc' },
                    { label: 'Name (Z-A)', value: 'name_desc' },
                    { label: 'Sort Order', value: 'sortOrder_asc' },
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
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {currentCategories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">
                                        <div className="flex items-center gap-2">
                                            {category.color && (
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                            )}
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-500 font-mono">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-500 max-w-xs truncate">
                                        {category.description || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                category.isActive
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}
                                        >
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(category.id)}
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

                {currentCategories.length === 0 && (
                    <EmptyState
                        icon={Cylinder}
                        message="No categories found matching your filters."
                    />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNext={nextPage}
                    onPrev={prevPage}
                    className="p-4"
                />
            </div>

            <CategoryEditorDialog
                isOpen={isEditorOpen}
                initialCategory={editingCategory}
                onSave={handleSaveCallback}
                onCancel={() => setIsEditorOpen(false)}
            />
        </div>
    );
};
