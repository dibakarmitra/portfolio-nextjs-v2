import { useState, useMemo, useCallback } from 'react';
import { UserProfile } from '@/types';

export interface ProfileState {
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    isProfileLoading: boolean;
    refreshProfile: () => Promise<void>;
}

export const useProfile = (): ProfileState => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        displayName: '',
        role: '',
        location: '',
        availability: '',
        avatarUrl: '',
        bio: '',
        email: '',
        phone: '',
        siteUrl: '',
        resumeUrl: '',
        socials: {
            github: '',
            linkedin: '',
            website: '',
            x: '',
        },
        seo: {
            title: '',
            description: '',
            keywords: '',
            ogImage: '',
        },
    });
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    const refreshProfile = useCallback(async () => {
        try {
            setIsProfileLoading(true);
            const response = await fetch('/api/profile');

            if (response.ok) {
                const result = await response.json();
                setUserProfile(result.data);
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsProfileLoading(false);
        }
    }, []);

    // memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            userProfile,
            setUserProfile,
            isProfileLoading,
            refreshProfile,
        }),
        [userProfile, isProfileLoading, refreshProfile]
    );

    return contextValue;
};
