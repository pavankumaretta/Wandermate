import { Router } from 'express';
import { z } from 'zod';
import { Guide } from '../models/Guide.js';

export const guidesRouter = Router();

const querySchema = z.object({
  city: z.string().trim().optional(),
  specialty: z.string().trim().optional()
});

guidesRouter.get('/', async (req, res, next) => {
  try {
    const query = querySchema.parse(req.query);
    const filter: Record<string, unknown> = {};
    if (query.city) filter.city = new RegExp(`^${escapeRegExp(query.city)}$`, 'i');
    if (query.specialty) filter.specialties = new RegExp(escapeRegExp(query.specialty), 'i');
    const guides = await Guide.find(filter).sort({ rating: -1, hourlyRate: 1 }).lean();
    res.json({ guides });
  } catch (error) {
    next(error);
  }
});

guidesRouter.get('/:id', async (req, res, next) => {
  try {
    const guide = await Guide.findById(req.params.id).lean();
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    return res.json({ guide });
  } catch (error) {
    return next(error);
  }
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
