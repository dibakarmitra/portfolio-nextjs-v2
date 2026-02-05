'use client';

import React from 'react';
import { CertificationsPage as Certifications } from '@/components/admin/pages/CertificationsPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function CertificationsPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const certifications = getResumeContentsByType(ResumeContentType.CERTIFICATION);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Certification status updated to ${newStatus}`, 'info');
    };

    return (
        <Certifications
            certifications={certifications}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
