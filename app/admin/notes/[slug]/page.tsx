'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostDetailPage } from '@/components/admin/pages/PostDetailPage';
import { useContextState } from '@/context';
import { ContentType, Note } from '@/types';

export default function NoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { notes, handleEdit } = useContextState();
    const [note, setNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.slug && notes.length > 0) {
            const foundNote = notes.find(
                (p) => p.type === ContentType.NOTE && p.slug === params.slug
            );
            setNote(foundNote || null);
            setIsLoading(false);
        } else if (params.slug) {
            setIsLoading(false);
        }
    }, [params.slug, notes]);

    const handleBack = () => {
        router.push('/admin/notes');
    };

    const handleEditNote = (noteToEdit: Note) => {
        handleEdit(noteToEdit);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                        Note Not Found
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        The note you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
                    >
                        Back to Notes
                    </button>
                </div>
            </div>
        );
    }

    return <PostDetailPage post={note} onBack={handleBack} onEdit={handleEditNote} />;
}
