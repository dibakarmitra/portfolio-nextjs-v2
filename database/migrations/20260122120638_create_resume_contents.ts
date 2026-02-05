import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('resume_contents', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('type', 30).notNullable();
        table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
        table.datetime('date').notNullable().defaultTo(knex.fn.now());
        table.text('excerpt').nullable();
        table.text('content').notNullable();
        table.integer('views').defaultTo(0);
        table.integer('likes').defaultTo(0);

        table.text('seo_config').nullable(); // json: {title, description, keywords}

        table.string('image_url').nullable();
        table.string('repo_url').nullable();
        table.string('live_url').nullable();

        table.string('company').nullable();
        table.string('location').nullable();
        table.string('end_date').nullable();

        table.integer('proficiency').nullable().comment('skill proficiency 0-100');
        table.string('category').nullable().comment('skill category - frontend, backend)');

        table.string('issuer').nullable().comment('issuing org');
        table.string('verification_id').nullable().comment('certificate id');
        table.string('verification_url').nullable().comment('certificate url');

        table.string('person_name').nullable().comment('name for testimonials');
        table.string('person_position').nullable().comment('position for testimonials');
        table.string('person_avatar').nullable().comment('avatar url');

        table.string('proficiency_level').nullable().comment('native, fluent, intermediate, basic');

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('resume_contents');
}
