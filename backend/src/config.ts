import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.string().default('dev')
});

export const env = EnvSchema.parse(process.env);
