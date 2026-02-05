import { getServerSettings } from './settingsService';
import { getUserProfile } from './userService';
import { getPortfolioData } from './portfolioService';

export interface SEOData {
    title: string;
    description: string;
    keywords: string;
    siteName: string;
    baseUrl: string;
    ogImage: string;
    author: string;
    twitterHandle: string;
}

export async function getSEOData(): Promise<SEOData> {
    try {
        const settings = await getServerSettings();
        const settingsData = settings.settings;

        const profile = await getUserProfile(1);

        const portfolio = await getPortfolioData();

        const siteName =
            settingsData['site.name'] ||
            settingsData['seo.title'] ||
            profile?.displayName ||
            'Portfolio';

        const description =
            settingsData['site.description'] ||
            settingsData['seo.description'] ||
            profile?.bio ||
            portfolio.seo.description ||
            'Professional portfolio website';

        const keywords =
            settingsData['seo.keywords'] || 'portfolio, professional, resume, projects';

        const baseUrl =
            settingsData['site.url'] || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const ogImage =
            profile?.seo?.ogImage ||
            portfolio.seo.ogImage ||
            `${baseUrl}/og?title=${encodeURIComponent(siteName)}`;

        const author = profile?.displayName || 'Portfolio Owner';

        const twitterHandle = profile?.socials?.x ? `@${profile.socials.x.split('/').pop()}` : '';

        return {
            title: siteName,
            description,
            keywords,
            siteName,
            baseUrl,
            ogImage,
            author,
            twitterHandle,
        };
    } catch (error) {
        console.error('Error fetching SEO data:', error);

        return {
            title: 'Portfolio',
            description: 'Professional portfolio website',
            keywords: 'portfolio, professional, resume, projects',
            siteName: 'Portfolio',
            baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            ogImage: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/og?title=Portfolio`,
            author: 'Portfolio Owner',
            twitterHandle: '',
        };
    }
}

export async function getPageSEOData(
    pageTitle?: string,
    pageDescription?: string
): Promise<SEOData> {
    const baseSEO = await getSEOData();

    if (pageTitle) {
        baseSEO.title = `${pageTitle} | ${baseSEO.siteName}`;
    }

    if (pageDescription) {
        baseSEO.description = pageDescription;
    }

    return baseSEO;
}
