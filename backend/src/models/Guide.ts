import mongoose, { Schema } from 'mongoose';

const GuideSchema = new Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, index: true },
  specialties: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 5 },
  hourlyRate: { type: Number, min: 0, required: true },
  bio: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
}, { timestamps: true });

GuideSchema.index({ location: '2dsphere' });

export const Guide = mongoose.model('Guide', GuideSchema);
