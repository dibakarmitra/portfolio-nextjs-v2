import React from 'react';
import { Post, ContentType } from '@/types';
import { Plus, Cpu, Zap, Code2, Database, Layout, PenTool } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterToolbar } from '@/components/admin/ui/FilterToolbar';
import { Card } from '@/components/admin/ui/Card';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useSortAndFilter } from '@/hooks/useSortAndFilter';
import { IconBadge } from '@/components/admin/ui/IconBadge';

interface SkillsPageProps {
    skills: Post[];
    onEdit: (post: Post) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, newStatus: any) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({
    skills,
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
        currentItems: currentSkills,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
    } = useSortAndFilter(skills, {
        searchFields: ['title', 'tags'],
        filterField: 'status',
        itemsPerPage: 6,
        initialSort: 'proficiency',
    });

    const getCategoryIcon = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes('front')) return Layout;
        if (lower.includes('back') || lower.includes('database')) return Database;
        if (lower.includes('design')) return PenTool;
        if (lower.includes('lang')) return Code2;
        return Cpu;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Skills & Expertise"
                description="Manage technical skills and proficiency levels."
                action={
                    <button
                        onClick={() => onNew(ContentType.SKILL)}
                        className="flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Skill
                    </button>
                }
            />

            <FilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search skills..."
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
                    { label: 'Highest Proficiency', value: 'proficiency' },
                    { label: 'Name (A-Z)', value: 'name' },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSkills.map((skill) => (
                    <Card key={skill.id} className="p-5">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActionButtons
                                onEdit={() => onEdit(skill)}
                                onDelete={() => onDelete(skill.id)}
                                onStatusChange={() =>
                                    onStatusChange(
                                        skill.id,
                                        skill.status === 'published' ? 'draft' : 'published'
                                    )
                                }
                                status={skill.status}
                            />
                        </div>

                        <div className="flex items-start gap-3 mb-3">
                            <IconBadge
                                icon={getCategoryIcon(skill.tags[0] || '')}
                                color="emerald"
                                size={16}
                                className="p-2.5"
                            />
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-white">
                                    {skill.title}
                                </h3>
                                <p className="text-xs text-zinc-500">{skill.tags.join(', ')}</p>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 h-10">
                            {skill.excerpt || 'No description provided.'}
                        </p>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-zinc-500">Proficiency</span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    {skill.views}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                    style={{ width: `${skill.views || 0}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                ))}

                {currentSkills.length === 0 && <EmptyState icon={Zap} message="No skills found." />}
            </div>
        </div>
    );
};
