import Database from 'better-sqlite3';
import { config } from '@/config';
import { bootstrap } from './bootstrap';

const db: any = new Database(config.databaseUrl || 'data/app.db', { fileMustExist: false });
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

bootstrap(db);

export default db;
