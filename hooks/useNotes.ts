'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/types';

interface Pagination {
    totalPosts: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export function useNotes(
    page: number = 1,
    limit: number = 10,
    filters?: { search?: string; category?: string }
) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalPosts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: limit,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.category) queryParams.append('category', filters.category);

            const res = await fetch(`/api/published-notes?${queryParams.toString()}`);
            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    setNotes(result.data || []);
                    if (result.meta) {
                        setPagination({
                            totalPosts: result.meta.total || 0,
                            totalPages: Math.ceil((result.meta.total || 0) / limit),
                            currentPage: result.meta.page || 1,
                            pageSize: result.meta.limit || limit,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, filters?.search, filters?.category]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const getNoteBySlug = async (slug: string): Promise<Note | null> => {
        try {
            const res = await fetch(`/api/notes/slug/${slug}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.error('Failed to fetch note:', error);
            return null;
        }
    };

    return {
        notes,
        pagination,
        isLoading,
        getNoteBySlug,
    };
}
