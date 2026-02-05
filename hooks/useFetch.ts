import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';

interface UseFetchOptions {
    skip?: boolean;
    refetchInterval?: number;
    cache?: boolean;
}

interface UseFetchState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isFetching: boolean;
}

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFetch<T = any>(
    url: string | null,
    options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => Promise<void> } {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        error: null,
        isLoading: true,
        isFetching: false,
    });

    const refetch = useCallback(async () => {
        if (!url) return;

        setState((prev) => ({ ...prev, isFetching: true }));

        try {
            if (options.cache) {
                const cached = cache.get(url);
                if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                    setState({
                        data: cached.data,
                        error: null,
                        isLoading: false,
                        isFetching: false,
                    });
                    return;
                }
            }

            const response = await apiClient.get<T>(url);

            if (response.success) {
                if (options.cache) {
                    cache.set(url, { data: response.data ?? null, timestamp: Date.now() });
                }
                setState({
                    data: response.data ?? null,
                    error: null,
                    isLoading: false,
                    isFetching: false,
                });
            } else {
                const error = new Error(response.error?.message || 'Fetch failed');
                setState({ data: null, error, isLoading: false, isFetching: false });
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Fetch failed');
            setState({ data: null, error, isLoading: false, isFetching: false });
        }
    }, [url, options]);

    useEffect(() => {
        if (options.skip || !url) {
            setState({ data: null, error: null, isLoading: false, isFetching: false });
            return;
        }

        refetch();

        if (options.refetchInterval) {
            const interval = setInterval(refetch, options.refetchInterval);
            return () => clearInterval(interval);
        }
    }, [url, options, refetch]);

    return { ...state, refetch };
}
