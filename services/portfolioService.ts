import { ResumeContent, UserProfile, Note } from '@/types';
import { getServerSettings } from './settingsService';
import { getUserProfile } from './userService';
import { getPublishedResumeContents } from './resumeService';
import { getPublishedNotes, getPublishedNotesCount } from './notesService';

export interface PortfolioData {
    profile: UserProfile | null;
    settings: Record<string, any>;
    resume: {
        experience: ResumeContent[];
        projects: ResumeContent[];
        education: ResumeContent[];
        skills: ResumeContent[];
        certifications: ResumeContent[];
        awards: ResumeContent[];
        testimonials: ResumeContent[];
        languages: ResumeContent[];
        strengths: ResumeContent[];
    };
    notes: Note[];
    notes_count: number;
    seo: {
        title: string;
        description: string;
        keywords: string;
        ogImage: string;
    };
}

export async function getPortfolioData(): Promise<PortfolioData> {
    try {
        const profile = await getUserProfile(1); //@todo: user id

        const settingsResult = await getServerSettings();
        const settings = settingsResult.settings;

        const [allResumeContents, latestNotes, notes_count] = await Promise.all([
            getPublishedResumeContents(),
            getPublishedNotes(3),
            getPublishedNotesCount(),
        ]);

        const resume = {
            experience: allResumeContents.filter((item) => item.type === 'experience'),
            projects: allResumeContents.filter((item) => item.type === 'project'),
            education: allResumeContents.filter((item) => item.type === 'education'),
            skills: allResumeContents.filter((item) => item.type === 'skill'),
            certifications: allResumeContents.filter((item) => item.type === 'certification'),
            awards: allResumeContents.filter((item) => item.type === 'award'),
            testimonials: allResumeContents.filter((item) => item.type === 'testimonial'),
            languages: allResumeContents.filter((item) => item.type === 'language'),
            strengths: allResumeContents.filter((item) => item.type === 'strength'),
        };

        const seo = {
            title: settings['site.name'] || profile?.displayName || 'Portfolio',
            description: settings['site.description'] || profile?.bio || 'Professional portfolio',
            keywords: settings['site.keywords'] || 'portfolio, resume, professional',
            ogImage: profile?.avatarUrl || settings['site.ogImage'] || '',
        };

        return {
            profile,
            settings,
            resume,
            notes: latestNotes,
            notes_count,
            seo,
        };
    } catch (error) {
        console.error('Error fetching portfolio data:', error);

        return getDefaultPortfolioData();
    }
}

export async function getFeaturedPortfolioItems(): Promise<{
    featuredProjects: ResumeContent[];
    recentExperience: ResumeContent[];
    topSkills: ResumeContent[];
    featuredTestimonials: ResumeContent[];
}> {
    try {
        const allResumeContents = await getPublishedResumeContents();

        const featuredProjects = allResumeContents
            .filter((item) => item.type === 'project')
            .slice(0, 6);

        const recentExperience = allResumeContents
            .filter((item) => item.type === 'experience')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);

        const topSkills = allResumeContents
            .filter((item) => item.type === 'skill' && item.proficiency)
            .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
            .slice(0, 8);

        const featuredTestimonials = allResumeContents
            .filter((item) => item.type === 'testimonial')
            .slice(0, 3);

        return {
            featuredProjects,
            recentExperience,
            topSkills,
            featuredTestimonials,
        };
    } catch (error) {
        console.error('Error fetching featured portfolio items:', error);
        return {
            featuredProjects: [],
            recentExperience: [],
            topSkills: [],
            featuredTestimonials: [],
        };
    }
}

export async function getPortfolioMetadata(): Promise<{
    totalProjects: number;
    totalExperience: number;
    totalSkills: number;
    totalCertifications: number;
    totalTestimonials: number;
    lastUpdated: string;
}> {
    try {
        const allResumeContents = await getPublishedResumeContents();

        const metadata = {
            totalProjects: allResumeContents.filter((item) => item.type === 'project').length,
            totalExperience: allResumeContents.filter((item) => item.type === 'experience').length,
            totalSkills: allResumeContents.filter((item) => item.type === 'skill').length,
            totalCertifications: allResumeContents.filter((item) => item.type === 'certification')
                .length,
            totalTestimonials: allResumeContents.filter((item) => item.type === 'testimonial')
                .length,
            lastUpdated:
                allResumeContents.length > 0
                    ? new Date(
                          Math.max(
                              ...allResumeContents.map((item) => new Date(item.date).getTime())
                          )
                      ).toISOString()
                    : new Date().toISOString(),
        };

        return metadata;
    } catch (error) {
        console.error('Error fetching portfolio metadata:', error);
        return {
            totalProjects: 0,
            totalExperience: 0,
            totalSkills: 0,
            totalCertifications: 0,
            totalTestimonials: 0,
            lastUpdated: new Date().toISOString(),
        };
    }
}

function getDefaultPortfolioData(): PortfolioData {
    return {
        profile: {
            displayName: 'John Doe',
            role: 'Full Stack Developer',
            location: 'San Francisco, CA',
            availability: 'Open to Opportunities',
            avatarUrl: '',
            bio: 'Passionate developer with expertise in modern web technologies.',
            email: '',
            phone: '',
            siteUrl: '',
            resumeUrl: '',
            socials: {
                github: '',
                linkedin: '',
                website: '',
                x: '',
            },
            seo: {
                title: 'John Doe - Portfolio',
                description: 'Full Stack Developer Portfolio',
                keywords: 'developer, portfolio, full-stack',
                ogImage: '',
            },
        },
        settings: {
            'site.name': 'Portfolio',
            'site.description': 'Professional portfolio website',
            'theme.mode': 'system',
            'features.maintenanceMode': false,
        },
        resume: {
            experience: [],
            projects: [],
            education: [],
            skills: [],
            certifications: [],
            awards: [],
            testimonials: [],
            languages: [],
            strengths: [],
        },
        notes: [],
        notes_count: 0,
        seo: {
            title: 'Portfolio',
            description: 'Professional portfolio website',
            keywords: 'portfolio, resume, professional',
            ogImage: '',
        },
    };
}
