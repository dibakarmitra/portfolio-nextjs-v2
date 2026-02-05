/**
 * Content-related types for blog posts and projects
 */

export interface Project {
    title: string;
    description: string;
    date: string;
    tech: string[];
    points: string[];
    link?: string;
    repo?: string;
    isFeatured?: boolean;
}

export interface Note {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    description?: string;
    tags: string[];
    content: string;
    image?: string;
    link?: string;
}
