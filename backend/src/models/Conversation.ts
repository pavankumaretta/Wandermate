import mongoose, { Schema } from 'mongoose';

const ConversationSchema = new Schema({
  travelerId: { type: String, required: true, index: true },
  guideId: { type: Schema.Types.ObjectId, ref: 'Guide', required: true, index: true }
}, { timestamps: true });

ConversationSchema.index({ travelerId: 1, guideId: 1 }, { unique: true });

export const Conversation = mongoose.model('Conversation', ConversationSchema);
