'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import Section from '../ui/Section';
import FadeIn from '../ui/FadeIn';
import { Note } from '@/types/web';
interface NotesProps {
    notes: Note[];
    notes_count: number;
}

const Notes: React.FC<NotesProps> = ({ notes, notes_count }) => {
    const recentNotes = notes.slice(0, 3);

    return (
        <Section
            id="notes"
            title="Notes"
            count={notes_count}
            rightElement={
                <Link
                    href="/notes"
                    className="group flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                    View All
                    <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            }
        >
            <div className="space-y-4">
                {recentNotes.map((note, index) => (
                    <FadeIn key={index} delay={index * 100}>
                        <Link
                            href={`/notes/${note.slug}`}
                            className="block group p-4 -mx-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-2">
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {note.title}
                                </h3>
                                <span className="text-xs text-zinc-500 font-mono shrink-0">
                                    {note.date}
                                </span>
                            </div>

                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                                {note.description}
                            </p>

                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                                    <BookOpen size={14} />
                                </div>
                                {note.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium text-zinc-500 dark:text-zinc-500"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    </FadeIn>
                ))}
            </div>
        </Section>
    );
};

export default Notes;
