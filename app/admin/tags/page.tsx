'use client';

import React, { useState, useEffect } from 'react';
import { TagsPage } from '@/components/admin/pages/TagsPage';
import { useContextState } from '@/context';
import { Tag } from '@/types';

export default function TagsPageRoute() {
    const { addToast } = useContextState();
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTags = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/tags');
            const data = await res.json();
            if (data.success) {
                setTags(data.data);
            } else {
                addToast('Failed to fetch tags', 'error');
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
            addToast('Error fetching tags', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleSave = async (tag: Partial<Tag>) => {
        try {
            const isNew = !tag.id;
            const url = isNew ? '/api/tags' : `/api/tags/${tag.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tag),
            });

            const result = await res.json();

            if (result.success) {
                addToast(result.message || (isNew ? 'Tag created' : 'Tag updated'), 'success');
                fetchTags();
            } else {
                addToast(result.error?.message || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving tag:', error);
            addToast('Error saving tag', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;

        try {
            const res = await fetch(`/api/tags/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (result.success) {
                addToast('Tag deleted', 'success');
                fetchTags();
            } else {
                addToast(result.error?.message || 'Delete failed', 'error');
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            addToast('Error deleting tag', 'error');
        }
    };

    return <TagsPage tags={tags} onSave={handleSave} onDelete={handleDelete} />;
}
