import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('settings', (table) => {
        table.increments('id').primary();

        table.string('key').notNullable().unique();
        table.text('value').nullable();
        table.string('type').notNullable().defaultTo('string');

        table.string('category').notNullable().defaultTo('general');
        table.text('description').nullable();

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());

        table.index(['key']);
        table.index(['category']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('settings');
}
