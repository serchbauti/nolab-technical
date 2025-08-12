import db from '@/db/client';
import { v4 as uuid } from 'uuid';
import { BadRequestError, ConflictError } from '@/domain/errors';
import {
  durationMinutes,
  durationValid,
  toUTC,
  withinBusinessWindowUTC,
  TZ,
  MIN_MINUTES
} from '@/domain/time';
import { nextAvailable, getConflicts } from './availability.service';

type CreateInput = {
  startTime: string;
  endTime: string;
  priority: 'high' | 'normal';
  resources: { projector: boolean; capacity: number };
  timezone: TZ;
};

export function listReservations() {
  const rows = db.prepare(`SELECT * FROM reservations ORDER BY start_time_utc ASC`).all();
  return rows as Array<any>;
}

export async function createReservation(input: CreateInput) {
  // Check if the times are already in UTC (end with Z)
  let startUtc: number;
  let endUtc: number;
  
  if (input.startTime.endsWith('Z') && input.endTime.endsWith('Z')) {
    // Times are already in UTC, convert directly
    const { fromUTCString } = await import('@/domain/time.js');
    startUtc = fromUTCString(input.startTime);
    endUtc = fromUTCString(input.endTime);
  } else {
    // Times are in local timezone, convert using toUTC
    startUtc = toUTC(input.startTime, input.timezone);
    endUtc = toUTC(input.endTime, input.timezone);
  }

  if (endUtc <= startUtc) throw new BadRequestError('endTime must be greater than startTime');
  if (!durationValid(startUtc, endUtc)) throw new BadRequestError('duration must be 30–120 minutes');
  if (!withinBusinessWindowUTC(startUtc, endUtc)) throw new BadRequestError('time outside business window (Mon–Fri, 09:00–17:00 UTC)');

  // Check for conflicts including resource conflicts
  const conflicts = getConflicts(startUtc, endUtc, input.resources) as Array<any>;
  const hasHighConflict = conflicts.some(r => r.priority === 'high');

  // Validar conflictos de recursos por separado
  if (conflicts.length > 0) {
    const resourceConflicts = conflicts.filter(conflict => {
      // Check projector conflict
      if (input.resources.projector && conflict.projector) {
        return true;
      }
      
      // Check capacity conflict (simplified: if total capacity exceeds 8)
      const totalCapacity = conflict.capacity + input.resources.capacity;
      if (totalCapacity > 8) {
        return true;
      }
      
      return false;
    });
    
    // Si hay conflictos de recursos, no permitir la reserva
    if (resourceConflicts.length > 0) {
      throw new BadRequestError('Resource conflict detected');
    }
  }

  if (conflicts.length > 0) {
    if (input.priority === 'normal' || hasHighConflict) {
      // Suggest next available slot with the same duration
      const durationMin = durationMinutes(startUtc, endUtc);
      const [sugStart, sugEnd] = nextAvailable(startUtc, durationMin, input.resources);
      throw new ConflictError('collision', {
        suggestion: {
          startUtc: sugStart,
          endUtc: sugEnd,
          timezone: input.timezone
        }
      });
    }
  }

  // If it's HIGH and only collides against NORMAL → insert and relocate normals
  const tx = db.transaction(() => {
    const id = uuid();
    const createdAt = Math.floor(Date.now() / 1000);

    db.prepare(`
      INSERT INTO reservations (id, start_time_utc, end_time_utc, priority, projector, capacity, timezone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, startUtc, endUtc, input.priority, input.resources.projector ? 1 : 0, input.resources.capacity, input.timezone, createdAt);

    if (conflicts.length > 0) {
      // Relocate each NORMAL
      for (const r of conflicts) {
        if (r.priority !== 'normal') continue;

        const durMin = durationMinutes(r.start_time_utc, r.end_time_utc);
        let [ns, ne] = nextAvailable(r.start_time_utc, durMin < MIN_MINUTES ? MIN_MINUTES : durMin, {
          projector: !!r.projector,
          capacity: r.capacity
        });

        // Ensure the new location doesn't collide again with the new HIGH
        // (nextAvailable already guarantees this because it queries the updated table)
        db.prepare(`
          UPDATE reservations
          SET start_time_utc = ?, end_time_utc = ?
          WHERE id = ?
        `).run(ns, ne, r.id);
      }
    }

    return id;
  });

  const newId = tx();
  return db.prepare(`SELECT * FROM reservations WHERE id = ?`).get(newId);
}
