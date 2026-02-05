'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    Bold,
    Italic,
    List,
    Code,
    Image as ImageIcon,
    Link as LinkIcon,
    Eye,
    Wand2,
    Save,
    X,
    Terminal,
    Hash,
    Calendar,
    Globe,
    Github,
    Building2,
    MapPin,
    Percent,
    Link,
    AlertTriangle,
    RotateCcw,
    Trash,
    Heart,
    Upload,
    AlignLeft,
    Clock,
    Copy,
    Check,
    Sparkles,
    Activity,
    Search,
    Loader2,
    Cylinder,
} from 'lucide-react';
import useSWR from 'swr';
import { polishContent, polishText, generateTags } from '@/services/geminiService';
import { Note, ContentType, Category } from '@/types';

const fetcher = (url: string) =>
    fetch(url)
        .then((res) => res.json())
        .then((res) => res.data);

export interface NoteEditorDialogProps {
    isOpen: boolean;
    initialNote?: Note | null;
    initialType: ContentType;
    onSave: (note: Partial<Note>) => void;
    onCancel: () => void;
    onImageUpload: (file: File) => Promise<string>;
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const [isCopied, setIsCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (inline) {
        return (
            <code
                className="bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded text-pink-600 dark:text-pink-300 text-[13px] font-mono border border-zinc-200 dark:border-zinc-700/50"
                {...props}
            >
                {children}
            </code>
        );
    }

    return (
        <div className="relative group my-6 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl bg-[#282a36]">
            {language && (
                <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800/50">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                        {language}
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                    </div>
                </div>
            )}

            <div className="relative">
                <SyntaxHighlighter
                    language={language}
                    style={dracula}
                    customStyle={{
                        margin: 0,
                        padding: '1.25rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                    }}
                    codeTagProps={{
                        style: { fontFamily: 'inherit' },
                    }}
                    PreTag="div"
                    {...props}
                >
                    {codeString}
                </SyntaxHighlighter>

                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/80 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm border border-white/5"
                    title="Copy code"
                >
                    {isCopied ? (
                        <Check size={14} className="text-emerald-400" />
                    ) : (
                        <Copy size={14} />
                    )}
                </button>
            </div>
        </div>
    );
};

export const MarkdownComponents = {
    table: ({ node, ...props }: any) => (
        <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
            <table
                className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300"
                {...props}
            />
        </div>
    ),
    thead: ({ node, ...props }: any) => (
        <thead
            className="text-xs text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800"
            {...props}
        />
    ),
    tbody: ({ node, ...props }: any) => (
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50" {...props} />
    ),
    tr: ({ node, ...props }: any) => (
        <tr className="hover:bg-zinc-100 dark:hover:bg-zinc-800/30 transition-colors" {...props} />
    ),
    th: ({ node, ...props }: any) => (
        <th className="px-6 py-3.5 font-semibold tracking-wider" {...props} />
    ),
    td: ({ node, ...props }: any) => <td className="px-6 py-4 whitespace-nowrap" {...props} />,

    blockquote: ({ node, ...props }: any) => (
        <blockquote
            className="border-l-4 border-blue-500 pl-6 py-3 my-6 bg-gradient-to-r from-blue-500/10 to-transparent rounded-r-lg italic text-zinc-700 dark:text-zinc-300"
            {...props}
        />
    ),

    a: ({ node, ...props }: any) => (
        <a
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline decoration-blue-400/30 underline-offset-4 transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),

    code: CodeBlock,

    img: ({ node, ...props }: any) => (
        <img
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl max-h-[500px] object-cover mx-auto my-8"
            {...props}
        />
    ),

    h1: ({ node, ...props }: any) => (
        <h1
            className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-10 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800"
            {...props}
        />
    ),
    h2: ({ node, ...props }: any) => (
        <h2
            className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4 flex items-center gap-2"
            {...props}
        />
    ),
    h3: ({ node, ...props }: any) => (
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-6 mb-3" {...props} />
    ),
    p: ({ node, ...props }: any) => (
        <p className="leading-7 text-zinc-700 dark:text-zinc-300 mb-4" {...props} />
    ),

    ul: ({ node, ...props }: any) => (
        <ul
            className="list-disc list-outside ml-6 space-y-2 my-4 text-zinc-700 dark:text-zinc-300"
            {...props}
        />
    ),
    ol: ({ node, ...props }: any) => (
        <ol
            className="list-decimal list-outside ml-6 space-y-2 my-4 text-zinc-700 dark:text-zinc-300"
            {...props}
        />
    ),
    li: ({ node, ...props }: any) => <li className="pl-1 leading-7" {...props} />,
    hr: ({ node, ...props }: any) => (
        <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />
    ),
};

export const NoteEditorDialog: React.FC<NoteEditorDialogProps> = React.memo(
    ({ isOpen, initialNote, initialType, onSave, onCancel, onImageUpload }) => {
        const [title, setTitle] = useState('');
        const [slug, setSlug] = useState('');
        const [content, setContent] = useState('');
        const [tags, setTags] = useState('');
        const [status, setStatus] = useState<Note['status']>('draft');
        const [date, setDate] = useState('');

        const [company, setCompany] = useState('');
        const [location, setLocation] = useState('');
        const [endDate, setEndDate] = useState('');
        const [imageUrl, setImageUrl] = useState('');
        const [repoUrl, setRepoUrl] = useState('');
        const [liveUrl, setLiveUrl] = useState('');
        const [views, setViews] = useState(0);
        const [likes, setLikes] = useState(0);
        const [excerpt, setExcerpt] = useState('');

        const [seoTitle, setSeoTitle] = useState('');
        const [seoDescription, setSeoDescription] = useState('');
        const [seoKeywords, setSeoKeywords] = useState('');

        const [isPreview, setIsPreview] = useState(false);
        const [isAiLoading, setIsAiLoading] = useState(false);
        const [isAiExcerptLoading, setIsAiExcerptLoading] = useState(false);
        const [isTagGenerating, setIsTagGenerating] = useState(false);
        const [isImageUploading, setIsImageUploading] = useState(false);

        const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
        const [draftAvailable, setDraftAvailable] = useState(false);

        const [category, setCategory] = useState<Category | undefined>(undefined);

        const { data: categories = [] } = useSWR<Category[]>(
            initialType === ContentType.NOTE || initialType === ContentType.PROJECT
                ? '/api/notes/categories'
                : null,
            fetcher
        );

        const stats = useMemo(() => {
            const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
            const readTime = Math.ceil(wordCount / 200);

            let score = 0;
            if (title.length > 10) score += 20;
            if (content.length > 100) score += 20;
            if (content.length > 500) score += 10;
            if (content.includes('# ')) score += 10;
            if (content.includes('## ')) score += 10;
            if (excerpt.length > 50) score += 20;
            if (tags.length > 3) score += 10;

            return { wordCount, readTime, score: Math.min(score, 100) };
        }, [content, title, excerpt, tags]);

        const storageKey = initialNote
            ? `draft_post_${initialNote.id}`
            : `draft_new_${initialType}`;

        // Check if this is a resume content type
        const isResumeContent =
            initialType &&
            [
                'experience',
                'project',
                'education',
                'skill',
                'certification',
                'award',
                'testimonial',
                'language',
                'strength',
            ].includes(initialType);

        useEffect(() => {
            if (isOpen) {
                const savedDraft = localStorage.getItem(storageKey);
                if (savedDraft) {
                    setDraftAvailable(true);
                }

                if (initialNote) {
                    setTitle(initialNote.title);
                    setSlug(initialNote.slug || ''); // Provide fallback for resume content
                    setContent(initialNote.content);
                    setTags(initialNote.tags.join(', '));
                    setStatus(initialNote.status);
                    setDate(
                        initialNote.date
                            ? new Date(initialNote.date).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0]
                    );
                    setExcerpt(initialNote.excerpt || '');

                    setCompany(initialNote.company || '');
                    setLocation(initialNote.location || '');
                    setEndDate(initialNote.endDate || '');
                    setImageUrl(initialNote.imageUrl || '');
                    setRepoUrl(initialNote.repoUrl || '');
                    setLiveUrl(initialNote.liveUrl || '');
                    setViews(initialNote.views || 0);
                    setLikes(initialNote.likes || 0);

                    setSeoTitle(initialNote.seo?.title || '');
                    setSeoDescription(initialNote.seo?.description || '');
                    setSeoKeywords(initialNote.seo?.keywords || '');
                    setCategory(initialNote.category);
                } else {
                    setTitle('');
                    setSlug('');
                    setContent('');
                    setTags('');
                    setStatus('draft');
                    setDate(new Date().toISOString().split('T')[0]);
                    setExcerpt('');

                    setCompany('');
                    setLocation('');
                    setEndDate('');
                    setImageUrl('');
                    setRepoUrl('');
                    setLiveUrl('');
                    setViews(0);
                    setLikes(0);

                    setSeoTitle('');
                    setSeoDescription('');
                    setSeoKeywords('');
                    setCategory(undefined);
                }
                setLastAutoSave(null);
            }
        }, [isOpen, initialNote, initialType, storageKey]);

        useEffect(() => {
            if (!isOpen) return;

            const draftData = {
                title,
                slug,
                content,
                tags,
                status,
                date,
                excerpt,
                company,
                location,
                endDate,
                imageUrl,
                repoUrl,
                liveUrl,
                views,
                likes,
                seo: { title: seoTitle, description: seoDescription, keywords: seoKeywords },
                timestamp: Date.now(),
            };

            const timer = setTimeout(() => {
                if (title || content) {
                    localStorage.setItem(storageKey, JSON.stringify(draftData));
                    setLastAutoSave(new Date());
                }
            }, 1000);

            return () => clearTimeout(timer);
        }, [
            isOpen,
            title,
            slug,
            content,
            tags,
            status,
            date,
            excerpt,
            company,
            location,
            endDate,
            imageUrl,
            repoUrl,
            liveUrl,
            views,
            likes,
            seoTitle,
            seoDescription,
            seoKeywords,
            storageKey,
        ]);

        if (!isOpen) return null;

        const handleRestoreDraft = () => {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const data = JSON.parse(saved);
                    setTitle(data.title || '');
                    setSlug(data.slug || ''); // Provide fallback for resume content
                    setContent(data.content || '');
                    setTags(data.tags || '');
                    setStatus(data.status || 'draft');
                    setDate(data.date || '');
                    setExcerpt(data.excerpt || '');
                    setCompany(data.company || '');
                    setLocation(data.location || '');
                    setEndDate(data.endDate || '');
                    setImageUrl(data.imageUrl || '');
                    setRepoUrl(data.repoUrl || '');
                    setLiveUrl(data.liveUrl || '');
                    setViews(data.views || 0);
                    setLikes(data.likes || 0);

                    setSeoTitle(data.seo?.title || '');
                    setSeoDescription(data.seo?.description || '');
                    setSeoKeywords(data.seo?.keywords || '');

                    setDraftAvailable(false);
                    setLastAutoSave(new Date(data.timestamp));
                }
            } catch (e) {
                console.error('Failed to restore draft', e);
            }
        };

        const handleDiscardDraft = () => {
            localStorage.removeItem(storageKey);
            setDraftAvailable(false);
        };

        const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setIsImageUploading(true);
                try {
                    const url = await onImageUpload(file);
                    setImageUrl(url);
                } catch (error) {
                    console.error('Upload failed', error);
                } finally {
                    setIsImageUploading(false);
                }
            }
        };

        const insertFormat = (startTag: string, endTag: string = '') => {
            const textarea = document.getElementById('mdx-textarea') as HTMLTextAreaElement;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const newContent = `${before}${startTag}${selection}${endTag}${after}`;
            setContent(newContent);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + startTag.length, end + startTag.length);
            }, 0);
        };

        const handleAiPolish = async () => {
            if (!content) return;
            setIsAiLoading(true);
            try {
                const polished = await polishContent(content);
                setContent(polished);
            } finally {
                setIsAiLoading(false);
            }
        };

        const handleAiPolishExcerpt = async () => {
            if (!excerpt) return;
            setIsAiExcerptLoading(true);
            try {
                const polished = await polishText(excerpt);
                setExcerpt(polished);
            } finally {
                setIsAiExcerptLoading(false);
            }
        };

        const handleAiTags = async () => {
            if (!content && !title) return;
            setIsTagGenerating(true);
            try {
                const newTags = await generateTags(content, title);
                if (newTags.length > 0) {
                    setTags(newTags.join(', '));
                }
            } finally {
                setIsTagGenerating(false);
            }
        };

        const handleSave = () => {
            const tagArray = tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            const postData: Partial<Note> = {
                title,
                slug,
                content,
                tags: tagArray,
                status,
                date,
                excerpt,
                type: initialNote?.type || initialType,
                company,
                location,
                endDate,
                imageUrl,
                repoUrl,
                liveUrl,
                views,
                likes,
                category,
                seo: {
                    title: seoTitle,
                    description: seoDescription,
                    keywords: seoKeywords,
                },
            };

            localStorage.removeItem(storageKey);
            onSave(postData);
        };

        const renderDynamicFields = () => {
            const type = initialNote?.type || initialType;

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    {(type === ContentType.PROJECT || type === ContentType.NOTE) && (
                        <>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Category
                                </label>
                                <div className="relative flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors">
                                    <Cylinder size={14} className="absolute left-3 text-zinc-400" />
                                    <select
                                        value={category?.id || ''}
                                        onChange={(e) => {
                                            const selectedId = parseInt(e.target.value);
                                            const selected = categories.find(
                                                (c) => c.id === selectedId
                                            );
                                            setCategory(selected);
                                        }}
                                        className="w-full bg-transparent border-none py-2 pl-10 pr-8 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-zinc-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {(type === ContentType.PROJECT || type === ContentType.NOTE) && (
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                Cover Image
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <ImageIcon size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                        placeholder="https://... or upload image"
                                    />
                                </div>
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <button
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    disabled={isImageUploading}
                                    className="flex items-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isImageUploading ? (
                                        <>
                                            <Loader2 size={14} className="mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={14} className="mr-2" />
                                            Upload
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Project Specific */}
                    {type === ContentType.PROJECT && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Repo URL
                                </label>
                                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <Github size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="text"
                                        value={repoUrl}
                                        onChange={(e) => setRepoUrl(e.target.value)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                        placeholder="https://github.com..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Live URL
                                </label>
                                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <Globe size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="text"
                                        value={liveUrl}
                                        onChange={(e) => setLiveUrl(e.target.value)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Engagement Metrics for Projects & Notes */}
                    {type === ContentType.NOTE && (
                        <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Views
                                </label>
                                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <Eye size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="number"
                                        value={views}
                                        onChange={(e) => setViews(parseInt(e.target.value) || 0)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Likes
                                </label>
                                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <Heart size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="number"
                                        value={likes}
                                        onChange={(e) => setLikes(parseInt(e.target.value) || 0)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Experience / Education / Certs */}
                    {(type === ContentType.EXPERIENCE ||
                        type === ContentType.EDUCATION ||
                        type === ContentType.CERTIFICATION ||
                        type === ContentType.AWARD) && (
                        <>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    {type === ContentType.EDUCATION
                                        ? 'Institution'
                                        : type === ContentType.CERTIFICATION
                                          ? 'Issuer'
                                          : 'Company / Organization'}
                                </label>
                                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <Building2 size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {(type === ContentType.EXPERIENCE ||
                                type === ContentType.EDUCATION) && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                            Location
                                        </label>
                                        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                            <MapPin size={14} className="text-zinc-400 mr-2" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                            End Date (or 'Present')
                                        </label>
                                        <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                            <Calendar size={14} className="text-zinc-400 mr-2" />
                                            <input
                                                type="text"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                                placeholder="e.g. Present, 2024-05..."
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {type === ContentType.CERTIFICATION && (
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                        Credential URL
                                    </label>
                                    <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                        <Link size={14} className="text-zinc-400 mr-2" />
                                        <input
                                            type="text"
                                            value={liveUrl}
                                            onChange={(e) => setLiveUrl(e.target.value)}
                                            className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Skills / Languages */}
                    {(type === ContentType.SKILL || type === ContentType.LANGUAGE) && (
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase flex justify-between">
                                <span>Proficiency</span>
                                <span className="text-zinc-900 dark:text-white">{views}%</span>
                            </label>
                            <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 transition-colors">
                                <Percent size={14} className="text-zinc-400 mr-3" />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={views}
                                    onChange={(e) => setViews(parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Testimonials */}
                    {type === ContentType.TESTIMONIAL && (
                        <>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Author Info / Role
                                </label>
                                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                    <Building2 size={14} className="text-zinc-400 mr-2" />
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                        placeholder="e.g. CTO, TechCorp"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                    Author Image URL
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 transition-colors">
                                        <ImageIcon size={14} className="text-zinc-400 mr-2" />
                                        <input
                                            type="text"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="flex-1 bg-transparent border-none py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        id="author-image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <button
                                        onClick={() =>
                                            document.getElementById('author-image-upload')?.click()
                                        }
                                        disabled={isImageUploading}
                                        className="flex items-center px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isImageUploading ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Upload size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            );
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white dark:bg-zinc-950 w-full max-w-7xl h-[95vh] rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative transition-colors">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                {initialNote ? 'Edit' : 'New'}{' '}
                                {initialType
                                    ? `${initialType.charAt(0).toUpperCase() + initialType.slice(1)}`
                                    : 'NOTE'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Fill in the details below. Markdown supported.
                                </p>
                                {lastAutoSave && (
                                    <span className="text-[10px] text-zinc-500 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                                        Autosaved{' '}
                                        {lastAutoSave.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                            >
                                <Save size={16} className="mr-2" />
                                Save
                            </button>
                            <button
                                onClick={onCancel}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Draft Restore Banner */}
                    {draftAvailable && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-900/30 px-6 py-2 flex items-center justify-between animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-medium">
                                <AlertTriangle size={14} />
                                <span>Unsaved draft found from previous session.</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRestoreDraft}
                                    className="flex items-center text-xs text-amber-600 dark:text-amber-300 hover:text-amber-800 dark:hover:text-white transition-colors font-medium"
                                >
                                    <RotateCcw size={12} className="mr-1" />
                                    Restore
                                </button>
                                <button
                                    onClick={handleDiscardDraft}
                                    className="flex items-center text-xs text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <Trash size={12} className="mr-1" />
                                    Discard
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Basic Meta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                            Title / Name
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                                if (!initialNote)
                                                    setSlug(
                                                        e.target.value
                                                            .toLowerCase()
                                                            .replace(/[^a-z0-9]+/g, '-')
                                                            .replace(/^-+|-+$/g, '')
                                                    );
                                            }}
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors placeholder-zinc-400 dark:placeholder-zinc-600"
                                            placeholder="Enter title..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                                Slug
                                            </label>
                                            <input
                                                type="text"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="block text-xs font-semibold text-zinc-500 uppercase">
                                                Tags
                                            </label>
                                            <button
                                                onClick={handleAiTags}
                                                disabled={isTagGenerating || (!content && !title)}
                                                className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center hover:underline disabled:opacity-50"
                                            >
                                                <Sparkles
                                                    size={10}
                                                    className={`mr-1 ${isTagGenerating ? 'animate-spin' : ''}`}
                                                />
                                                Auto-Generate
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
                                            placeholder="react, design, api..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                            Status
                                        </label>
                                        <div className="flex bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 p-1 transition-colors">
                                            {(['draft', 'published', 'archived'] as const).map(
                                                (s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setStatus(s)}
                                                        className={`flex-1 py-1.5 text-xs font-medium rounded capitalize transition-colors ${status === s ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-transparent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {renderDynamicFields()}

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase">
                                        Excerpt / Short Description
                                    </label>
                                    <button
                                        onClick={handleAiPolishExcerpt}
                                        disabled={isAiExcerptLoading || !excerpt}
                                        className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center hover:underline disabled:opacity-50"
                                    >
                                        <Wand2
                                            size={10}
                                            className={`mr-1 ${isAiExcerptLoading ? 'animate-spin' : ''}`}
                                        />
                                        Polish Text
                                    </button>
                                </div>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none h-20 leading-relaxed transition-colors"
                                    placeholder="Brief summary..."
                                />
                            </div>

                            {/* SEO Section - Collapsible or dedicated area */}
                            {!isResumeContent && (
                                <details className="group border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900/30">
                                    <summary className="flex items-center justify-between p-3 cursor-pointer select-none hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Search size={14} className="text-orange-500" />
                                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                                                SEO Settings
                                            </span>
                                        </div>
                                        <span className="text-zinc-400 group-open:rotate-180 transition-transform">
                                            ▼
                                        </span>
                                    </summary>
                                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                                Meta Title
                                            </label>
                                            <input
                                                type="text"
                                                value={seoTitle}
                                                onChange={(e) => setSeoTitle(e.target.value)}
                                                placeholder={title}
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                                Meta Description
                                            </label>
                                            <textarea
                                                value={seoDescription}
                                                onChange={(e) => setSeoDescription(e.target.value)}
                                                placeholder={
                                                    excerpt || 'Search engine description...'
                                                }
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 resize-none h-16"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                                Keywords (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={seoKeywords}
                                                onChange={(e) => setSeoKeywords(e.target.value)}
                                                placeholder={tags}
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </details>
                            )}

                            {/* Editor Area */}
                            {true && (
                                <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 h-[600px] min-h-[400px] resize-y transition-colors">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0 transition-colors">
                                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                                            <button
                                                onClick={() => insertFormat('**', '**')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Bold"
                                            >
                                                <Bold size={16} />
                                            </button>
                                            <button
                                                onClick={() => insertFormat('*', '*')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Italic"
                                            >
                                                <Italic size={16} />
                                            </button>
                                            <button
                                                onClick={() => insertFormat('### ')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Heading 3"
                                            >
                                                <Hash size={16} />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 mx-2" />
                                            <button
                                                onClick={() => insertFormat('- ')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="List"
                                            >
                                                <List size={16} />
                                            </button>
                                            <button
                                                onClick={() => insertFormat('```\n', '\n```')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Code Block"
                                            >
                                                <Terminal size={16} />
                                            </button>
                                            <button
                                                onClick={() => insertFormat('`', '`')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Inline Code"
                                            >
                                                <Code size={16} />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 mx-2" />
                                            <button
                                                onClick={() => insertFormat('[', '](url)')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Link"
                                            >
                                                <LinkIcon size={16} />
                                            </button>
                                            <button
                                                onClick={() => insertFormat('![alt](', ')')}
                                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                                                title="Image"
                                            >
                                                <ImageIcon size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleAiPolish}
                                                disabled={isAiLoading || !content}
                                                className="flex items-center px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded hover:bg-purple-200 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50"
                                            >
                                                <Wand2
                                                    size={12}
                                                    className={`mr-1.5 ${isAiLoading ? 'animate-spin' : ''}`}
                                                />
                                                AI Polish
                                            </button>
                                            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded p-0.5 border border-zinc-200 dark:border-zinc-800">
                                                <button
                                                    onClick={() => setIsPreview(false)}
                                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${!isPreview ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-transparent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                                                >
                                                    Write
                                                </button>
                                                <button
                                                    onClick={() => setIsPreview(true)}
                                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${isPreview ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-transparent' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative bg-white dark:bg-zinc-950 overflow-hidden transition-colors">
                                        {!isPreview ? (
                                            <textarea
                                                id="mdx-textarea"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                className="w-full h-full bg-white dark:bg-zinc-950 p-6 text-sm font-mono text-zinc-800 dark:text-zinc-300 focus:outline-none resize-none leading-relaxed transition-colors"
                                                placeholder="# Start writing your MDX content..."
                                                spellCheck={false}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 p-8 overflow-y-auto bg-white dark:bg-zinc-950 transition-colors">
                                                <article className="max-w-none">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={MarkdownComponents}
                                                    >
                                                        {content || '*No content to preview*'}
                                                    </ReactMarkdown>
                                                </article>
                                            </div>
                                        )}
                                    </div>

                                    {/* Editor Footer */}
                                    <div className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-4 py-1.5 flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center">
                                                <AlignLeft size={12} className="mr-1.5" />
                                                {stats.wordCount} words
                                            </span>
                                            <span className="flex items-center">
                                                <Clock size={12} className="mr-1.5" />
                                                {stats.readTime} min read
                                            </span>
                                            <div
                                                className="flex items-center gap-1.5"
                                                title="Content Quality Score"
                                            >
                                                <Activity
                                                    size={12}
                                                    className={
                                                        stats.score > 70
                                                            ? 'text-green-500'
                                                            : stats.score > 40
                                                              ? 'text-yellow-500'
                                                              : 'text-red-500'
                                                    }
                                                />
                                                <span className="font-medium">
                                                    Score: {stats.score}/100
                                                </span>
                                            </div>
                                        </div>
                                        <span className="hidden sm:inline">Markdown Supported</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
