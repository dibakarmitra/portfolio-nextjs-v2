import { db } from '@/config/database';

export async function revokeToken(jti: string, expiresAt: Date) {
    await db('revoked_tokens')
        .insert({
            jti,
            expires_at: expiresAt,
        })
        .onConflict('jti')
        .ignore();
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
    const token = await db('revoked_tokens').where({ jti }).first();
    return !!token;
}

export async function cleanupExpiredTokens() {
    await db('revoked_tokens').where('expires_at', '<', new Date()).del();
}
