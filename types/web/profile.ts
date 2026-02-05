/**
 * Profile and user-related types
 */

export interface Experience {
    role: string;
    company: string;
    period: string;
    type?: string;
    description: string[];
    skills?: string[];
    current?: boolean;
}

export interface SkillCategory {
    category: string;
    items: string[];
}

export type SocialIconType =
    | 'linkedin'
    | 'github'
    | 'twitter'
    | 'code'
    | 'book'
    | 'layout'
    | 'default';

export interface SocialLink {
    platform: string;
    username: string;
    url: string;
    icon: SocialIconType;
}

export interface Profile {
    name: string;
    role: string;
    location: string;
    phone: string;
    bio: string;
    email: string;
    website: string;
    avatar: string;
    socials: SocialLink[];
    resumeUrl?: string;
}
