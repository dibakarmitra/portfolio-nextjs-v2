'use client';

import React from 'react';
import { ProjectsPage as Projects } from '@/components/admin/pages/ProjectsPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function ProjectsPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const projects = getResumeContentsByType(ResumeContentType.PROJECT);

    const handleStatusChange = (id: string | number, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Project status updated to ${newStatus}`, 'info');
    };

    return (
        <Projects
            projects={projects}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
