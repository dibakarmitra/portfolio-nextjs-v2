'use client';

import React from 'react';
import { NotesPage as Notes } from '@/components/admin/pages/NotesPage';
import { useContextState } from '@/context';
import { ContentType, Post } from '@/types';
import { useRouter } from 'next/navigation';

export default function NotesPageRoute() {
    const {
        notes: contextNotes,
        setNotes,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
    } = useContextState();
    const router = useRouter();

    const filteredNotes = contextNotes.filter((p) => p.type === ContentType.NOTE);

    const handleStatusChange = (id: string, newStatus: any) => {
        setNotes((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
        const note = filteredNotes.find((p) => p.id === id);
        addToast(
            `${note?.title || 'Item'} ${newStatus === 'published' ? 'published' : 'unpublished'}`,
            'info'
        );
    };

    const handleView = (note: Post) => {
        router.push(`/admin/notes/${note.slug}`);
    };

    return (
        <Notes
            notes={filteredNotes}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onView={handleView}
        />
    );
}
