import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '@/config';
import reservationsRouter from '@/routes/reservations';
import { errorHandler } from '@/middlewares/error';
import { notFound } from '@/middlewares/notFound';

const app = express();

// CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://nolab-technical.onrender.com', // Backend
  'https://*.netlify.app', // Any Netlify subdomain
  'https://*.vercel.app', // Any Vercel subdomain
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests without origin (like Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        return origin.endsWith(allowed.replace('*.', ''));
      }
      return origin === allowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false 
}));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/', reservationsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
