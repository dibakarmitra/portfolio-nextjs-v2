'use client';

import React from 'react';
import { ExperiencePage as Experience } from '@/components/admin/pages/ExperiencePage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function ExperiencePageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        isResumeLoading,
        updateResumeContentStatus,
    } = useContextState();

    const experiences = getResumeContentsByType(ResumeContentType.EXPERIENCE);

    if (isResumeLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-900 dark:border-white" />
                    <span>Loading experience...</span>
                </div>
            </div>
        );
    }

    const handleStatusChange = (id: string | number, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Experience status updated to ${newStatus}`, 'info');
    };

    // Convert ResumeContent to Note format for the editor
    const handleEditResume = (resumeContent: any) => {
        // Convert ResumeContent to Note-like format that the editor expects
        const noteLikeData = {
            ...resumeContent,
            // Ensure all required Note fields are present
            slug: resumeContent.slug || '',
            tags: resumeContent.tags || [],
        };
        handleEdit(noteLikeData);
    };

    return (
        <Experience
            experiences={experiences}
            onEdit={handleEditResume}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
