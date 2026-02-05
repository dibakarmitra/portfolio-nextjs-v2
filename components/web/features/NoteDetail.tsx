import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '@/types/web';
import FadeIn from '../ui/FadeIn';

interface NoteDetailProps {
    note: Note;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ note }) => {
    return (
        <div className="pt-12 pb-12 min-h-screen">
            <article className="max-w-3xl mx-auto px-6">
                <FadeIn>
                    <Link
                        href="/notes"
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-8"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Notes
                    </Link>

                    {note.image && (
                        <div className="relative w-full aspect-[2/1] mb-8 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                            <Image
                                src={note.image}
                                alt={note.title}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                priority
                            />
                        </div>
                    )}

                    <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {note.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">
                            {note.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span>
                                    {note.date ? new Date(note.date).toLocaleDateString() : ''}
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="lead text-lg text-zinc-600 dark:text-zinc-300 mb-6 font-medium italic">
                            {note.excerpt ||
                                (note as any).summary ||
                                (note as any).description ||
                                ''}
                        </p>

                        <div className="mb-8">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => (
                                        <h1
                                            className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-100"
                                            {...props}
                                        />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2
                                            className="text-xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2"
                                            {...props}
                                        />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3
                                            className="text-lg font-bold mt-6 mb-3 text-zinc-900 dark:text-zinc-100"
                                            {...props}
                                        />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p
                                            className="mb-4 text-zinc-800 dark:text-zinc-300 leading-relaxed"
                                            {...props}
                                        />
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="font-medium text-zinc-900 dark:text-zinc-100 underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul
                                            className="list-disc list-inside space-y-1 my-4 pl-4 text-zinc-700 dark:text-zinc-300"
                                            {...props}
                                        />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol
                                            className="list-decimal list-inside space-y-1 my-4 pl-4 text-zinc-700 dark:text-zinc-300"
                                            {...props}
                                        />
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-6 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 py-2 pr-2 rounded-r"
                                            {...props}
                                        />
                                    ),
                                    code: ({ className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const isInline = !match && !className;
                                        return !isInline ? (
                                            <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto my-6 border border-zinc-200 dark:border-zinc-800 text-sm font-mono shadow-sm">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        ) : (
                                            <code
                                                className="bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    img: ({ node, ...props }) => (
                                        <img
                                            className="rounded-lg border border-zinc-200 dark:border-zinc-800 my-8 w-full h-auto shadow-md"
                                            alt={props.alt || 'Note image'}
                                            {...props}
                                        />
                                    ),
                                }}
                            >
                                {note.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {note.link && (
                        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <a
                                href={note.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
                            >
                                Read on Original Platform <ExternalLink size={14} />
                            </a>
                        </div>
                    )}
                </FadeIn>
            </article>
        </div>
    );
};

export default NoteDetail;
