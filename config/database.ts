import knex, { type Knex } from 'knex';
import path from 'path';
import { env } from './env';

const dbPath = path.resolve(process.cwd(), env.SQLITE_FILENAME);

const config: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: dbPath,
    },
    useNullAsDefault: true,
    pool: {
        min: 2,
        max: 10,
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
