'use client';

import React from 'react';
import { EducationPage as Education } from '@/components/admin/pages/EducationPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function EducationPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const education = getResumeContentsByType(ResumeContentType.EDUCATION);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Education status updated to ${newStatus}`, 'info');
    };

    return (
        <Education
            education={education}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
