import { db } from '@/config/database';
import { UserProfile, DBUserProfile } from '@/types';

export async function getUserProfile(userId: number): Promise<UserProfile | null> {
    const user = await db('users').where({ id: userId }).first();

    if (!user) {
        return null;
    }

    return dbUserToUserProfile(user);
}

export async function updateUserProfile(
    userId: number,
    profile: UserProfile
): Promise<UserProfile | null> {
    const data = userProfileToDBUser(profile);

    await db('users').where({ id: userId }).update(data);

    return getUserProfile(userId);
}

function dbUserToUserProfile(dbUser: DBUserProfile): UserProfile {
    return {
        displayName: dbUser.display_name || dbUser.name || '',
        role: dbUser.job_title || '',
        location: dbUser.location || '',
        availability: dbUser.availability || 'Open to Opportunities',
        avatarUrl: dbUser.avatar || '',
        bio: dbUser.bio || '',
        email: dbUser.email,
        phone: dbUser.phone || '',
        siteUrl: dbUser.site_url || '',
        resumeUrl: dbUser.resume_url || '',
        socials: dbUser.socials
            ? JSON.parse(dbUser.socials)
            : { github: '', linkedin: '', website: '' },
        seo: dbUser.seo_config
            ? JSON.parse(dbUser.seo_config)
            : { title: '', description: '', keywords: '', ogImage: '' },
    };
}

function userProfileToDBUser(profile: UserProfile) {
    return {
        display_name: profile.displayName,
        avatar: profile.avatarUrl,
        job_title: profile.role,
        location: profile.location,
        availability: profile.availability,
        bio: profile.bio,
        phone: profile.phone,
        site_url: profile.siteUrl,
        resume_url: profile.resumeUrl,
        socials: JSON.stringify(profile.socials),
        seo_config: JSON.stringify(profile.seo),
    };
}
