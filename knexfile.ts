import type { Knex } from 'knex';

const knexConfig: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: './dev.sqlite3',
    },
    migrations: {
        directory: './database/migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './database/seeds',
    },
    useNullAsDefault: true,
};

export default knexConfig;
