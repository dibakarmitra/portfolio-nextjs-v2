import { db } from '@/config/database';
import { Note, ContentType, Category, DBNote, DBCategory } from '@/types';
import { v7 as uuid } from 'uuid';
import { getCategoryById } from './categoriesService';

export function dbCategoryToCategory(dbCategory: DBCategory): Category {
    return {
        id: dbCategory.id,
        name: dbCategory.name,
        slug: dbCategory.slug,
        description: dbCategory.description || undefined,
        color: dbCategory.color || undefined,
        icon: dbCategory.icon || undefined,
        sortOrder: dbCategory.sort_order,
        isActive: dbCategory.is_active,
        createdAt: new Date(dbCategory.created_at).toISOString(),
        updatedAt: new Date(dbCategory.updated_at).toISOString(),
    };
}

export function dbNoteToNote(dbNote: DBNote, category?: Category): Note {
    return {
        id: dbNote.id,
        title: dbNote.title,
        slug: dbNote.slug,
        type: ContentType.NOTE,
        status: dbNote.status as any,
        date: new Date(dbNote.date).toISOString(),
        tags: dbNote.tags ? JSON.parse(dbNote.tags) : [],
        excerpt: dbNote.excerpt || '',
        content: dbNote.content,
        views: dbNote.views,
        likes: dbNote.likes,
        seo: dbNote.seo_config ? JSON.parse(dbNote.seo_config) : undefined,
        imageUrl: dbNote.image_url || undefined,
        category,
    };
}

export function noteToDBNote(note: Partial<Note>): Partial<DBNote> {
    return {
        title: note.title,
        slug: note.slug,
        type: 'NOTE', // Use uppercase to match database enum
        status: note.status || 'draft',
        date: note.date ? new Date(note.date) : new Date(),
        tags: note.tags ? JSON.stringify(note.tags) : null,
        excerpt: note.excerpt || null,
        content: note.content || '',
        views: note.views || 0,
        likes: note.likes || 0,
        seo_config: note.seo ? JSON.stringify(note.seo) : null,
        image_url: note.imageUrl || null,
        category_id: note.category?.id || null,
    };
}

export async function getAllNotes(options?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}): Promise<Note[]> {
    let query = db('notes');

    if (options?.status) {
        query = query.where('status', options.status);
    }

    if (options?.category) {
        query = query.where('category_id', options.category);
    }

    if (options?.search) {
        query = query.where(function () {
            this.where('title', 'like', `%${options.search}%`)
                .orWhere('content', 'like', `%${options.search}%`)
                .orWhere('excerpt', 'like', `%${options.search}%`);
        });
    }

    if (options?.page && options?.limit) {
        const offset = (options.page - 1) * options.limit;
        query = query.limit(options.limit).offset(offset);
    }

    const dbNotes = await query
        .leftJoin('categories', 'notes.category_id', 'categories.id')
        .select(
            'notes.*',
            'categories.id as category_id',
            'categories.name as category_name',
            'categories.slug as category_slug',
            'categories.description as category_description',
            'categories.color as category_color',
            'categories.icon as category_icon',
            'categories.sort_order as category_sort_order',
            'categories.is_active as category_is_active',
            'categories.created_at as category_created_at',
            'categories.updated_at as category_updated_at'
        )
        .orderBy('notes.date', 'desc');

    const notesWithCategories = dbNotes.map(dbNote => {
        let category: Category | undefined = undefined;
        if (dbNote.category_id) {
            category = {
                id: dbNote.category_id,
                name: dbNote.category_name,
                slug: dbNote.category_slug,
                description: dbNote.category_description || undefined,
                color: dbNote.category_color || undefined,
                icon: dbNote.category_icon || undefined,
                sortOrder: dbNote.category_sort_order,
                isActive: dbNote.category_is_active,
                createdAt: new Date(dbNote.category_created_at).toISOString(),
                updatedAt: new Date(dbNote.category_updated_at).toISOString(),
            };
        }

        return dbNoteToNote(dbNote, category);
    });

    return notesWithCategories;
}

export async function countAllNotes(options?: {
    status?: string;
    category?: string;
    search?: string;
}): Promise<number> {
    let query = db('notes');

    if (options?.status) {
        query = query.where('status', options.status);
    }

    if (options?.category) {
        query = query.where('category_id', options.category);
    }

    if (options?.search) {
        query = query.where(function () {
            this.where('title', 'like', `%${options.search}%`)
                .orWhere('content', 'like', `%${options.search}%`)
                .orWhere('excerpt', 'like', `%${options.search}%`);
        });
    }

    const result = await query.count('* as count').first();
    return Number(result?.count || 0);
}

