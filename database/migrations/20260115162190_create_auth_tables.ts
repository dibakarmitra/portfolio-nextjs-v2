import type { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('email').unique().notNullable();
            table.timestamp('email_verified_at');
            table.string('name');
            table.string('avatar');
            table.string('password');
            table.string('role', 50).defaultTo('user');
            table.boolean('is_superadmin').defaultTo(false);
            table.timestamps(true, true);
            table.index(['email']);
        })
        .createTable('password_resets', (table) => {
            table.increments('id').primary();
            table.string('email').notNullable();
            table.string('token').notNullable();
            table.timestamp('expires_at').notNullable();
            table.timestamp('used_at').nullable();
            table.primary(['email', 'token']);
        });
}

export async function down(knex: Knex) {
    return knex.schema.dropTableIfExists('password_resets').dropTableIfExists('users');
}
