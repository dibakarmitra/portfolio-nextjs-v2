'use client';

import React, { useState, useEffect } from 'react';
import { CategoriesPage } from '@/components/admin/pages/CategoriesPage';
import { useContextState } from '@/context';
import { Category } from '@/types';

export default function CategoriesPageRoute() {
    const { addToast } = useContextState();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            } else {
                addToast('Failed to fetch categories', 'error');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            addToast('Error fetching categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (category: Partial<Category>) => {
        try {
            const isNew = !category.id;
            const url = isNew ? '/api/categories' : `/api/categories/${category.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });

            const result = await res.json();

            if (result.success) {
                addToast(
                    result.message || (isNew ? 'Category created' : 'Category updated'),
                    'success'
                );
                fetchCategories();
            } else {
                addToast(result.error?.message || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            addToast('Error saving category', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (result.success) {
                addToast('Category deleted', 'success');
                fetchCategories();
            } else {
                addToast(result.error?.message || 'Delete failed', 'error');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            addToast('Error deleting category', 'error');
        }
    };

    return <CategoriesPage categories={categories} onSave={handleSave} onDelete={handleDelete} />;
}
