/**
 * Environment configuration types
 */

export interface EnvironmentConfig {
    isDevelopment: boolean;
    isProduction: boolean;
    apiUrl: string;
    siteUrl: string;
    resendApiKey?: string;
}

export const getEnvConfig = (): EnvironmentConfig => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        isDevelopment,
        isProduction,
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dibakarmitra.com',
        resendApiKey: process.env.RESEND_API_KEY,
    };
};
