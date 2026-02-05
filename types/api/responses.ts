/**
 * API Response Types
 * Standard response wrappers and pagination types
 */

/**
 * API Error interface
 */
export interface ApiError {
    message: string;
    code?: string;
}

/**
 * Generic API Response
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    status: number;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

/**
 * Generic Response Wrapper
 */
export interface ResponseWrapper<T> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: PaginationMeta;
}

/**
 * Paginated list response
 */
export interface PaginatedList<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/**
 * Legacy Paginated Response (for backward compatibility)
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'file';
    size: string;
    date: string;
}

/**
 * Delete Response
 */
export interface DeletePostResponse {
    success: boolean;
    message: string;
}
