import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NoteDetail } from '@/components/web';
import { getPublishedNotes, getNoteBySlug } from '@/services/notesService';
import appConfig from '@/config/app';
import { Note as WebNote } from '@/types/web';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const notes = await getPublishedNotes();
    return notes.map((note) => ({
        slug: note.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params;
        const note = await getNoteBySlug(slug);

        if (!note || note.status !== 'published') {
            return {
                title: `Note Not Found`,
            };
        }

        return {
            title: note.title,
            description: note.excerpt || note.seo?.description || appConfig.description,
            openGraph: {
                title: note.title,
                description: note.excerpt || note.seo?.description || appConfig.description,
                type: 'article',
                publishedTime: note.date,
                url: `/notes/${slug}`,
                authors: [appConfig.name],
            },
            alternates: {
                canonical: `/notes/${slug}`,
            },
        };
    } catch (error) {
        console.error('Metadata generation error:', error);
        return { title: 'Error | ' + appConfig.name };
    }
}

export default async function NoteDetailPage({ params }: Props) {
    let slug = '';
    try {
        const resolvedParams = await params;
        slug = resolvedParams.slug;

        console.log(`Rendering note detail page for slug: ${slug}`);
        const note = await getNoteBySlug(slug);

        if (!note || note.status !== 'published') {
            console.log(`Note not found or not published: ${slug}`);
            notFound();
        }

        // Map Domain Note to Web Note
        const webNote: WebNote = {
            id: note.id,
            slug: note.slug,
            title: note.title,
            date: note.date,
            excerpt: note.excerpt,
            content: note.content,
            tags: note.tags,
            image: note.imageUrl,
            link: note.liveUrl || note.repoUrl,
        };

        return <NoteDetail note={webNote} />;
    } catch (error: any) {
        console.error(`Error rendering note ${slug}:`, error);
        if (error.digest === 'NEXT_NOT_FOUND') {
            throw error; // Re-throw notFound for Next.js to handle
        }
        // Fallback or re-throw
        throw error;
    }
}
