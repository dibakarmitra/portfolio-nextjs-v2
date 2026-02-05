'use client';

import React from 'react';
import { MediaPage as Media } from '@/components/admin/pages/MediaPage';
import { useContextState } from '@/context';
import { MediaItem } from '@/types';

export default function MediaPageRoute() {
    const { addToast } = useContextState();

    const handleUpload = (files: MediaItem[]) => {
        addToast(`${files.length} file(s) uploaded`, 'success');
    };

    const handleDelete = (id: string) => {
        addToast('File deleted', 'success');
    };

    const handleUpdate = (id: string, data: Partial<MediaItem>) => {
        addToast('Media details updated', 'success');
    };

    return <Media onUpload={handleUpload} onDelete={handleDelete} onUpdate={handleUpdate} />;
}