export async function getPublishedNotes(limit?: number): Promise<Note[]> {
    let query = db('notes')
        .where('type', 'NOTE')
        .where('status', 'published')
        .orderBy('date', 'desc');

    if (limit) {
        query = query.limit(limit);
    }

    const dbNotes = await query
        .leftJoin('categories', 'notes.category_id', 'categories.id')
        .select(
            'notes.*',
            'categories.id as category_id',
            'categories.name as category_name',
            'categories.slug as category_slug',
            'categories.description as category_description',
            'categories.color as category_color',
            'categories.icon as category_icon',
            'categories.sort_order as category_sort_order',
            'categories.is_active as category_is_active',
            'categories.created_at as category_created_at',
            'categories.updated_at as category_updated_at'
        );

    const notesWithCategories = dbNotes.map(dbNote => {
        let category: Category | undefined = undefined;
        if (dbNote.category_id) {
            category = {
                id: dbNote.category_id,
                name: dbNote.category_name,
                slug: dbNote.category_slug,
                description: dbNote.category_description || undefined,
                color: dbNote.category_color || undefined,
                icon: dbNote.category_icon || undefined,
                sortOrder: dbNote.category_sort_order,
                isActive: dbNote.category_is_active,
                createdAt: new Date(dbNote.category_created_at).toISOString(),
                updatedAt: new Date(dbNote.category_updated_at).toISOString(),
            };
        }

        return dbNoteToNote(dbNote, category);
    });

    return notesWithCategories;
}

export async function getPublishedNotesCount(): Promise<number> {
    const result = await db('notes')
        .where('type', 'NOTE')
        .where('status', 'published')
        .count('*', { as: 'count' })
        .first();

    return result?.count ? Number(result.count) : 0;
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
    const dbNote = await db('notes').where('type', 'NOTE').where('slug', slug).first();

    if (!dbNote) return null;

    let category: Category | undefined = undefined;
    if (dbNote.category_id) {
        const foundCategory = await getCategoryById(dbNote.category_id);
        if (foundCategory) {
            category = foundCategory;
        }
    }

    return await dbNoteToNote(dbNote, category);
}

export async function getNoteById(id: string): Promise<Note | null> {
    const dbNote = await db('notes').where('type', 'NOTE').where('id', id).first();

    if (!dbNote) return null;

    let category: Category | undefined = undefined;
    if (dbNote.category_id) {
        const foundCategory = await getCategoryById(dbNote.category_id);
        if (foundCategory) {
            category = foundCategory;
        }
    }

    return await dbNoteToNote(dbNote, category);
}

export async function createNote(noteData: Partial<Note>): Promise<Note> {
    const id = uuid();
    const slug = noteData.slug || generateSlug(noteData.title!);

    let finalSlug = slug;
    let counter = 1;
    while (await db('notes').where('slug', finalSlug).first()) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    const rawDbNoteData = {
        id,
        slug: finalSlug,
        ...noteToDBNote(noteData),
        created_at: new Date(),
        updated_at: new Date(),
    };

    const dbNoteData = Object.fromEntries(
        Object.entries(rawDbNoteData).filter(([_, value]) => value !== undefined)
    );

    await db('notes').insert(dbNoteData);

    const createdNote = await getNoteById(id);
    if (!createdNote) {
        throw new Error('Failed to create note');
    }

    return createdNote;
}

export async function updateNote(id: string, noteData: Partial<Note>): Promise<Note> {
    const rawUpdateData = {
        ...noteToDBNote(noteData),
        updated_at: new Date(),
    };

    const updateData = Object.fromEntries(
        Object.entries(rawUpdateData).filter(([_, value]) => value !== undefined)
    );

    await db('notes').where('id', id).update(updateData);

    const updatedNote = await getNoteById(id);
    if (!updatedNote) {
        throw new Error('Failed to update note');
    }

    return updatedNote;
}

export async function deleteNote(id: string): Promise<void> {
    await db('notes').where('id', id).del();
}

export async function incrementNoteViews(id: string): Promise<void> {
    await db('notes').where('id', id).increment('views', 1);
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function getNoteCategories(): Promise<Category[]> {
    const dbCategories = await db('categories')
        .where('is_active', true)
        .orderBy('sort_order', 'asc')
        .orderBy('name', 'asc');

    return dbCategories.map(dbCategoryToCategory);
}
