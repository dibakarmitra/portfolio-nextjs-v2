import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('notes', (table) => {
        table.uuid('id').primary();
        table.string('title').notNullable();
        table.string('slug').notNullable().unique();
        table.string('type', 30).notNullable().defaultTo('note');
        table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
        table.datetime('date').notNullable().defaultTo(knex.fn.now());
        table.text('tags').nullable(); // json stringified array of tags
        table.text('excerpt').nullable();
        table.text('content').notNullable();
        table.integer('views').defaultTo(0);
        table.integer('likes').defaultTo(0);

        table.text('seo_config').nullable(); // json: {title, description, keywords}

        table.string('image_url').nullable();
        table.integer('category_id').unsigned().nullable();

        table.foreign('category_id').references('id').inTable('categories').onDelete('SET NULL');

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('notes');
}
