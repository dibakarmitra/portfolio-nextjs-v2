import type { Knex } from 'knex';

export async function up(knex: Knex) {
    await knex.schema.createTable('media_files', (table) => {
        table.uuid('id').primary();
        table.string('key', 1024).notNullable().unique();
        table.text('url').notNullable();
        table.string('source', 50).defaultTo('media').notNullable();
        table.string('name', 512).notNullable();
        table.string('type', 30).notNullable();
        table.string('content_type', 255).nullable();
        table.integer('size_bytes').nullable();
        table.text('alt').nullable();
        table.text('caption').nullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex) {
    await knex.schema.dropTableIfExists('media_files');
}
