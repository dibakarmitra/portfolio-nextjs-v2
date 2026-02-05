'use server';

import { redirect } from 'next/navigation';
import { signOut } from '@/lib/auth';

export async function logoutAction() {
    try {
        // Use NextAuth's signOut function to properly clear session and cookies
        await signOut({ redirect: false });

        console.log('User logged out successfully');
    } catch (error) {
        console.error('Error during logout:', error);
        // Still redirect even if logout fails partially
    } finally {
        // Always redirect to login page
        redirect('/login');
    }
}
