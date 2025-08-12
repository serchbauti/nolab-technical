import { z } from 'zod';

export const TZSchema = z.enum([
  'America/New_York', 'Asia/Tokyo', 'America/Mexico_City'
]);
export type TZType = z.infer<typeof TZSchema>;

// simple helpers for formatting
const DateRegex = /^\d{4}-\d{2}-\d{2}$/;     // YYYY-MM-DD
const TimeRegex = /^\d{2}:\d{2}$/;           // HH:mm

export const ReservationFormSchema = z.object({
  // option A: datetime-local (both present)
  startTime: z.string().optional().default(''),
  endTime:   z.string().optional().default(''),

  // option B: date+time pairs
  startDate: z.string().optional().default(''),
  startClock:z.string().optional().default(''),
  endDate:   z.string().optional().default(''),
  endClock:  z.string().optional().default(''),

  priority:  z.enum(['high','normal']),
  projector: z.boolean().default(false),
  capacity:  z.coerce.number().int().min(1).max(8),
  timezone:  TZSchema
})
.superRefine((v, ctx) => {
  const hasLocal = !!v.startTime && !!v.endTime;
  const hasPairs =
    !!v.startDate && DateRegex.test(v.startDate) &&
    !!v.startClock && TimeRegex.test(v.startClock) &&
    !!v.endDate   && DateRegex.test(v.endDate) &&
    !!v.endClock  && TimeRegex.test(v.endClock);

  if (!hasLocal && !hasPairs) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Proporciona fecha y hora de inicio y fin', path: ['startDate'] });
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Proporciona fecha y hora de inicio y fin', path: ['endDate'] });
  }
});

export type ReservationFormValues = z.infer<typeof ReservationFormSchema>;
export type { TZType as TZ };
