import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // allow public routes
    if (
        pathname === '/' ||
        pathname.startsWith('/resume') ||
        pathname.startsWith('/notes') ||
        pathname.startsWith('/projects') ||
        pathname.startsWith('/web') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/feed') ||
        pathname.startsWith('/og') ||
        pathname === '/api/send' ||
        pathname.startsWith('/api/published-notes') ||
        pathname.startsWith('/api/published-projects') ||
        pathname.startsWith('/api/published-categories') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/assets') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.') // static files
    ) {
        return NextResponse.next();
    }

    const session = await auth();

    if (!session) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};
