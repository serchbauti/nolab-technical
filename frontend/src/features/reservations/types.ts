import { z } from 'zod';

export const TZSchema = z.enum([
  'America/New_York', 'Asia/Tokyo', 'America/Mexico_City'
]);
export type TZType = z.infer<typeof TZSchema>;

export const ReservationFormSchema = z.object({
  startTime: z.string().min(1, 'Fecha y hora de inicio es requerida'),
  endTime:   z.string().min(1, 'Fecha y hora de fin es requerida'),
  priority:  z.enum(['high','normal']),
  projector: z.boolean().default(false),
  capacity:  z.coerce.number().int().min(1).max(8),
  timezone:  TZSchema
});

export type ReservationFormValues = z.infer<typeof ReservationFormSchema>;
export type { TZType as TZ };
