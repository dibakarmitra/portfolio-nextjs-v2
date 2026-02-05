import React, { useState, useMemo, useEffect } from 'react';
import { Note, ContentType } from '@/types';
import { TrendingUp, FileStack, PenTool, Trash2, Eye, EyeOff, Heart, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StatsCard } from '@/components/admin/common';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFilterAndSort } from '@/hooks/useFilterAndSort';
import { Pagination } from '@/components/admin/ui/Pagination';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { SettingsDisplay } from '@/components/admin/common/SettingsDisplay';

interface DashboardPageProps {
    data: Note[];
    onEdit: (post: Note) => void;
    onNew: (type: ContentType) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: Note['status']) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    {label}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {payload[0].value} Views
                </p>
            </div>
        );
    }
    return null;
};

export const DashboardPage: React.FC<DashboardPageProps> = React.memo(
    ({ data, onEdit, onNew, onDelete, onStatusChange }) => {
        const [currentPage, setCurrentPage] = useState(1);
        const [search, setSearch] = useState('');

        const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

        const [scratchpadValue, setScratchpadValue] = useLocalStorage({
            key: 'admin_scratchpad',
            initialValue: '',
            debounceMs: 300, // From APP_CONFIG.timeouts.debounce
        });

        const handleScratchpadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setScratchpadValue(e.target.value);
            setSavedStatus('saving');
        };

        const { filteredData, sortedData } = useFilterAndSort({
            data,
            searchValue: search,
            sortValue: 'date-desc',
        });

        const stats = useMemo(() => {
            const totalViews = data.reduce((acc, curr) => acc + (curr.views || 0), 0);
            const totalLikes = data.reduce((acc, curr) => acc + (curr.likes || 0), 0);

            const mockChartData = [
                { name: 'Mon', views: Math.floor(totalViews * 0.1) },
                { name: 'Tue', views: Math.floor(totalViews * 0.15) },
                { name: 'Wed', views: Math.floor(totalViews * 0.2) },
                { name: 'Thu', views: Math.floor(totalViews * 0.12) },
                { name: 'Fri', views: Math.floor(totalViews * 0.25) },
                { name: 'Sat', views: Math.floor(totalViews * 0.1) },
                { name: 'Sun', views: Math.floor(totalViews * 0.08) },
            ];

            return { totalViews, totalLikes, mockChartData };
        }, [data]);

        const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
        const currentData = sortedData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

        const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
        const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

        const formatNumber = (num: number) =>
            num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Views"
                        value={formatNumber(stats.totalViews)}
                        icon={<TrendingUp className="w-5 h-5" />}
                        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                        iconColor="text-blue-600 dark:text-blue-500"
                        trend="+12.5%"
                    />
                    <StatsCard
                        title="Total Engagement"
                        value={formatNumber(stats.totalLikes)}
                        icon={<Heart className="w-5 h-5" />}
                        iconBgColor="bg-pink-50 dark:bg-pink-900/20"
                        iconColor="text-pink-600 dark:text-pink-500"
                    />
                    <StatsCard
                        title="Content Items"
                        value={data.length}
                        icon={<FileStack className="w-5 h-5" />}
                        iconBgColor="bg-amber-50 dark:bg-amber-900/20"
                        iconColor="text-amber-600 dark:text-amber-500"
                        action={
                            <button
                                onClick={() => onNew(ContentType.NOTE)}
                                className="text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded transition-colors"
                            >
                                + New Post
                            </button>
                        }
                    />
                </div>

                {/* Live Settings Display */}
                <SettingsDisplay />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Analytics Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                            Traffic Overview
                        </h3>
                        <div className="h-64 w-full flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Chart temporarily disabled
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Recharts compatibility issue with React 19
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Scratchpad */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Quick Notes
                            </h3>
                            <span
                                className={`text-xs font-medium transition-colors duration-300 ${
                                    savedStatus === 'saving'
                                        ? 'text-blue-500 animate-pulse'
                                        : savedStatus === 'saved'
                                          ? 'text-green-500'
                                          : 'text-zinc-400'
                                }`}
                            >
                                {savedStatus === 'saving'
                                    ? 'Saving...'
                                    : savedStatus === 'saved'
                                      ? 'Saved'
                                      : 'Auto-save enabled'}
                            </span>
                        </div>
                        <textarea
                            value={scratchpadValue}
                            onChange={handleScratchpadChange}
                            placeholder="Jot down ideas, to-dos, or draft titles here..."
                            className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-3 text-sm resize-none focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Content List */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            All Notes / Blog
                        </h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <SearchBar
                                value={search}
                                onChange={(val) => {
                                    setSearch(val);
                                    setCurrentPage(1);
                                }}
                                className="w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs uppercase font-medium text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {currentData.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {post.title}
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-1">
                                                {post.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={post.status} />
                                        </td>
                                        <td className="px-6 py-4 capitalize">{post.type}</td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {new Date(post.date).toLocaleDateString('en-CA')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        onStatusChange(
                                                            post.id,
                                                            post.status === 'published'
                                                                ? 'draft'
                                                                : 'published'
                                                        )
                                                    }
                                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                                    title={
                                                        post.status === 'published'
                                                            ? 'Unpublish'
                                                            : 'Publish'
                                                    }
                                                >
                                                    {post.status === 'published' ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => onEdit(post)}
                                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <PenTool size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(post.id)}
                                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-8 text-center text-zinc-500"
                                        >
                                            No content found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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
    }
);
