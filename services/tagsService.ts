import { db } from '@/config/database';
import { Tag, DBTag } from '@/types';

export function dbTagToTag(dbTag: DBTag): Tag {
    return {
        id: dbTag.id,
        name: dbTag.name,
        slug: dbTag.slug,
        description: dbTag.description || undefined,
        color: dbTag.color || undefined,
        usageCount: dbTag.usage_count,
        isActive: dbTag.is_active,
        createdAt: new Date(dbTag.created_at).toISOString(),
        updatedAt: new Date(dbTag.updated_at).toISOString(),
    };
}

export async function getAllTags(): Promise<Tag[]> {
    const dbTags = await db('tags').orderBy('usage_count', 'desc').orderBy('name', 'asc');

    return dbTags.map(dbTagToTag);
}

export async function getActiveTags(): Promise<Tag[]> {
    const dbTags = await db('tags')
        .where('is_active', true)
        .orderBy('usage_count', 'desc')
        .orderBy('name', 'asc');

    return dbTags.map(dbTagToTag);
}

export async function getTagById(id: number): Promise<Tag | null> {
    const dbTag = await db('tags').where('id', id).first();

    return dbTag ? dbTagToTag(dbTag) : null;
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
    const dbTag = await db('tags').where('slug', slug).first();

    return dbTag ? dbTagToTag(dbTag) : null;
}

export async function createTag(tagData: Partial<Tag>): Promise<Tag> {
    const slug = tagData.slug || generateSlug(tagData.name!);

    let finalSlug = slug;
    let counter = 1;
    while (await db('tags').where('slug', finalSlug).first()) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    const dbTagData: Partial<DBTag> = {
        name: tagData.name,
        slug: finalSlug,
        description: tagData.description || null,
        color: tagData.color || generateTagColor(tagData.name!),
        usage_count: 0,
        is_active: tagData.isActive !== undefined ? tagData.isActive : true,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const [newId] = await db('tags').insert(dbTagData);
    const id = Number(newId);

    const createdTag = await getTagById(id);
    if (!createdTag) {
        throw new Error('Failed to create tag');
    }

    return createdTag;
}

export async function updateTag(id: number, tagData: Partial<Tag>): Promise<Tag> {
    const updateData: Partial<DBTag> = {
        name: tagData.name,
        slug: tagData.slug,
        description: tagData.description || null,
        color: tagData.color || null,
        is_active: tagData.isActive,
        updated_at: new Date(),
    };

    await db('tags').where('id', id).update(updateData);

    const updatedTag = await getTagById(id);
    if (!updatedTag) {
        throw new Error('Failed to update tag');
    }

    return updatedTag;
}

export async function deleteTag(id: number): Promise<void> {
    await db('tags').where('id', id).del();
}

export async function searchTags(query: string): Promise<Tag[]> {
    const dbTags = await db('tags')
        .where('is_active', true)
        .where('name', 'like', `%${query}%`)
        .orderBy('usage_count', 'desc')
        .orderBy('name', 'asc');

    return dbTags.map(dbTagToTag);
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function generateTagColor(name: string): string {
    const techColors: Record<string, string> = {
        react: '#61DAFB',
        typescript: '#3178C6',
        javascript: '#F7DF1E',
        nodejs: '#339933',
        css: '#1572B6',
        html: '#E34C26',
        nextjs: '#000000',
        vue: '#4FC08D',
        angular: '#DD0031',
        python: '#3776AB',
        java: '#007396',
        php: '#777BB4',
        ruby: '#CC342D',
        go: '#00ADD8',
        rust: '#000000',
        swift: '#FA7343',
        kotlin: '#7F52FF',
        docker: '#2496ED',
        kubernetes: '#326CE5',
        aws: '#FF9900',
        azure: '#0078D4',
        gcp: '#4285F4',
        mongodb: '#47A248',
        mysql: '#4479A1',
        postgresql: '#336791',
        redis: '#DC382D',
        git: '#F05032',
        github: '#181717',
        linux: '#FCC624',
        ubuntu: '#E95420',
        windows: '#0078D4',
        macos: '#000000',
        android: '#3DDC84',
        ios: '#000000',
    };

    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (techColors[normalizedName]) {
        return techColors[normalizedName];
    }

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (Math.abs(hash >> 8) % 30); // 60-90% for nice colors
    const lightness = 45 + (Math.abs(hash >> 16) % 20); // 45-65% for good contrast

    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
