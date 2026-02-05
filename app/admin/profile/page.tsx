'use client';

import React, { useCallback } from 'react';
import { ProfilePage as Profile } from '@/components/admin/pages/ProfilePage';
import { useContextState } from '@/context';

export default function ProfilePageRoute() {
    const { userProfile, setUserProfile, addToast } = useContextState();

    const handleSave = useCallback(
        async (profile: any) => {
            try {
                const response = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profile),
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setUserProfile(result.data);
                        addToast('Profile updated successfully', 'success');
                    } else {
                        addToast(result.error?.message || 'Failed to update profile', 'error');
                    }
                } else {
                    addToast('Failed to update profile', 'error');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                addToast('Failed to update profile', 'error');
            }
        },
        [setUserProfile, addToast]
    );

    const handleDiscard = useCallback(() => {
        addToast('Changes discarded', 'info');
    }, [addToast]);

    return <Profile profile={userProfile} onSave={handleSave} onDiscard={handleDiscard} />;
}
