import React from 'react';
import { Note, ContentType } from '@/types';
import { Plus, Calendar, Eye, Heart, FileText } from 'lucide-react';
import { Pagination } from '@/components/admin/ui/Pagination';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';

interface NotesPageProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onNew: (type: ContentType) => void;
    onView: (note: Note) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: Note['status']) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
    notes,
    onEdit,
    onNew,
    onView,
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
        currentItems: currentNotes,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(notes, {
        searchFields: ['title', 'slug', 'tags'],
        filterField: 'status',
        itemsPerPage: 8,
        initialSort: 'newest',
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Notes & Articles"
                description="Writing, tutorials, and thoughts."
                action={
                    <button
                        onClick={() => onNew(ContentType.NOTE)}
                        className="flex items-center justify-center px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Write Note
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search notes..."
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
                    { label: 'Most Popular', value: 'popular' },
                ]}
            />

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                <th className="px-6 py-4">Article Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Engagement</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {currentNotes.map((note) => (
                                <tr
                                    key={note.id}
                                    className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="flex gap-4">
                                            {note.imageUrl && (
                                                <div className="w-16 h-12 shrink-0 rounded overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
                                                    <img
                                                        src={note.imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span
                                                    className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                                                    onClick={() => onView(note)}
                                                >
                                                    {note.title}
                                                </span>
                                                <span className="text-xs text-zinc-500 mt-1 font-mono truncate">
                                                    {note.slug}
                                                </span>
                                                <div className="flex gap-2 mt-2">
                                                    {note.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={note.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                                <Eye size={12} className="mr-1.5" />
                                                {note.views?.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                                                <Heart size={12} className="mr-1.5" />
                                                {note.likes?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                            <Calendar
                                                size={14}
                                                className="mr-2 text-zinc-400 dark:text-zinc-600"
                                            />
                                            {new Date(note.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ActionButtons
                                            className="justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                                            onEdit={() => onEdit(note)}
                                            onDelete={() => onDelete(note.id)}
                                            onStatusChange={() =>
                                                onStatusChange(
                                                    note.id,
                                                    note.status === 'published'
                                                        ? 'draft'
                                                        : 'published'
                                                )
                                            }
                                            status={note.status}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {currentNotes.length === 0 && (
                    <EmptyState icon={FileText} message="No notes found matching your filters." />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNext={nextPage}
                    onPrev={prevPage}
                    className="p-4"
                />
            </div>
        </div>
    );
};
