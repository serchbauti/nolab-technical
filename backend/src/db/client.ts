import Database from 'better-sqlite3';
import { config } from '@/config';
import { bootstrap } from './bootstrap';

const db: any = new Database(config.databaseUrl || 'data/app.db', { fileMustExist: false });
db.pragma('journal_mode = DELETE'); // Change from WAL to DELETE to use less memory
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -2000'); // Limit cache to 2MB
db.pragma('temp_store = MEMORY'); // Use temporary memory
db.pragma('mmap_size = 268435456'); // Limit mmap to 256MB

bootstrap(db);

export default db;
