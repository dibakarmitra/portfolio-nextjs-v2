import type { Knex } from 'knex';

export async function up(knex: Knex) {
    return knex.schema.alterTable('users', (table) => {
        table.string('display_name').nullable();
        table.string('job_title').nullable();
        table.string('location').nullable();
        table.string('availability').defaultTo('Open to Opportunities');
        table.text('bio').nullable();
        table.string('phone').nullable();
        table.string('site_url').nullable();
        table.string('resume_url').nullable();
        table.text('socials').nullable();
        table.text('seo_config').nullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('display_name');
        table.dropColumn('job_title');
        table.dropColumn('location');
        table.dropColumn('availability');
        table.dropColumn('bio');
        table.dropColumn('phone');
        table.dropColumn('site_url');
        table.dropColumn('resume_url');
        table.dropColumn('socials');
        table.dropColumn('seo_config');
    });
}
