import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/config/database';
import { verifyPassword } from '@/lib/password';
import { env } from '@/config/env';
import { isTokenRevoked } from '@/lib/auth/revocation';

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
        signOut: '/login',
    },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await db('users')
                    .where({ email: credentials.email as string })
                    .first();

                if (!user) return null;

                const valid = await verifyPassword(credentials.password as string, user.password);

                if (!valid) return null;

                return {
                    id: Number(user.id),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    is_superadmin: user.is_superadmin,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // initial sign in: add JTI
            if (user && account) {
                token.jti = crypto.randomUUID();
                token.id = Number(user.id);
                token.role = user.role;
                token.is_superadmin = user.is_superadmin;
            }

            // critical: check if this JTI is in blacklist
            if (token.jti) {
                const revoked = await isTokenRevoked(token.jti);
                if (revoked) return null; // destroys session
            }

            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: Number(token.id),
                    role: token.role as string,
                    is_superadmin: token.is_superadmin as boolean,
                },
                jti: token.jti,
            };
        },
    },
    secret: env.AUTH_SECRET,
});

export const authOptions = {
    session: { strategy: 'jwt' as const },
    pages: { signIn: '/login' },
    providers: [],
    callbacks: {},
    secret: env.AUTH_SECRET,
};
