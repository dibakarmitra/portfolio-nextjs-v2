import { hashPassword } from '@/lib/password';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    await knex('users').del();

    const insertData = {
        id: 1,
        name: 'Super Admin',
        display_name: 'John Doe',
        email: 'superadmin@admin.com',
        email_verified_at: knex.fn.now(),
        password: hashPassword('admin@123'),
        role: 'superadmin',
        job_title: 'Senior Developer',
        is_superadmin: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=b6e3f4',
        location: 'City, Country',
        availability: 'Open to Opportunities',
        bio: 'A skilled software developer with a passion for building great things.',
        phone: '+1234567890',
        site_url: 'https://johndoe.com',
        resume_url: 'https://johndoe.com/resume.pdf',
        socials: JSON.stringify({
            github: 'https://github.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
            website: 'https://johndoe.com',
            x: 'https://x.com/johndoe',
        }),
        seo_config: JSON.stringify({
            title: 'John Doe - Portfolio',
            description: 'Professional portfolio of John Doe, a skilled developer.',
            keywords: 'developer, portfolio, software engineer',
            ogImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=b6e3f4',
        }),
    };

    await knex('users').insert(insertData);
}
