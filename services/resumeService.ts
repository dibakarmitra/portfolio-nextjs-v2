import { db } from '@/config/database';
import { ResumeContent, ResumeContentType, PublicationStatus } from '@/types';

interface DBResumeContent {
    id: number;
    title: string;
    type: string;
    status: string;
    date: Date;
    excerpt: string | null;
    content: string;
    views: number;
    likes: number;
    seo_config: string | null;
    image_url: string | null;
    repo_url: string | null;
    live_url: string | null;
    company: string | null;
    location: string | null;
    end_date: string | null;
    proficiency: number | null;
    category: string | null;
    issuer: string | null;
    verification_id: string | null;
    verification_url: string | null;
    person_name: string | null;
    person_position: string | null;
    person_avatar: string | null;
    proficiency_level: string | null;
    created_at: Date;
    updated_at: Date;
}

function dbResumeContentToResumeContent(dbResume: DBResumeContent): ResumeContent {
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return {
        id: dbResume.id,
        title: dbResume.title,
        type: dbResume.type as ResumeContentType,
        status: dbResume.status as PublicationStatus,
        date: new Date(dbResume.date).toISOString(),
        tags: [], // todo: implement tags if needed
        excerpt: dbResume.excerpt || '',
        content: dbResume.content,
        views: dbResume.views,
        likes: dbResume.likes,
        seo: dbResume.seo_config ? JSON.parse(dbResume.seo_config) : undefined,
        slug: generateSlug(dbResume.title), // Generate slug from title
        imageUrl: dbResume.image_url || undefined,
        repoUrl: dbResume.repo_url || undefined,
        liveUrl: dbResume.live_url || undefined,
        company: dbResume.company || undefined,
        location: dbResume.location || undefined,
        endDate: dbResume.end_date || undefined,
        proficiency: dbResume.proficiency || undefined,
        category: dbResume.category || undefined,
        issuer: dbResume.issuer || undefined,
        verificationId: dbResume.verification_id || undefined,
        verificationUrl: dbResume.verification_url || undefined,
        personName: dbResume.person_name || undefined,
        personPosition: dbResume.person_position || undefined,
        personAvatar: dbResume.person_avatar || undefined,
        proficiencyLevel:
            (dbResume.proficiency_level as
                | 'native'
                | 'fluent'
                | 'intermediate'
                | 'basic'
                | undefined) || undefined,
    };
}

function resumeContentToDBResumeContent(resume: Partial<ResumeContent>): Partial<DBResumeContent> {
    return {
        title: resume.title,
        type: resume.type,
        status: resume.status || 'draft',
        date: resume.date ? new Date(resume.date) : new Date(),
        excerpt: resume.excerpt || null,
        content: resume.content || '',
        views: resume.views || 0,
        likes: resume.likes || 0,
        seo_config: resume.seo ? JSON.stringify(resume.seo) : null,
        image_url: resume.imageUrl || null,
        repo_url: resume.repoUrl || null,
        live_url: resume.liveUrl || null,
        company: resume.company || null,
        location: resume.location || null,
        end_date: resume.endDate || null,
        proficiency: resume.proficiency || null,
        category: resume.category || null,
        issuer: resume.issuer || null,
        verification_id: resume.verificationId || null,
        verification_url: resume.verificationUrl || null,
        person_name: resume.personName || null,
        person_position: resume.personPosition || null,
        person_avatar: resume.personAvatar || null,
        proficiency_level: resume.proficiencyLevel || null,
    };
}

export async function getAllResumeContents(): Promise<ResumeContent[]> {
    const dbResumes = await db('resume_contents').orderBy('date', 'desc');

    return dbResumes.map(dbResumeContentToResumeContent);
}

export async function getResumeContentsByType(type: ResumeContentType): Promise<ResumeContent[]> {
    const dbResumes = await db('resume_contents').where('type', type).orderBy('date', 'desc');

    return dbResumes.map(dbResumeContentToResumeContent);
}

export async function getPublishedResumeContentsByType(
    type: ResumeContentType
): Promise<ResumeContent[]> {
    const dbResumes = await db('resume_contents')
        .where('type', type)
        .where('status', 'published')
        .orderBy('date', 'desc');

    return dbResumes.map(dbResumeContentToResumeContent);
}

export async function getPublishedResumeContents(): Promise<ResumeContent[]> {
    const dbResumes = await db('resume_contents')
        .where('status', 'published')
        .orderBy('date', 'desc');

    return dbResumes.map(dbResumeContentToResumeContent);
}

export async function getResumeContentById(id: number): Promise<ResumeContent | null> {
    const dbResume = await db('resume_contents').where({ id }).first();

    if (!dbResume) return null;

    return dbResumeContentToResumeContent(dbResume);
}

export async function createResumeContent(
    resumeData: Partial<ResumeContent>
): Promise<ResumeContent> {
    const dbResumeData = {
        ...resumeContentToDBResumeContent(resumeData),
        created_at: new Date(),
        updated_at: new Date(),
    };

    const [newId] = await db('resume_contents').insert(dbResumeData);
    const id = Number(newId);

    const createdResume = await getResumeContentById(id);
    if (!createdResume) {
        throw new Error('Failed to create resume content');
    }

    return createdResume;
}

export async function updateResumeContent(
    id: number,
    resumeData: Partial<ResumeContent>
): Promise<ResumeContent> {
    const updateData = resumeContentToDBResumeContent(resumeData);
    updateData.updated_at = new Date();

    const { id: _, ...dataWithoutId } = updateData;
    const filteredData = Object.fromEntries(
        Object.entries(dataWithoutId).filter(([_, value]) => value !== undefined)
    );

    console.log('Update data keys:', Object.keys(updateData));
    console.log('Filtered data keys:', Object.keys(filteredData));
    console.log('ID being used in WHERE clause:', id);

    await db('resume_contents').where({ id }).update(filteredData);

    const updatedResume = await getResumeContentById(id);
    if (!updatedResume) {
        throw new Error('Failed to update resume content');
    }

    return updatedResume;
}

export async function deleteResumeContent(id: number): Promise<boolean> {
    const deletedCount = await db('resume_contents').where('id', id).del();
    return deletedCount > 0;
}

export async function getResumeContentsGroupedByType(): Promise<
    Record<ResumeContentType, ResumeContent[]>
> {
    const allContents = await getAllResumeContents();

    const grouped: Record<ResumeContentType, ResumeContent[]> = {
        [ResumeContentType.EXPERIENCE]: [],
        [ResumeContentType.PROJECT]: [],
        [ResumeContentType.EDUCATION]: [],
        [ResumeContentType.SKILL]: [],
        [ResumeContentType.CERTIFICATION]: [],
        [ResumeContentType.AWARD]: [],
        [ResumeContentType.TESTIMONIAL]: [],
        [ResumeContentType.LANGUAGE]: [],
        [ResumeContentType.STRENGTH]: [],
    };

    allContents.forEach((content) => {
        if (grouped[content.type]) {
            grouped[content.type].push(content);
        }
    });

    return grouped;
}
