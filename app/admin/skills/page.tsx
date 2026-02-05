'use client';

import React from 'react';
import { SkillsPage as Skills } from '@/components/admin/pages/SkillsPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function SkillsPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const skills = getResumeContentsByType(ResumeContentType.SKILL);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Skill status updated to ${newStatus}`, 'info');
    };

    return (
        <Skills
            skills={skills}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
