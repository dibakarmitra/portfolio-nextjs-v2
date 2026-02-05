'use client';

import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { AlertCircle, Check } from 'lucide-react';

interface SearchFormProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
    onSearch,
    placeholder = 'Search...',
    isLoading = false,
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
                <FormField
                    label="Search Query"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                Search
            </Button>
            {query && (
                <Button type="button" variant="ghost" onClick={handleClear} disabled={isLoading}>
                    Clear
                </Button>
            )}
        </form>
    );
};
