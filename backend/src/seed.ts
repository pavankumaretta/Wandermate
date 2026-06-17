import mongoose from 'mongoose';
import { config } from './config.js';
import { Guide } from './models/Guide.js';

const guides = [
  {
    name: 'Maya Chen', city: 'Boston', specialties: ['history', 'food'], languages: ['English', 'Mandarin'],
    rating: 4.9, hourlyRate: 55, bio: 'Historian and neighborhood food enthusiast.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240',
    location: { type: 'Point', coordinates: [-71.0589, 42.3601] }
  },
  {
    name: 'Daniel Ortiz', city: 'Boston', specialties: ['architecture', 'photography'], languages: ['English', 'Spanish'],
    rating: 4.8, hourlyRate: 48, bio: 'Architecture guide focused on hidden city details.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240',
    location: { type: 'Point', coordinates: [-71.0662, 42.3554] }
  },
  {
    name: 'Aisha Rahman', city: 'New York', specialties: ['art', 'nightlife'], languages: ['English', 'Bengali'],
    rating: 4.9, hourlyRate: 70, bio: 'Museum educator and independent arts curator.',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=240',
    location: { type: 'Point', coordinates: [-73.9857, 40.7484] }
  }
];

async function seed() {
  await mongoose.connect(config.mongodbUri);
  await Guide.deleteMany({});
  await Guide.insertMany(guides);
  console.log(`Seeded ${guides.length} guides`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
