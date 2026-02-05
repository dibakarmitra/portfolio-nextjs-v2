import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: number;
            email: string;
            name?: string;
            role: string;
            is_superadmin: boolean;
        };
        jti?: string;
    }

    interface User {
        id: number;
        role: string;
        is_superadmin: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number;
        role: string;
        is_superadmin: boolean;
        jti?: string;
    }
}
