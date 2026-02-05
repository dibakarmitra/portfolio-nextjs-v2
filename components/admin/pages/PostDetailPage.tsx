import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '@/types';
import {
    ArrowLeft,
    Calendar,
    Eye,
    Clock,
    Tag,
    Share2,
    Edit,
    Globe,
    Github,
    Building2,
    MapPin,
    Heart,
    Check,
    Copy,
} from 'lucide-react';
import { MarkdownComponents } from '@/components/admin/editor';

interface PostDetailPageProps {
    post: Note;
    onBack: () => void;
    onEdit: (post: Note) => void;
}

export function PostDetailPage({ post, onBack, onEdit }: PostDetailPageProps) {
    const readTime = Math.ceil((post.content?.length || 0) / 1000); // Approx read time
    const [isShared, setIsShared] = useState(false);
    const [isSlugCopied, setIsSlugCopied] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share aborted');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        }
    };

    const handleCopySlug = () => {
        navigator.clipboard.writeText(post.slug);
        setIsSlugCopied(true);
        setTimeout(() => setIsSlugCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
                >
                    <ArrowLeft
                        size={20}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="font-medium">Back</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-full transition-colors relative group"
                        title={isShared ? 'Copied Link!' : 'Share Post'}
                    >
                        {isShared ? (
                            <Check size={18} className="text-green-500" />
                        ) : (
                            <Share2 size={18} />
                        )}
                    </button>
                    <button
                        onClick={() => onEdit(post)}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Post Header */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                                    post.status === 'published'
                                        ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                        : post.status === 'draft'
                                          ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                          : 'bg-zinc-100 dark:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20'
                                }`}
                            >
                                {post.status}
                            </span>
                            <span className="text-zinc-500 flex items-center text-sm">
                                <Calendar size={14} className="mr-1.5" />
                                {new Date(post.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="text-zinc-500 flex items-center text-sm capitalize">
                                <Tag size={14} className="mr-1.5" />
                                {post.type}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        {post.company && (
                            <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 text-base">
                                <span className="flex items-center">
                                    <Building2
                                        size={16}
                                        className="mr-2 text-blue-600 dark:text-blue-400"
                                    />
                                    {post.company}
                                </span>
                                {post.location && (
                                    <span className="flex items-center">
                                        <MapPin size={16} className="mr-2 text-zinc-500" />
                                        {post.location}
                                    </span>
                                )}
                            </div>
                        )}

                        {post.excerpt && (
                            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-4 border-zinc-200 dark:border-zinc-700 pl-4 italic">
                                {post.excerpt}
                            </p>
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="bg-white dark:bg-zinc-950/50 rounded-xl p-0 lg:p-2">
                        <article className="max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={MarkdownComponents}
                            >
                                {post.content || ''}
                            </ReactMarkdown>
                        </article>
                    </div>
                </div>

                {/* Sidebar Metadata */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sticky top-8 shadow-sm overflow-hidden">
                        {/* Cover Image in Sidebar */}
                        {post.imageUrl && !imageError && (
                            <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 relative group">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={() => setImageError(true)}
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none" />
                            </div>
                        )}

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                                    Meta Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center">
                                            <Eye size={15} className="mr-2 opacity-70" /> Views
                                        </span>
                                        <span className="text-zinc-900 dark:text-white font-mono text-sm">
                                            {post.views?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center">
                                            <Heart size={15} className="mr-2 opacity-70" /> Likes
                                        </span>
                                        <span className="text-zinc-900 dark:text-white font-mono text-sm">
                                            {post.likes?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center">
                                            <Clock size={15} className="mr-2 opacity-70" /> Read
                                            Time
                                        </span>
                                        <span className="text-zinc-900 dark:text-white font-mono text-sm">
                                            {readTime} min
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                        <span className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center">
                                            <Globe size={15} className="mr-2 opacity-70" /> Slug
                                        </span>
                                        <button
                                            onClick={handleCopySlug}
                                            className="group flex items-center gap-2 max-w-[140px] hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 -mr-1.5 rounded transition-all"
                                            title="Click to copy slug"
                                        >
                                            <span className="text-zinc-900 dark:text-white font-mono text-xs truncate">
                                                {post.slug}
                                            </span>
                                            {isSlugCopied ? (
                                                <Check
                                                    size={12}
                                                    className="text-green-500 shrink-0"
                                                />
                                            ) : (
                                                <Copy
                                                    size={12}
                                                    className="text-zinc-400 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity"
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center"
                                        >
                                            <Tag size={12} className="mr-1.5 opacity-50" />
                                            {tag}
                                        </span>
                                    ))}
                                    {post.tags.length === 0 && (
                                        <span className="text-xs text-zinc-400 italic">
                                            No tags
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Project Links (Conditional) */}
                            {(post.repoUrl || post.liveUrl) && (
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                        Links
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {post.repoUrl && (
                                            <a
                                                href={post.repoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                                            >
                                                <Github size={16} className="mr-2" /> Repository
                                            </a>
                                        )}
                                        {post.liveUrl && (
                                            <a
                                                href={post.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                                            >
                                                <Globe size={16} className="mr-2" /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
