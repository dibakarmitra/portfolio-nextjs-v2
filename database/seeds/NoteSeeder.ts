import { v7 as uuid } from 'uuid';
import type { Knex } from 'knex';
import { getNotes } from '@/lib/webNotes';

export async function seed(knex: Knex) {
    console.log('Starting notes seeding from MDX files...');

    let devCategory = await knex('categories').where('slug', 'development').first();

    if (!devCategory) {
        console.log('Development category not found, creating it...');
        const [id] = await knex('categories')
            .insert({
                name: 'Development',
                slug: 'development',
                description: 'Programming, software development, and technical content',
                color: '#3B82F6',
                icon: '💻',
                sort_order: 1,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('id');

        const categoryId = typeof id === 'object' ? (id as any).id : id;
        devCategory = { id: categoryId };
    }

    const tutorialCategory = await knex('categories').where('slug', 'tutorial').first();

    await knex('notes').del();
    console.log('Cleared existing notes.');

    try {
        const mdxNotes = await getNotes();
        console.log(`Found ${mdxNotes.length} MDX notes to seed.`);

        const notesToInsert = mdxNotes.map((note) => ({
            id: uuid(),
            title: note.title,
            slug: note.slug,
            type: 'NOTE',
            status: 'published',
            date: new Date(note.date),
            tags: JSON.stringify(note.tags),
            excerpt: note.excerpt,
            content: note.content,
            views: Math.floor(Math.random() * 500),
            likes: Math.floor(Math.random() * 100),
            seo_config: JSON.stringify({
                title: note.title,
                description: note.excerpt,
            }),
            image_url: note.image || null,
            category_id: devCategory?.id || null,
            created_at: new Date(),
            updated_at: new Date(),
        }));

        if (notesToInsert.length > 0) {
            await knex('notes').insert(notesToInsert);
            console.log(`Successfully seeded ${notesToInsert.length} notes from MDX.`);
        } else {
            console.warn('No MDX notes found in contents/ directory.');
        }
    } catch (error) {
        console.error('Error during notes seeding:', error);
        throw error;
    }
}
