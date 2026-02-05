'use client';

import React from 'react';
import { TestimonialsPage as Testimonials } from '@/components/admin/pages/TestimonialsPage';
import { useContextState } from '@/context';
import { ResumeContentType } from '@/types';

export default function TestimonialsPageRoute() {
    const {
        getResumeContentsByType,
        addToast,
        handleEdit,
        handleNew,
        handleDelete,
        refreshResumeContents,
        updateResumeContentStatus,
    } = useContextState();

    const testimonials = getResumeContentsByType(ResumeContentType.TESTIMONIAL);

    const handleStatusChange = (id: string, newStatus: any) => {
        updateResumeContentStatus(Number(id), newStatus);
        addToast(`Testimonial status updated to ${newStatus}`, 'info');
    };

    return (
        <Testimonials
            testimonials={testimonials}
            onEdit={handleEdit}
            onNew={handleNew}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
        />
    );
}
