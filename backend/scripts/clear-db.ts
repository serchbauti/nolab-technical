import db from '@/db/client.js';

const info = db.prepare('DELETE FROM reservations').run();
console.log(`Borrados: ${info.changes} registros`);
db.close();
