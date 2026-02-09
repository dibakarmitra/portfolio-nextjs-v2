import path from 'path';
import { config } from 'dotenv';

if (process.env) {
    try {
        config({
            path: path.join(process.cwd(), '.env.local'),
        });
    } catch (error) {
        console.warn('Could not load .env file:', error);
    }
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key];

    if (value !== undefined) {
        return value;
    }

    if (!defaultValue) {
        console.warn(`Environment variable ${key} is not set`);
        return '';
    }

    return defaultValue;
};

const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
};

const getEnvNum = (key: string, defaultValue: number = 0): number => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return parseInt(value, 10) || defaultValue;
};

export const env = {
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    APP_NAME: getEnvVar('APP_NAME', 'Portfolio Admin'),
    APP_URL: getEnvVar('APP_URL', 'http://localhost:3000'),

    DB_CLIENT: getEnvVar('DB_CLIENT', process.env.NODE_ENV === 'production' ? 'pg' : 'better-sqlite3'),
    DATABASE_URL: getEnvVar('DATABASE_URL', process.env.NODE_ENV === 'production' ? '' : 'dev.sqlite3'),
    DB_FILENAME: getEnvVar('DB_FILENAME', process.env.NODE_ENV === 'production' ? '' : 'dev.sqlite3'),

    AUTH_SECRET: getEnvVar('AUTH_SECRET') || getEnvVar('NEXTAUTH_SECRET'),
    AUTH_URL: getEnvVar('AUTH_URL') || getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),

    CLOUDFLARE_R2_ENDPOINT: getEnvVar('CLOUDFLARE_R2_ENDPOINT'),
    CLOUDFLARE_R2_ACCESS_KEY_ID: getEnvVar('CLOUDFLARE_R2_ACCESS_KEY_ID'),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: getEnvVar('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
    CLOUDFLARE_R2_BUCKET_NAME: getEnvVar('CLOUDFLARE_R2_BUCKET_NAME'),
    CLOUDFLARE_R2_PUBLIC_URL: getEnvVar('CLOUDFLARE_R2_PUBLIC_URL'),

    OWNER_NAME: getEnvVar('NEXT_PUBLIC_OWNER_NAME', 'John Doe'),
    OWNER_ROLE: getEnvVar('NEXT_PUBLIC_OWNER_ROLE', 'Senior Developer'),
    OWNER_LOCATION: getEnvVar('NEXT_PUBLIC_OWNER_LOCATION', 'City, Country'),
    OWNER_PHONE: getEnvVar('NEXT_PUBLIC_OWNER_PHONE', '+1234567890'),
    OWNER_EMAIL: getEnvVar('NEXT_PUBLIC_OWNER_EMAIL', 'john@example.com'),
    OWNER_WEBSITE: getEnvVar('NEXT_PUBLIC_OWNER_WEBSITE', 'https://johndoe.com'),
    OWNER_AVATAR: getEnvVar('NEXT_PUBLIC_OWNER_AVATAR', ''),
    OWNER_BIO: getEnvVar(
        'NEXT_PUBLIC_OWNER_BIO',
        'A skilled software developer with a passion for building great things.'
    ),

    GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY'),
    OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY'),

    RESEND_API_KEY: getEnvVar('RESEND_API_KEY'),

    ENABLE_AI: getEnvBool('ENABLE_AI', true),
    ENABLE_ANALYTICS: getEnvBool('ENABLE_ANALYTICS', true),
    ENABLE_LOGGING: getEnvBool('ENABLE_LOGGING', true),

    RATE_LIMIT_ENABLED: getEnvBool('RATE_LIMIT_ENABLED', true),
    RATE_LIMIT_WINDOW: getEnvNum('RATE_LIMIT_WINDOW', 60000), // 1 minute
    RATE_LIMIT_MAX_REQUESTS: getEnvNum('RATE_LIMIT_MAX_REQUESTS', 100),

    DEBUG: getEnvBool('DEBUG', process.env.NODE_ENV === 'development'),
    VERBOSE_LOGGING: getEnvBool('VERBOSE_LOGGING', false),
} as const;

if (env.NODE_ENV === 'production') {
    const requiredEnvVars = ['AUTH_SECRET', 'AUTH_URL'];
    const missing = requiredEnvVars.filter((key) => !getEnvVar(key));

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
