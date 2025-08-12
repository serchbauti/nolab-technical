import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '@/config.ts';
import reservationsRouter from '@/routes/reservations.ts';
import { errorHandler } from '@/middlewares/error.ts';
import { notFound } from '@/middlewares/notFound.ts';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: false }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/', reservationsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
