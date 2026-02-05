'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/layouts/Sidebar';
import { Menu } from 'lucide-react';
import { useContextState } from '@/context';
import { ToastContainer } from '@/components/admin/ui/Toast';
import { NoteEditorDialog } from '@/components/admin/editor';
import { DeleteConfirmDialog } from '@/components/admin/ui/DeleteConfirmDialog';
import { Note, ContentType, MediaItem } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const {
        isAuthenticated,
        userProfile,
        toasts,
        removeToast,
        isEditorOpen,
        setIsEditorOpen,
        editingNote,
        newNoteType,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        deleteId,
        setDeleteId,
        notes,
        setNotes,
        addToast,
        setMediaFiles,
        refreshNotes,
        refreshResumeContents,
    } = useContextState();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                // Determine if this is resume content vs a note
                // Notes still use UUID v7 (string), while resume content now uses integer IDs
                const isResumeContent =
                    typeof deleteId === 'number' ||
                    (!isNaN(Number(deleteId)) && !deleteId.toString().includes('-'));
                const apiUrl = isResumeContent
                    ? `/api/resume/${deleteId}`
                    : `/api/notes/${deleteId}`;

                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (result.success) {
                    // Refresh the appropriate data based on content type
                    if (isResumeContent) {
                        await refreshResumeContents(); // Refresh resume data
                    } else {
                        await refreshNotes(); // Refresh notes data
                    }
                    addToast('Item deleted successfully', 'success');
                } else {
                    addToast(result.error?.message || 'Failed to delete item', 'error');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                addToast('Failed to delete', 'error');
            }
            setDeleteId(null);
        }
        setIsDeleteDialogOpen(false);
    };

    const handleSave = async (data: Partial<Note>) => {
        try {
            // Check if this is a resume content type
            const isResumeContent = Object.values({
                experience: 'experience',
                project: 'project',
                education: 'education',
                skill: 'skill',
                certification: 'certification',
                award: 'award',
                testimonial: 'testimonial',
                language: 'language',
                strength: 'strength',
            }).includes(newNoteType);

            if (isResumeContent) {
                // Handle resume content save
                if (editingNote) {
                    // Update existing resume content
                    const response = await fetch(`/api/resume/${editingNote.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    const result = await response.json();

                    if (result.success) {
                        await refreshResumeContents(); // Refresh resume data
                        addToast('Changes saved successfully', 'success');
                    } else {
                        addToast(result.error?.message || 'Failed to save changes', 'error');
                    }
                } else {
                    // Create new resume content
                    const response = await fetch('/api/resume', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...data,
                            type: newNoteType,
                            status: 'draft',
                        }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        await refreshResumeContents(); // Refresh resume data
                        addToast('New item created successfully', 'success');
                    } else {
                        addToast(result.error?.message || 'Failed to create item', 'error');
                    }
                }
            } else {
                // Handle note save (original logic)
                if (editingNote) {
                    // Update existing note
                    const response = await fetch(`/api/notes/${editingNote.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    const result = await response.json();

                    if (result.success) {
                        await refreshNotes(); // Refresh from API
                        addToast('Changes saved successfully', 'success');
                    } else {
                        addToast(result.error?.message || 'Failed to save changes', 'error');
                    }
                } else {
                    // Create new note
                    const response = await fetch('/api/notes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...data,
                            type: newNoteType,
                            status: 'draft',
                        }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        await refreshNotes(); // Refresh from API
                        addToast('New item created successfully', 'success');
                    } else {
                        addToast(result.error?.message || 'Failed to create item', 'error');
                    }
                }
            }
            setIsEditorOpen(false);
        } catch (error) {
            console.error('Error saving content:', error);
            addToast('Failed to save', 'error');
        }
    };

    const handleEditorImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            addToast('Upload failed', 'error');
            throw new Error('Upload failed');
        }

        const result = await response.json();
        const uploaded: MediaItem | undefined = result?.file;

        if (!uploaded?.url) {
            addToast('Upload failed', 'error');
            throw new Error('Upload failed');
        }

        setMediaFiles((prev) => [uploaded, ...prev]);
        addToast('Image uploaded', 'success');
        return uploaded.url;
    };

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         router.push('/login');
    //     }
    // }, [isAuthenticated, router]);

    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 transition-colors duration-200">
            <Sidebar isMobileOpen={false} />

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
                        <Sidebar isMobileOpen={true} />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 -ml-2 mr-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-zinc-900 dark:text-white">Admin</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400"></div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
                    {children}
                </main>

                <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 text-center text-xs text-zinc-500 dark:text-zinc-600 transition-colors duration-200">
                    &copy; {new Date().getFullYear()} {userProfile.displayName}.
                </footer>
            </div>

            {/* Global Dialogs */}
            <NoteEditorDialog
                isOpen={isEditorOpen}
                initialNote={editingNote}
                initialType={newNoteType}
                onSave={handleSave}
                onCancel={() => setIsEditorOpen(false)}
                onImageUpload={handleEditorImageUpload}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
