import Database from 'better-sqlite3';
import { env } from '@/config.js';
import { bootstrap } from './bootstrap.js';

const db = new Database(env.DATABASE_URL, { fileMustExist: false });
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

bootstrap(db);

export type DB = Database.Database;
export default db;
