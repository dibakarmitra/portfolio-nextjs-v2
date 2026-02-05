import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/admin/providers/ClientProviders';
import { getServerSettings } from '@/services/settingsService';
import { getSEOData } from '@/services/seoService';

const inter = Inter({ subsets: ['latin'] });

// Dynamic metadata generation using SEO service
export async function generateMetadata(): Promise<Metadata> {
    const seoData = await getSEOData();

    return {
        metadataBase: new URL(seoData.baseUrl),
        title: {
            default: seoData.title,
            template: `%s | ${seoData.title}`,
        },
        description: seoData.description,
        keywords: seoData.keywords,
        openGraph: {
            title: seoData.title,
            description: seoData.description,
            url: seoData.baseUrl,
            siteName: seoData.siteName,
            locale: 'en_US',
            type: 'website',
            images: [
                {
                    url: seoData.ogImage,
                    width: 1200,
                    height: 630,
                    alt: seoData.title,
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        twitter: {
            title: seoData.title,
            description: seoData.description,
            card: 'summary_large_image',
            site: seoData.twitterHandle,
            creator: seoData.twitterHandle,
        },
        icons: {
            icon: '/favicon.ico',
        },
    };
}

const cx = (...classes: string[]): string => classes.filter(Boolean).join(' ');

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Fetch server-side settings
    let initialSettings: Record<string, any> = {};
    try {
        const serverSettings = await getServerSettings();
        initialSettings = serverSettings.settings;
    } catch (error) {
        console.error('Error fetching server settings for SSR:', error);
        // Use default settings if server fetch fails
        initialSettings = {
            'site.name': 'Portfolio Next.js v2',
            'theme.mode': 'system',
            'features.maintenanceMode': false,
        };
    }

    return (
        <html lang="en" className={cx(inter.className)} suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    href="/feed/rss.xml"
                    title="RSS Feed"
                />
                <link
                    rel="alternate"
                    type="application/atom+xml"
                    href="/feed/atom.xml"
                    title="Atom Feed"
                />
                <link
                    rel="alternate"
                    type="application/feed+json"
                    href="/feed/feed.json"
                    title="JSON Feed"
                />
            </head>
            <body className="antialiased min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                <ClientProviders initialSettings={initialSettings}>{children}</ClientProviders>
            </body>
        </html>
    );
}
