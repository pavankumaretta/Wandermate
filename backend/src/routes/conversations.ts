import { Router } from 'express';
import { z } from 'zod';
import { Conversation } from '../models/Conversation.js';
import { Guide } from '../models/Guide.js';
import { Message } from '../models/Message.js';

export const conversationsRouter = Router();

conversationsRouter.post('/', async (req, res, next) => {
  try {
    const { guideId } = z.object({ guideId: z.string().min(1) }).parse(req.body);
    const guide = await Guide.findById(guideId);
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    const conversation = await Conversation.findOneAndUpdate(
      { travelerId: req.user!.id, guideId },
      { $setOnInsert: { travelerId: req.user!.id, guideId } },
      { upsert: true, new: true }
    );
    return res.status(201).json({ conversation });
  } catch (error) {
    return next(error);
  }
});

conversationsRouter.get('/:id/messages', async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (conversation.travelerId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).lean();
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});

conversationsRouter.post('/:id/messages', async (req, res, next) => {
  try {
    const { text } = z.object({ text: z.string().trim().min(1).max(2000) }).parse(req.body);
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (conversation.travelerId !== req.user!.id) return res.status(403).json({ error: 'Forbidden' });
    const message = await Message.create({ conversationId: conversation._id, senderId: req.user!.id, text });
    return res.status(201).json({ message });
  } catch (error) {
    return next(error);
  }
});
