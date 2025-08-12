import type { Database } from 'better-sqlite3';

export function bootstrap(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      start_time_utc INTEGER NOT NULL,
      end_time_utc   INTEGER NOT NULL,
      priority       TEXT NOT NULL CHECK (priority IN ('high','normal')),
      projector      INTEGER NOT NULL CHECK (projector IN (0,1)),
      capacity       INTEGER NOT NULL CHECK (capacity BETWEEN 1 AND 8),
      timezone       TEXT NOT NULL CHECK (timezone IN ('America/New_York','Asia/Tokyo','America/Mexico_City')),
      created_at     INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_res_time ON reservations (start_time_utc, end_time_utc);
  `);
}
