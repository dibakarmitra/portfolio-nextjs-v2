import React from 'react';
import { Post, ContentType } from '@/types';
import { Plus, BadgeCheck, Calendar, ExternalLink, Medal } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { Card } from '@/components/admin/ui/Card';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';
import { IconBadge } from '@/components/admin/ui/IconBadge';

interface CertificationsPageProps {
    certifications: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const CertificationsPage: React.FC<CertificationsPageProps> = ({
    certifications,
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
        currentItems: currentCerts,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(certifications, {
        searchFields: ['title', 'company'],
        filterField: 'status',
        itemsPerPage: 6,
        initialSort: 'newest',
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Certifications"
                description="Professional credentials and licenses."
                action={
                    <button
                        onClick={() => onNew(ContentType.CERTIFICATION)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Certification
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search certifications..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCerts.map((cert) => (
                    <Card key={cert.id} className="flex flex-col">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtons
                                onEdit={() => onEdit(cert)}
                                onDelete={() => onDelete(cert.id)}
                                onStatusChange={() =>
                                    onStatusChange(
                                        cert.id,
                                        cert.status === 'published' ? 'draft' : 'published'
                                    )
                                }
                                status={cert.status}
                            />
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <IconBadge icon={BadgeCheck} color="blue" />
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg leading-tight mb-1">
                                    {cert.title}
                                </h3>
                                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                                    <Medal size={12} className="mr-1.5" />
                                    {cert.company}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4 flex-1">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                                {cert.excerpt || 'No description provided.'}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center text-zinc-500">
                                <Calendar size={12} className="mr-1.5" />
                                Issued:{' '}
                                {new Date(cert.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </div>
                            {cert.slug && (
                                <div className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors cursor-pointer">
                                    <span className="mr-1">Verify</span>
                                    <ExternalLink size={12} />
                                </div>
                            )}
                        </div>
                    </Card>
                ))}

                {currentCerts.length === 0 && (
                    <EmptyState icon={BadgeCheck} message="No certifications found." />
                )}
            </div>
        </div>
    );
};
