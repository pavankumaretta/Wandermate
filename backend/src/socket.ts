import type { Server } from 'socket.io';
import { z } from 'zod';
import { Conversation } from './models/Conversation.js';
import { Message } from './models/Message.js';

const messageSchema = z.object({
  conversationId: z.string().min(1),
  senderId: z.string().min(1),
  text: z.string().trim().min(1).max(2000)
});

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    socket.on('conversation:join', async (conversationId: string) => {
      if (!conversationId) return;
      const exists = await Conversation.exists({ _id: conversationId });
      if (exists) socket.join(`conversation:${conversationId}`);
    });

    socket.on('message:send', async (payload, acknowledge) => {
      try {
        const parsed = messageSchema.parse(payload);
        const message = await Message.create(parsed);
        const response = message.toObject();
        io.to(`conversation:${parsed.conversationId}`).emit('message:new', response);
        acknowledge?.({ ok: true, message: response });
      } catch {
        acknowledge?.({ ok: false, error: 'Unable to send message' });
      }
    });
  });
}
