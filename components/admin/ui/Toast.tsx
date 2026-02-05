'use client';
import React, { useEffect } from 'react';
import { TOAST_DURATION } from '@/lib/constants';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    const styles = {
        success: {
            icon: <CheckCircle className="text-emerald-500" size={20} />,
            border: 'border-emerald-500/20',
            bg: 'bg-zinc-900',
        },
        error: {
            icon: <XCircle className="text-red-500" size={20} />,
            border: 'border-red-500/20',
            bg: 'bg-zinc-900',
        },
        info: {
            icon: <Info className="text-blue-500" size={20} />,
            border: 'border-blue-500/20',
            bg: 'bg-zinc-900',
        },
        warning: {
            icon: <AlertCircle className="text-amber-400" size={20} />,
            border: 'border-amber-500/20',
            bg: 'bg-zinc-900',
        },
    };

    const style = styles[toast.type];

    return (
        <div
            className={`
      flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg shadow-black/50 
      ${style.bg} ${style.border} text-zinc-200 min-w-[320px] max-w-md
    animate-in slide-in-from-right-full fade-in duration-300
    `}
        >
            {style.icon}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: ToastMessage[];
    onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onClose={onClose} />
                </div>
            ))}
        </div>
    );
};
