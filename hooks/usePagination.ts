import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
    itemsPerPage?: number;
    initialPage?: number;
}

interface UsePaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export function usePagination<T>(
    items: T[],
    options: UsePaginationOptions = {}
): UsePaginationState & {
    paginatedItems: T[];
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setItemsPerPage: (count: number) => void;
} {
    const itemsPerPage = options.itemsPerPage || 10;
    const [currentPage, setCurrentPage] = useState(options.initialPage || 1);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);

    const goToPage = useCallback(
        (page: number) => {
            const pageNum = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(pageNum);
        },
        [totalPages]
    );

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    return {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        setItemsPerPage: (count: number) => {
            setCurrentPage(1);
        },
    };
}
