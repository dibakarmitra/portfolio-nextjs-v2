/**
 * Content Domain Types
 * Core business entities for notes, categories, tags, and resume content
 */

/**
 * Content type enumeration for notes
 */
export enum ContentType {
    NOTE = 'note',
    EXPERIENCE = 'experience',
    PROJECT = 'project',
    EDUCATION = 'education',
    SKILL = 'skill',
    CERTIFICATION = 'certification',
    AWARD = 'award',
    TESTIMONIAL = 'testimonial',
    LANGUAGE = 'language',
    STRENGTH = 'strength',
}

/**
 * Legacy Post type alias for backward compatibility
 * @deprecated Use Note instead - we're notes-only now
 */
export type Post = Note;

/**
 * Publication status for content
 */
export type PublicationStatus = 'published' | 'draft' | 'archived';

/**
 * Resume content type enumeration
 */
export enum ResumeContentType {
    EXPERIENCE = 'experience',
    PROJECT = 'project',
    EDUCATION = 'education',
    SKILL = 'skill',
    CERTIFICATION = 'certification',
    AWARD = 'award',
    TESTIMONIAL = 'testimonial',
    LANGUAGE = 'language',
    STRENGTH = 'strength',
}

/**
 * SEO configuration for content
 */
export interface SEOConfig {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
}

/**
 * Tag interface
 */
export interface Tag {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    usageCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Category interface
 */
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Main content/note interface
 * Represents blog posts and notes
 */
export interface Note {
    id: string;
    title: string;
    slug: string;
    type: ContentType;
    status: PublicationStatus;
    date: string;
    tags: string[]; // Array of tag strings (simple approach)
    excerpt: string;
    content: string;
    views?: number;
    likes?: number;
    seo?: SEOConfig;

    // Optional fields for notes/posts
    imageUrl?: string;
    category?: Category; // Single category instead of array

    // Optional fields for projects
    repoUrl?: string;
    liveUrl?: string;

    // Optional fields for experience/education
    company?: string;
    location?: string;
    endDate?: string;

    // Skills specific fields
    proficiency?: number; // 0-100
    skillCategory?: string; // frontend, backend, etc.

    // Certifications/Awards specific fields
    issuer?: string;
    verificationId?: string;
    verificationUrl?: string;

    // Testimonials specific fields
    personName?: string;
    personPosition?: string;
    personAvatar?: string;

    // Languages specific fields
    proficiencyLevel?: 'native' | 'fluent' | 'intermediate' | 'basic';
}

/**
 * Resume content interface
 * Represents all resume-related items
 */
export interface ResumeContent {
    id: number;
    title: string;
    type: ResumeContentType;
    status: PublicationStatus;
    date: string;
    tags: Tag[]; // Array of Tag objects instead of strings
    excerpt: string;
    content: string;
    views?: number;
    likes?: number;
    seo?: SEOConfig;
    slug: string; // Required slug field for compatibility

    // Project fields
    imageUrl?: string;
    repoUrl?: string;
    liveUrl?: string;

    // Experience/Education fields
    company?: string;
    location?: string;
    endDate?: string;

    // Skills specific fields
    proficiency?: number; // 0-100
    category?: string; // frontend, backend, etc.

    // Certifications/Awards specific fields
    issuer?: string;
    verificationId?: string;
    verificationUrl?: string;

    // Testimonials specific fields
    personName?: string;
    personPosition?: string;
    personAvatar?: string;

    // Languages specific fields
    proficiencyLevel?: 'native' | 'fluent' | 'intermediate' | 'basic';
}

/**
 * Media/file item interface
 */
export interface MediaItem {
    id: string;
    url: string;
    name: string;
    type: 'image' | 'file';
    size: string;
    date: string;
    alt?: string;
    caption?: string;
    contentType?: string;
    source?: string;
}
