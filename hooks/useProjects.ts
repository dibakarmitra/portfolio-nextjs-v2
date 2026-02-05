'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResumeContent } from '@/types';

interface Pagination {
    totalPosts: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export function useProjects(page: number = 1, limit: number = 10) {
    const [projects, setProjects] = useState<ResumeContent[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalPosts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: limit,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/published-projects?page=${page}&limit=${limit}`);
            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    setProjects(result.data || []);
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
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        pagination,
        isLoading,
    };
}
