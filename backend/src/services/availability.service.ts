import db from '@/db/client.js';
import { alignToBusinessWindow, overlaps, stepForward, withinBusinessWindowUTC } from '@/domain/time.js';

export function hasOverlap(startUtc: number, endUtc: number): boolean {
  const row = db.prepare(`
    SELECT 1 FROM reservations
    WHERE start_time_utc < ? AND end_time_utc > ?
    LIMIT 1
  `).get(endUtc, startUtc);
  return Boolean(row);
}

export function getConflicts(startUtc: number, endUtc: number, resources?: { projector: boolean; capacity: number }) {
  // First, get all temporal conflicts
  let query = `
    SELECT * FROM reservations
    WHERE start_time_utc < ? AND end_time_utc > ?
  `;
  
  const params = [endUtc, startUtc];
  const temporalConflicts = db.prepare(query).all(...params) as Array<any>;
  
  // IMPORTANTE: Siempre retornar conflictos temporales para lógica de prioridad
  // Los recursos se validan por separado en createReservation
  return temporalConflicts;
}

/** Finds the next available slot for a duration (minutes) starting from startUtc */
export function nextAvailable(startUtc: number, durationMin: number, resources?: { projector: boolean; capacity: number }): [number, number] {
  let t = alignToBusinessWindow(startUtc);
  const dur = durationMin * 60;

  while (true) {
    const end = t + dur;
    if (withinBusinessWindowUTC(t, end) && !hasOverlap(t, end)) {
      // If resources are specified, also check resource availability
      if (!resources || !getConflicts(t, end, resources).length) {
        return [t, end];
      }
    }
    t = stepForward(t, 15);
  }
}
