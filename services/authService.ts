'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { auth } from '@/lib/auth';
import { env } from '@/config/env';

export async function verifyAuth(request: NextRequest): Promise<boolean> {
    try {
        if (!env.AUTH_SECRET) {
            console.error('AUTH_SECRET is not configured');
            return false;
        }

        const token = await getToken({
            req: request,
            secret: env.AUTH_SECRET,
            secureCookie: process.env.NODE_ENV === 'production',
        });
        if (!token) {
            console.log('No token found in request');
            return false;
        }
        console.log('Token found:', { id: token.id, email: token.email, role: token.role });
        return true;
    } catch (error) {
        console.error('Authentication verification failed:', error);
        return false;
    }
}

export async function verifyAdmin(request: NextRequest): Promise<boolean> {
    try {
        if (!env.AUTH_SECRET) {
            console.error('AUTH_SECRET is not configured');
            return false;
        }

        const token = await getToken({
            req: request,
            secret: env.AUTH_SECRET,
            secureCookie: process.env.NODE_ENV === 'production',
        });
        if (!token) {
            console.log('No token found for admin verification');
            return false;
        }
        const isAdmin =
            token.role === 'admin' || token.role === 'superadmin' || token.is_superadmin === true;
        console.log('Admin verification:', {
            role: token.role,
            is_superadmin: token.is_superadmin,
            isAdmin,
        });
        return isAdmin;
    } catch (error) {
        console.error('Admin verification failed:', error);
        return false;
    }
}

export async function getUserId(request: NextRequest): Promise<number | null> {
    try {
        if (!env.AUTH_SECRET) {
            console.error('AUTH_SECRET is not configured');
            return null;
        }

        const token = await getToken({
            req: request,
            secret: env.AUTH_SECRET,
            secureCookie: process.env.NODE_ENV === 'production',
        });
        if (!token || !token.id) {
            console.log('No user ID found in token');
            return null;
        }
        return Number(token.id);
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}

export async function requireAuth(request: NextRequest) {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }
    return null;
}

export async function requireAdmin(request: NextRequest) {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json(
            { success: false, error: 'Admin access required' },
            { status: 403 }
        );
    }
    return null;
}

export async function requireSuperAdmin(request: NextRequest) {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
        return NextResponse.json(
            { success: false, error: 'Authentication required' },
            { status: 401 }
        );
    }

    const token = await getToken({
        req: request,
        secret: env.AUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
    });

    if (!token || token.role !== 'superadmin') {
        return NextResponse.json(
            { success: false, error: 'Superadmin access required' },
            { status: 403 }
        );
    }
    return null;
}
