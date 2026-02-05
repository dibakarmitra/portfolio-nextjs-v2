import { useState } from 'react';
import { logAction } from './utils';

export interface DialogsState {
    deleteId: string | number | null;
    setDeleteId: (id: string | number | null) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (val: boolean) => void;
    handleDelete: (id: string | number) => void;
    confirmDelete: () => void;
    cancelDelete: () => void;
}

export const useDialogs = (): DialogsState => {
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = (id: string | number) => {
        logAction('dialogs-manager', `Opening delete dialog for: ${id}`, { id });
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            // Actual deletion logic would be handled by the parent component
            logAction('dialogs-manager', `Confirmed delete: ${deleteId}`, { id: deleteId });
            setDeleteId(null);
            setIsDeleteDialogOpen(false);
        }
    };

    const cancelDelete = () => {
        setDeleteId(null);
        setIsDeleteDialogOpen(false);
    };

    return {
        deleteId,
        setDeleteId,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        handleDelete,
        confirmDelete,
        cancelDelete,
    };
};
