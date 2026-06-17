import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true, maxlength: 2000 }
}, { timestamps: true });

export const Message = mongoose.model('Message', MessageSchema);
