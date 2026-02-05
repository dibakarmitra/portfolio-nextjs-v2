import { Note } from '@/types/web';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import { v5 as uuidv5 } from 'uuid';
import { DEFAULT_NOTE_COVER } from '@/config/constants';

const NOTES_NAMESPACE = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

async function readMDXFile(filePath: string): Promise<Note> {
    const rawContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(rawContent);
    const slug = path.basename(filePath, path.extname(filePath));

    return {
        id: uuidv5(slug, NOTES_NAMESPACE),
        slug,
        title: data.title,
        date: data.date || data.publishedAt || new Date().toISOString(),
        excerpt: data.summary || data.description || '',
        tags: data.tags
            ? Array.isArray(data.tags)
                ? data.tags
                : data.tags.split(',').map((tag: string) => tag.trim())
            : [],
        content,
        image: data.image || DEFAULT_NOTE_COVER,
    };
}

export async function getNotes(): Promise<Note[]> {
    const notesDirectory = path.join(process.cwd(), 'contents');

    try {
        const fileNames = await fs.readdir(notesDirectory);
        const allNotesData = await Promise.all(
            fileNames
                .filter((fileName) => fileName.endsWith('.mdx'))
                .map(async (fileName) => {
                    const fullPath = path.join(notesDirectory, fileName);
                    return readMDXFile(fullPath);
                })
        );

        return allNotesData.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            } else if (a.date > b.date) {
                return -1;
            } else {
                return 0;
            }
        });
    } catch (error) {
        console.error('Error reading notes:', error);
        return [];
    }
}

export async function getNote(slug: string): Promise<Note | null> {
    const notesDirectory = path.join(process.cwd(), 'contents');
    const filePath = path.join(notesDirectory, `${slug}.mdx`);

    try {
        return await readMDXFile(filePath);
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

export function formatDate(date: string, includeRelative = false) {
    const parsedDate = new Date(date);
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedDate = formatter.format(parsedDate);

    if (includeRelative) {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 3600 * 24));

        let relativeTime = '';
        if (diffInDays === 0) {
            relativeTime = 'Today';
        } else if (diffInDays === 1) {
            relativeTime = 'Yesterday';
        } else if (diffInDays < 7) {
            relativeTime = `${diffInDays} days ago`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            relativeTime = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 365) {
            const months = Math.floor(diffInDays / 30);
            relativeTime = `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffInDays / 365);
            relativeTime = `${years} year${years > 1 ? 's' : ''} ago`;
        }

        return `${formattedDate} (${relativeTime})`;
    }

    return formattedDate;
}
