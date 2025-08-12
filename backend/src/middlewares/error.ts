import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { BadRequestError, ConflictError } from '@/domain/errors.ts';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'BadRequest', message: err.flatten() });
  }
  if (err instanceof BadRequestError) {
    return res.status(err.status).json({ error: 'BadRequest', message: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(err.status).json({ error: 'Conflict', message: err.message, ...(err as any).payload });
  }

  console.error(err);
  return res.status(500).json({ error: 'InternalServerError' });
};
