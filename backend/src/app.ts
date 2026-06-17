import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { config } from './config.js';
import { requireAuth, requirePublicApiKey } from './middleware/auth.js';
import { Guide } from './models/Guide.js';
import { conversationsRouter } from './routes/conversations.js';
import { guidesRouter } from './routes/guides.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'wandermate-api' }));
  app.use('/api/guides', requireAuth, guidesRouter);
  app.use('/api/conversations', requireAuth, conversationsRouter);

  app.get('/public/v1/guides', requirePublicApiKey, async (_req, res, next) => {
    try {
      const guides = await Guide.find().sort({ rating: -1 }).lean();
      res.json({ guides });
    } catch (error) {
      next(error);
    }
  });

  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.flatten() });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  };
  app.use(errorHandler);
  return app;
}
