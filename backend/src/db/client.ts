import Database from 'better-sqlite3';
import { config } from '@/config';
import { bootstrap } from './bootstrap';

const db: any = new Database(config.databaseUrl || 'data/app.db', { fileMustExist: false });
db.pragma('journal_mode = DELETE'); // Cambiar de WAL a DELETE para usar menos memoria
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -2000'); // Limitar cache a 2MB
db.pragma('temp_store = MEMORY'); // Usar memoria temporal
db.pragma('mmap_size = 268435456'); // Limitar mmap a 256MB

bootstrap(db);

export default db;
