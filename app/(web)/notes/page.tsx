import type { Metadata } from 'next';
import { AllNotes } from '@/components/web';

export const metadata: Metadata = {
    title: 'Notes',
    description: `Browse technical notes and blog posts on various topics including Laravel, Django, React, and more.`,
    alternates: {
        canonical: '/notes',
    },
};

export default function NotesPage() {
    return <AllNotes />;
}
