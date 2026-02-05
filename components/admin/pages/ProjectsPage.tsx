import React from 'react';
import { ResumeContent, ContentType } from '@/types';
import { Plus } from 'lucide-react';
import { ProjectCard } from '@/components/admin/common';
import { Pagination } from '@/components/admin/ui/Pagination';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';

interface ProjectsPageProps {
    projects: ResumeContent[];
    onEdit: (note: ResumeContent) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string | number) => void;
    onStatusChange: (id: string | number, status: ResumeContent['status']) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
    projects,
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
        currentItems: currentProjects,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(projects, {
        searchFields: ['title', 'tags'],
        filterField: 'status',
        itemsPerPage: 6,
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Projects"
                description="Manage your portfolio showcase and case studies."
                action={
                    <button
                        onClick={() => onNew(ContentType.PROJECT)}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Project
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search projects..."
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
                    { label: 'Most Viewed', value: 'views' },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                    />
                ))}
                {currentProjects.length === 0 && (
                    <EmptyState icon={Plus} message="No projects found matching your filters." />
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={nextPage}
                onPrev={prevPage}
                className="pt-4"
            />
        </div>
    );
};
