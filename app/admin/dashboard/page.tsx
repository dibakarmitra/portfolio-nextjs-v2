'use client';

import React from 'react';
import { DashboardPage as Dashboard } from '@/components/admin/pages/DashboardPage';
import { useContextState } from '@/context';

export default function DashboardPageRoute() {
    const { notes, setNotes, addToast, handleEdit, handleNew, handleDelete } = useContextState();

    const handleStatusChange = (id: string, newStatus: any) => {
        setNotes((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
        const note = notes.find((p) => p.id === id);
        addToast(
            `${note?.title || 'Item'} ${newStatus === 'published' ? 'published' : 'unpublished'}`,
            'info'
        );
    };

    return (
        <Dashboard
            data={notes}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
