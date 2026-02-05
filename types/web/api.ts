/**
 * API response types
 */

export interface PaginationMeta {
    totalPosts: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    pagination?: PaginationMeta;
    error?: string;
    message?: string;
}

export interface NotesApiResponse {
    posts: Array<{
        id: string;
        slug: string;
        title: string;
        date: string;
        excerpt: string;
        tags: string[];
        image?: string;
    }>;
    pagination?: PaginationMeta;
}

export interface SendEmailRequest {
    name: string;
    email: string;
    message: string;
}

export interface SendEmailResponse {
    success: boolean;
    data?: {
        id: string;
    };
    error?: string;
}
