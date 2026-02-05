import { useState } from 'react';
import { ToastMessage } from '@/types';
import { generateToastId } from './utils';

export interface NotificationsState {
    toasts: ToastMessage[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;
}

export const useNotifications = (): NotificationsState => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = generateToastId();
        const newToast: ToastMessage = {
            id,
            message,
            type,
            duration: type === 'error' ? 5000 : 3000,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto-remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, newToast.duration);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, addToast, removeToast };
};
