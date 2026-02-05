import type { Metadata } from 'next';
import { Resume, SplashCursor } from '@/components/web';
import appConfig from '@/config/app';
import { getPortfolioData } from '@/services/portfolioService';

export const metadata: Metadata = {
    title: 'Resume',
    description: `Professional resume and portfolio of a Senior PHP Developer specializing in Laravel, Django, and backend development.`,
    alternates: {
        canonical: '/resume',
    },
};

export default async function ResumePage() {
    const portfolioData = await getPortfolioData();

    return (
        <>
            <SplashCursor />
            <Resume data={portfolioData} />
        </>
    );
}
