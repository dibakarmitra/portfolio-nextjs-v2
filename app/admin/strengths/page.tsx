'use client';

import React from 'react';
import { StrengthsPage as Strengths } from '@/components/admin/pages/StrengthsPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function StrengthsPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const strengths = getResumeContentsByType(ResumeContentType.STRENGTH);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Strength status updated to ${newStatus}`, 'info');
    };

    return (
        <Strengths
            strengths={strengths}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
