'use client';

import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AlertCircle } from 'lucide-react';

export interface FilterFormFields {
    [key: string]: string | boolean | number;
}

interface FilterFormProps {
    fields: {
        name: string;
        label: string;
        type?: 'text' | 'select' | 'checkbox' | 'date';
        options?: { label: string; value: string }[];
        placeholder?: string;
    }[];
    onFilter: (filters: FilterFormFields) => void;
    onReset?: () => void;
    isLoading?: boolean;
}

export const FilterForm: React.FC<FilterFormProps> = ({
    fields,
    onFilter,
    onReset,
    isLoading = false,
}) => {
    const [values, setValues] = useState<FilterFormFields>(
        fields.reduce(
            (acc, field) => ({
                ...acc,
                [field.name]: field.type === 'checkbox' ? false : '',
            }),
            {}
        )
    );

    const handleChange = (name: string, value: string | boolean | number) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const activeFilters = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== '' && v !== false)
        );
        onFilter(activeFilters);
    };

    const handleReset = () => {
        setValues(
            fields.reduce(
                (acc, field) => ({
                    ...acc,
                    [field.name]: field.type === 'checkbox' ? false : '',
                }),
                {}
            )
        );
        onReset?.();
    };

    return (
        <Card className="p-4">
            <form onSubmit={handleFilter} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                {field.label}
                            </label>

                            {field.type === 'select' && field.options ? (
                                <select
                                    value={values[field.name] as string}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">{field.placeholder || 'Select...'}</option>
                                    {field.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    checked={values[field.name] as boolean}
                                    onChange={(e) => handleChange(field.name, e.target.checked)}
                                    disabled={isLoading}
                                    className="w-5 h-5 rounded"
                                />
                            ) : (
                                <FormField
                                    label={field.label}
                                    type={field.type || 'text'}
                                    value={values[field.name] as string}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    disabled={isLoading}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 justify-end pt-2">
                    {onReset && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        Apply Filters
                    </Button>
                </div>
            </form>
        </Card>
    );
};
