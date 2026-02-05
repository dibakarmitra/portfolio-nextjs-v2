'use client';

import React from 'react';
import { LanguagesPage as Languages } from '@/components/admin/pages/LanguagesPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function LanguagesPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const languages = getResumeContentsByType(ResumeContentType.LANGUAGE);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Language status updated to ${newStatus}`, 'info');
    };

    return (
        <Languages
            languages={languages}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
