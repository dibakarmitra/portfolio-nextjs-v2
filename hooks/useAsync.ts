import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
    status: 'idle' | 'pending' | 'success' | 'error';
    data: T | null;
    error: Error | null;
    isLoading: boolean;
}

interface UseAsyncOptions {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

export function useAsync<T = any>(
    asyncFunction: () => Promise<T>,
    immediate = true,
    options?: UseAsyncOptions
): UseAsyncState<T> & { execute: () => Promise<void> } {
    const [state, setState] = useState<UseAsyncState<T>>({
        status: 'idle',
        data: null,
        error: null,
        isLoading: false,
    });

    const execute = useCallback(async () => {
        setState({ status: 'pending', data: null, error: null, isLoading: true });
        try {
            const response = await asyncFunction();
            setState({ status: 'success', data: response, error: null, isLoading: false });
            options?.onSuccess?.(response);
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState({ status: 'error', data: null, error: err, isLoading: false });
            options?.onError?.(err);
        }
    }, [asyncFunction, options]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { ...state, execute };
}
