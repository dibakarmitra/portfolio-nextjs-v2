import { useState, useMemo, useCallback } from 'react';
import { Note, ContentType } from '@/types';
import { logAction } from './utils';

export interface NotesState {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    isEditorOpen: boolean;
    setIsEditorOpen: (val: boolean) => void;
    editingNote: Note | null;
    setEditingNote: (note: Note | null) => void;
    newNoteType: ContentType;
    setNewNoteType: (type: ContentType) => void;
    handleEdit: (note: Note) => void;
    handleNew: (type: ContentType) => void;
    isLoading: boolean;
    refreshNotes: () => Promise<void>;
}

export const useNotes = (): NotesState => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [newNoteType, setNewNoteType] = useState<ContentType>(ContentType.NOTE);

    const refreshNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notes');
            const result = await response.json();

            if (result.success) {
                setNotes(result.data || []);
            } else {
                console.error('Failed to fetch notes:', result.error?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleEdit = useCallback((note: any) => {
        logAction('notes-manager', `Editing note: ${note.title}`, {
            noteId: note.id,
            type: note.type,
            status: note.status,
        });
        setEditingNote(note);
        setNewNoteType(note.type);
        setIsEditorOpen(true);
    }, []);

    const handleNew = useCallback((type: ContentType) => {
        logAction('notes-manager', `Creating new ${type}`, { type });
        setEditingNote(null);
        setNewNoteType(type);
        setIsEditorOpen(true);
    }, []);

    // memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            notes,
            setNotes,
            isEditorOpen,
            setIsEditorOpen,
            editingNote,
            setEditingNote,
            newNoteType,
            setNewNoteType,
            handleEdit,
            handleNew,
            isLoading,
            refreshNotes,
        }),
        [
            notes,
            isEditorOpen,
            editingNote,
            newNoteType,
            isLoading,
            refreshNotes,
            handleEdit,
            handleNew,
        ]
    );

    return contextValue;
};
