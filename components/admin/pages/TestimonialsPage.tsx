import React, { useState } from 'react';
import { Post, ContentType } from '@/types';
import { Plus, MessageSquareQuote, User } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { Card } from '@/components/admin/ui/Card';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';

interface TestimonialsPageProps {
    testimonials: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
    testimonials,
    onEdit,
    onNew,
    onDelete,
    onStatusChange,
}) => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>(
        'all'
    );
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const filteredItems = testimonials
        .filter(
            (item) =>
                (item.title.toLowerCase().includes(search.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(search.toLowerCase())) &&
                (filterStatus === 'all' || item.status === filterStatus)
        )
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
            return 0;
        });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Testimonials"
                description="References and endorsements from colleagues and clients."
                action={
                    <button
                        onClick={() => onNew(ContentType.TESTIMONIAL)}
                        className="flex items-center justify-center px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Testimonial
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search testimonials..."
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
                    { label: 'Oldest First', value: 'oldest' },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <ActionButtons
                                onEdit={() => onEdit(item)}
                                onDelete={() => onDelete(item.id)}
                                onStatusChange={() =>
                                    onStatusChange(
                                        item.id,
                                        item.status === 'published' ? 'draft' : 'published'
                                    )
                                }
                                status={item.status}
                            />
                        </div>

                        <div className="mb-4">
                            <MessageSquareQuote
                                size={32}
                                className="text-zinc-300 dark:text-zinc-700 mb-4"
                            />
                            <p className="text-zinc-600 dark:text-zinc-300 italic leading-relaxed text-sm">
                                "{item.excerpt}"
                            </p>
                        </div>

                        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={18} className="text-zinc-400 dark:text-zinc-500" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-zinc-500">{item.company || item.slug}</p>
                            </div>
                            {item.status === 'published' && (
                                <div
                                    className="ml-auto w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                    title="Published"
                                ></div>
                            )}
                        </div>
                    </Card>
                ))}

                {filteredItems.length === 0 && (
                    <EmptyState icon={MessageSquareQuote} message="No testimonials found." />
                )}
            </div>
        </div>
    );
};
