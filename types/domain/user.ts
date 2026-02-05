/**
 * User Domain Types
 * User profile and authentication related types
 */

/**
 * User profile configuration
 */
export interface UserProfile {
    displayName: string;
    role: string;
    location: string;
    availability: string;
    avatarUrl: string;
    bio: string;
    email: string;
    phone: string;
    siteUrl: string;
    resumeUrl: string;
    socials: {
        github: string;
        linkedin: string;
        website: string;
        x: string;
    };
    seo: import('./content').SEOConfig;
}
