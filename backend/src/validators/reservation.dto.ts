import { z } from 'zod';

export const TZSchema = z.enum(['America/New_York', 'Asia/Tokyo', 'America/Mexico_City']);

export const CreateReservationSchema = z.object({
  startTime: z.string().min(1),
  endTime:   z.string().min(1),
  priority:  z.enum(['high', 'normal']),
  resources: z.object({
    projector: z.boolean(),
    capacity: z.number().int().min(1).max(8)
  }),
  timezone: TZSchema
});

export type CreateReservationDto = z.infer<typeof CreateReservationSchema>;
