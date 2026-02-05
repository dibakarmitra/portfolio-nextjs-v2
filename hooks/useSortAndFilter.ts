import { useState, useMemo } from 'react';

interface Config<T> {
    searchFields: (keyof T)[];
    filterField?: keyof T;
    itemsPerPage?: number;
    initialSort?: string;
    defaultSortField?: keyof T;
}

export function useSortAndFilter<T extends Record<string, any>>(data: T[], config: Config<T>) {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>(config.initialSort || 'newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = config.itemsPerPage || 6;

    const filteredItems = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data
            .filter((item) => {
                const matchesSearch = config.searchFields.some((field) => {
                    const value = item[field];
                    if (Array.isArray(value)) {
                        return value.some((v: any) =>
                            String(v).toLowerCase().includes(search.toLowerCase())
                        );
                    }
                    return String(value).toLowerCase().includes(search.toLowerCase());
                });

                const matchesFilter =
                    filterStatus === 'all' ||
                    (config.filterField && item[config.filterField] === filterStatus);

                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => {
                if (sortBy === 'newest')
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                if (sortBy === 'oldest')
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                if (sortBy === 'views' || sortBy === 'proficiency' || sortBy === 'popular')
                    return (b.views || 0) - (a.views || 0);
                if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
                if (sortBy === 'size') return parseInt(b.size || '0') - parseInt(a.size || '0');
                return 0;
            });
    }, [data, search, filterStatus, sortBy, config.searchFields, config.filterField]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

    const handleSearch = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };
    const handleFilter = (val: string) => {
        setFilterStatus(val);
        setCurrentPage(1);
    };
    const handleSort = (val: string) => {
        setSortBy(val);
        setCurrentPage(1);
    };

    return {
        search,
        setSearch: handleSearch,
        filterStatus,
        setFilterStatus: handleFilter,
        sortBy,
        setSortBy: handleSort,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        currentItems,
        filteredItems,
    };
}
