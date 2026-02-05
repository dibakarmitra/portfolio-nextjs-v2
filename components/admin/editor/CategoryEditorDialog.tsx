import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { X, Save, Loader2 } from 'lucide-react';

interface CategoryEditorDialogProps {
    isOpen: boolean;
    initialCategory?: Category | null;
    onSave: (category: Partial<Category>) => void;
    onCancel: () => void;
}

export const CategoryEditorDialog: React.FC<CategoryEditorDialogProps> = ({
    isOpen,
    initialCategory,
    onSave,
    onCancel,
}) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#3b82f6'); // Default blue
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialCategory) {
                setName(initialCategory.name);
                setSlug(initialCategory.slug);
                setDescription(initialCategory.description || '');
                setColor(initialCategory.color || '#3b82f6');
                setSortOrder(initialCategory.sortOrder || 0);
                setIsActive(initialCategory.isActive);
            } else {
                setName('');
                setSlug('');
                setDescription('');
                setColor('#3b82f6');
                setSortOrder(0);
                setIsActive(true);
            }
        }
    }, [isOpen, initialCategory]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                name,
                slug,
                description,
                color,
                sortOrder,
                isActive,
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {initialCategory ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-zinc-900 dark:text-zinc-100"
                            placeholder="e.g. Development"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                            Slug
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-zinc-900 dark:text-zinc-100"
                            placeholder="e.g. development"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-zinc-900 dark:text-zinc-100 min-h-[80px] resize-none"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                Color
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                                />
                                <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                                    {color}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
                            id="category-active"
                        />
                        <label
                            htmlFor="category-active"
                            className="text-sm text-zinc-700 dark:text-zinc-300"
                        >
                            Active
                        </label>
                    </div>
                </div>

                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name || isSaving}
                        className="flex items-center px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving ? (
                            <Loader2 size={14} className="mr-2 animate-spin" />
                        ) : (
                            <Save size={14} className="mr-2" />
                        )}
                        Save Category
                    </button>
                </div>
            </div>
        </div>
    );
};
