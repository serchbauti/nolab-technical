import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '@/config';
import reservationsRouter from '@/routes/reservations';
import { errorHandler } from '@/middlewares/error';
import { notFound } from '@/middlewares/notFound';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: false }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/', reservationsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
