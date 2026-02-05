/**
 * API Request Types
 * Request payloads and filter options for API calls
 */

/**
 * Filter and pagination options
 */
export interface FilterOptions {
    searchFields: (keyof import('../domain/content').Note)[];
    filterField?: keyof import('../domain/content').Note;
    itemsPerPage?: number;
    initialSort?: string;
}

/**
 * Login Request
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

/**
 * Create Post Request
 */
export interface CreatePostRequest {
    title: string;
    slug: string;
    type: string;
    status: 'published' | 'draft' | 'archived';
    content: string;
    excerpt?: string;
    tags?: string[];
    [key: string]: any;
}

/**
 * Update Post Request
 */
export interface UpdatePostRequest extends Partial<CreatePostRequest> {
    id: string;
}
