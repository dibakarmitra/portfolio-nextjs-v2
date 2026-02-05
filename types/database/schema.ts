/**
 * Database Schema Types
 * Direct database table interfaces (snake_case naming)
 */

/**
 * Database note interface
 */
export interface DBNote {
    id: string;
    title: string;
    slug: string;
    type: string;
    status: string;
    date: Date;
    tags: string | null;
    excerpt: string | null;
    content: string;
    views: number;
    likes: number;
    seo_config: string | null;
    image_url: string | null;
    category_id: number | null;
    created_at: Date;
    updated_at: Date;
}

/**
 * Database category interface
 */
export interface DBCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

/**
 * Database tag interface
 */
export interface DBTag {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    usage_count: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

/**
 * Database user profile interface
 */
export interface DBUserProfile {
    id: number;
    user_id: number;
    display_name: string;
    name?: string;
    job_title?: string;
    location?: string;
    availability?: string;
    avatar?: string;
    avatar_url?: string;
    bio?: string;
    email: string;
    phone?: string;
    site_url?: string;
    resume_url?: string;
    socials?: string; // JSON string
    seo_config?: string; // JSON string
    created_at: Date;
    updated_at: Date;
}

/**
 * Database user interface (auth table)
 */
export interface DBUser {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    password: string;
    email_verified_at: Date | null;
    is_superadmin: boolean;
    role: 'user' | 'admin';
    created_at: Date;
    updated_at: Date;
}

/**
 * Database password reset interface
 */
export interface DBPasswordReset {
    id: number;
    email: string;
    token: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
    used_at: Date | null;
}

/**
 * Safe user type (without sensitive data)
 */
export type DBSafeUser = Omit<DBUser, 'password' | 'email_verified_at'>;

/**
 * User view with additional metadata
 */
export interface DBUserView extends DBSafeUser {
    post_count?: number;
    last_login?: Date | null;
}

/**
 * Legacy database post interface (for backward compatibility)
 */
export interface DBPost {
    id: string;
    title: string;
    slug: string;
    type: 'NOTE' | 'PROJECT' | 'EXPERIENCE' | 'EDUCATION';
    status: 'draft' | 'published' | 'archived';
    date: Date;
    tags: string | null; // JSON stringified array
    excerpt: string | null;
    content: string;
    views: number;
    likes: number;
    seo_config: string | null; // JSON stringified: {title, description, keywords}
    image_url: string | null;
    repo_url: string | null;
    live_url: string | null;
    company: string | null;
    location: string | null;
    end_date: string | null;
    created_at: Date;
    updated_at: Date;
}
