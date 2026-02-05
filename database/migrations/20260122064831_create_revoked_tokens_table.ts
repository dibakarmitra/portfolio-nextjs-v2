import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('revoked_tokens', (table) => {
        table.string('jti').primary();
        table.timestamp('expires_at').notNullable();
        table.timestamp('revoked_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('revoked_tokens');
}
