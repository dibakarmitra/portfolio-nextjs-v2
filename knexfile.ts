import type { Knex } from 'knex';
import { env } from './config/env';

const dbClient = env.DB_CLIENT || 'better-sqlite3';
console.log(`Using ${dbClient} database client`);

const knexConfig: Knex.Config = {
    client: dbClient,
    connection: dbClient === 'pg'
        ? env.DATABASE_URL
        : {
            filename: env.DB_FILENAME || './dev.sqlite3',
        },
    version: '25',
    migrations: {
        directory: './database/migrations',
        extension: 'ts',
    },
    seeds: {
        directory: './database/seeds',
    },
    useNullAsDefault: true,
    pool: dbClient === 'better-sqlite3'
        ? {
            min: 1,
            max: 1,
        }
        : {
            min: 2,
            max: 10,
        },
};

export default knexConfig;