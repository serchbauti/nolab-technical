import { Router } from 'express';
import { CreateReservationSchema } from '@/validators/reservation.dto.js';
import { createReservation, listReservations } from '@/services/reservations.service.js';
import { ConflictError } from '@/domain/errors.js';
import { fromUTC, toUTC, TZ } from '@/domain/time.js';
import { nextAvailable } from '@/services/availability.service.js';
import { z } from 'zod';

const router = Router();

router.get('/reservations', (req, res) => {
  const rows = listReservations();
  const mappedRows = rows.map(r => ({
    id: r.id,
    startTime: fromUTC(r.start_time_utc, r.timezone as TZ),
    endTime:   fromUTC(r.end_time_utc,   r.timezone as TZ),
    priority: r.priority,
    resources: { projector: !!r.projector, capacity: r.capacity },
    timezone: r.timezone
  }));
  res.json(mappedRows);
});

router.post('/reservations', async (req, res, next) => {
  try {
    const dto = CreateReservationSchema.parse(req.body);
    const created = await createReservation(dto);
    res.status(201).json({
      id: created.id,
      startTime: fromUTC(created.start_time_utc, created.timezone),
      endTime:   fromUTC(created.end_time_utc,   created.timezone),
      priority: created.priority,
      resources: { projector: !!created.projector, capacity: created.capacity },
      timezone: created.timezone
    });
  } catch (err) {
    if (err instanceof ConflictError) {
      const s = err.payload as any;
      return res.status(409).json({
        error: 'Conflict',
        reason: 'collision',
        suggestion: {
          startTime: fromUTC(s.suggestion.startUtc, s.suggestion.timezone),
          endTime:   fromUTC(s.suggestion.endUtc,   s.suggestion.timezone),
          timezone:  s.suggestion.timezone
        }
      });
    }
    next(err);
  }
});

const NextAvailableQuery = z.object({
  startTime: z.string().min(1),
  timezone: z.enum(['America/New_York','Asia/Tokyo','America/Mexico_City']),
  projector: z.boolean().optional().default(false),
  capacity: z.coerce.number().int().min(1).max(8).optional().default(1)
});

router.get('/next-available', (req, res, next) => {
  try {
    const q = NextAvailableQuery.parse(req.query);
    const startUtc = toUTC(q.startTime, q.timezone);
    const [s, e] = nextAvailable(startUtc, 60, { projector: q.projector, capacity: q.capacity }); // 1 hora
    res.json({
      startTime: fromUTC(s, q.timezone),
      endTime: fromUTC(e, q.timezone),
      timezone: q.timezone
    });
  } catch (err) {
    next(err);
  }
});

export default router;
