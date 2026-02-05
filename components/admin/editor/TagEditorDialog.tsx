import React, { useState, useEffect } from 'react';
import { Tag } from '@/types';
import { X, Save, Loader2 } from 'lucide-react';

interface TagEditorDialogProps {
    isOpen: boolean;
    initialTag?: Tag | null;
    onSave: (tag: Partial<Tag>) => void;
    onCancel: () => void;
}

export const TagEditorDialog: React.FC<TagEditorDialogProps> = ({
    isOpen,
    initialTag,
    onSave,
    onCancel,
}) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialTag) {
                setName(initialTag.name);
                setSlug(initialTag.slug);
            } else {
                setName('');
                setSlug('');
            }
        }
    }, [isOpen, initialTag]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                name,
                slug,
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
                        {initialTag ? 'Edit Tag' : 'New Tag'}
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
                            placeholder="e.g. React"
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
                            placeholder="e.g. react"
                        />
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
                        Save Tag
                    </button>
                </div>
            </div>
        </div>
    );
};
