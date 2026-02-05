import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('categories', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.string('slug').notNullable().unique();
        table.text('description').nullable();
        table.string('color').nullable().comment('hex color');
        table.string('icon').nullable().comment('icon or emoji');
        table.integer('sort_order').defaultTo(0);
        table.boolean('is_active').defaultTo(true);

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('categories');
}
