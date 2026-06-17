import type { Guide, Message } from './types';

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const authHeaders = { 'Content-Type': 'application/json', 'x-user-id': 'portfolio-traveler' };

export async function listGuides(city = ''): Promise<Guide[]> {
  const response = await fetch(`${API}/api/guides?city=${encodeURIComponent(city)}`, { headers: authHeaders });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Unable to load guides');
  return payload.guides;
}

export async function startConversation(guideId: string): Promise<string> {
  const response = await fetch(`${API}/api/conversations`, {
    method: 'POST', headers: authHeaders, body: JSON.stringify({ guideId })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Unable to start conversation');
  return payload.conversation._id;
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const response = await fetch(`${API}/api/conversations/${conversationId}/messages`, { headers: authHeaders });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? 'Unable to load messages');
  return payload.messages;
}
