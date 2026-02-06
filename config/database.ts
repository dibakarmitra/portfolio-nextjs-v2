import knex, { type Knex } from 'knex';
import path from 'path';
import { env } from './env';

const dbClient = env.DB_CLIENT || 'better-sqlite3';

const dbPath = path.resolve(process.cwd(), env.DB_FILENAME);

const config: Knex.Config = {
    client: dbClient,
    connection: dbClient === 'postgresql'
        ? env.DATABASE_URL
        : {
            filename: dbPath,
        },
    useNullAsDefault: true,
    pool: {
        min: dbClient === 'better-sqlite3' ? 1 : 2,
        max: dbClient === 'better-sqlite3' ? 1 : 10,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
    },
    migrations: {
        directory: path.join(process.cwd(), 'database', 'migrations'),
    },
    seeds: {
        directory: path.join(process.cwd(), 'database', 'seeds'),
    },
    debug: process.env.NODE_ENV === 'development',
    asyncStackTraces: process.env.NODE_ENV === 'development',
    acquireConnectionTimeout: 60000,
    postProcessResponse: (result) => {
        return result;
    },
};

declare global {
    var __knex: Knex | undefined;
}

export const db = global.__knex || (global.__knex = knex(config));
