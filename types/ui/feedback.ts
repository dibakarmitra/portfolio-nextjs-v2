/**
 * Feedback UI Types
 * Toast notifications and user feedback types
 */

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast notification message
 */
export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}
