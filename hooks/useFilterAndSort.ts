import { useMemo } from 'react';
import { Note } from '@/types';

interface UseFilterAndSortOptions {
    data: Note[];
    searchValue: string;
    filterValue?: string;
    sortValue?: string;
    searchFields?: (keyof Note)[];
}

export const useFilterAndSort = ({
    data,
    searchValue,
    filterValue,
    sortValue,
    searchFields = ['title', 'slug'],
}: UseFilterAndSortOptions) => {
    const filteredData = useMemo(() => {
        let filtered = data;

        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            filtered = filtered.filter((post) =>
                searchFields.some((field) => {
                    const fieldValue = post[field];
                    return (
                        fieldValue &&
                        typeof fieldValue === 'string' &&
                        fieldValue.toLowerCase().includes(searchLower)
                    );
                })
            );
        }

        if (filterValue) {
            filtered = filtered.filter((post) => post.status === filterValue);
        }

        return filtered;
    }, [data, searchValue, filterValue, searchFields]);

    const sortedData = useMemo(() => {
        if (!sortValue) return filteredData;

        return [...filteredData].sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'date-asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'views-desc':
                    return (b.views || 0) - (a.views || 0);
                case 'views-asc':
                    return (a.views || 0) - (b.views || 0);
                default:
                    return 0;
            }
        });
    }, [filteredData, sortValue]);

    return { filteredData, sortedData };
};
