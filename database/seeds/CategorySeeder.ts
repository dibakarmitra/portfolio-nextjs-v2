import { db } from '@/config/database';
import type { Knex } from 'knex';

export async function seed(knex: Knex) {
    await knex('categories').del();

    const categories = [
        {
            name: 'Development',
            slug: 'development',
            description: 'Programming, software development, and technical content',
            color: '#3B82F6',
            icon: '💻',
            sort_order: 1,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Tutorial',
            slug: 'tutorial',
            description: 'Step-by-step guides, how-to articles, and learning content',
            color: '#10B981',
            icon: '📚',
            sort_order: 2,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'News',
            slug: 'news',
            description: 'Industry news, announcements, and updates',
            color: '#EF4444',
            icon: '📰',
            sort_order: 3,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Opinion',
            slug: 'opinion',
            description: 'Personal thoughts, opinions, and perspectives',
            color: '#F59E0B',
            icon: '💭',
            sort_order: 4,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Case Study',
            slug: 'case-study',
            description: 'Detailed analysis of projects and implementations',
            color: '#8B5CF6',
            icon: '📋',
            sort_order: 5,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Review',
            slug: 'review',
            description: 'Product reviews, critiques, and recommendations',
            color: '#EC4899',
            icon: '⭐',
            sort_order: 6,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Interview',
            slug: 'interview',
            description: 'Interview experiences, questions, and preparation',
            color: '#14B8A6',
            icon: '🎤',
            sort_order: 7,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Tools',
            slug: 'tools',
            description: 'Development tools, software, and productivity apps',
            color: '#6B7280',
            icon: '🔧',
            sort_order: 8,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];

    await db('categories').insert(categories);
    console.log('Categories seeded successfully');
}
