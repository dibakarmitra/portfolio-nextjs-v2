import {
    Navigation,
    Hero,
    Socials,
    About,
    Skills,
    Projects,
    Notes,
    Experience,
    Education,
    Contact,
} from '@/components/web';

import { getPortfolioData } from '@/services/portfolioService';

export default async function HomePage() {
    const portfolioData = await getPortfolioData();

    return (
        <div className="min-h-screen relative">
            <Navigation />

            <main className="max-w-3xl mx-auto px-6 relative z-10">
                <Hero profile={portfolioData.profile} />
                <Socials socials={portfolioData.profile?.socials} />
                <About bio={portfolioData.profile?.bio} />
                <Skills skills={portfolioData.resume.skills} />
                <Projects projects={portfolioData.resume.projects} />
                <Notes notes={portfolioData.notes} notes_count={portfolioData.notes_count} />
                <Experience experiences={portfolioData.resume.experience} />
                <Education education={portfolioData.resume.education} />
                <Contact />
            </main>
        </div>
    );
}
