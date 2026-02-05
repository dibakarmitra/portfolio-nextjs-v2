'use client';

import React from 'react';
import { AwardsPage as Awards } from '@/components/admin/pages/AwardsPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function AwardsPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const awards = getResumeContentsByType(ResumeContentType.AWARD);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Award status updated to ${newStatus}`, 'info');
    };

    return (
        <Awards
            awards={awards}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
