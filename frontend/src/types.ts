export type Guide = {
  _id: string;
  name: string;
  city: string;
  specialties: string[];
  languages: string[];
  rating: number;
  hourlyRate: number;
  bio: string;
  avatarUrl: string;
  location: { type: 'Point'; coordinates: [number, number] };
};

export type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};
