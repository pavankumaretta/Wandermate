import { FormEvent, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { listMessages } from './api';
import type { Guide, Message } from './types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000';

export function Chat({ guide, conversationId, onClose }: { guide: Guide; conversationId: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const socket = useMemo(() => io(SOCKET_URL), []);

  useEffect(() => {
    listMessages(conversationId).then(setMessages).catch(console.error);
    socket.emit('conversation:join', conversationId);
    socket.on('message:new', (message: Message) => {
      if (message.conversationId === conversationId) setMessages((current) => [...current, message]);
    });
    return () => {
      socket.off('message:new');
      socket.disconnect();
    };
  }, [conversationId, socket]);

  function send(event: FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit('message:send', {
      conversationId,
      senderId: 'portfolio-traveler',
      text: trimmed
    });
    setText('');
  }

  return (
    <aside className="chat">
      <header><div><span>Chatting with</span><strong>{guide.name}</strong></div><button onClick={onClose}>×</button></header>
      <div className="messages">
        {messages.length === 0 && <p className="empty">Ask about availability, interests, or a custom route.</p>}
        {messages.map((message) => <div className="bubble" key={message._id}>{message.text}</div>)}
      </div>
      <form onSubmit={send}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…"/><button>Send</button></form>
    </aside>
  );
}
