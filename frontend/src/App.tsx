import { useEffect, useState } from 'react';
import { listGuides, startConversation } from './api';
import { Chat } from './Chat';
import { GuideMap } from './GuideMap';
import type { Guide } from './types';

export default function App() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [city, setCity] = useState('Boston');
  const [selected, setSelected] = useState<Guide | null>(null);
  const [conversationId, setConversationId] = useState('');
  const [error, setError] = useState('');

  async function load(cityValue = city) {
    try {
      setError('');
      setGuides(await listGuides(cityValue));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load guides');
    }
  }

  useEffect(() => { void load('Boston'); }, []);

  async function messageGuide(guide: Guide) {
    try {
      const id = await startConversation(guide._id);
      setSelected(guide);
      setConversationId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open chat');
    }
  }

  return (
    <main>
      <header className="topbar"><strong>Wandermate</strong><span>Travel like a local.</span></header>
      <section className="intro">
        <div><span className="eyebrow">LOCAL KNOWLEDGE · REAL CONNECTIONS</span><h1>Meet the person who makes a city unforgettable.</h1></div>
        <div className="search"><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City"/><button onClick={() => load()}>Find guides</button></div>
      </section>
      {error && <p className="error">{error}</p>}
      <section className="workspace">
        <div className="map-panel"><GuideMap guides={guides} onSelect={setSelected}/></div>
        <div className="guide-list">
          {guides.map((guide) => (
            <article className={selected?._id === guide._id ? 'guide active' : 'guide'} key={guide._id} onClick={() => setSelected(guide)}>
              <img src={guide.avatarUrl} alt=""/>
              <div className="guide-copy"><div className="guide-heading"><h2>{guide.name}</h2><span>★ {guide.rating}</span></div><p>{guide.bio}</p><div className="tags">{guide.specialties.map((item) => <span key={item}>{item}</span>)}</div><footer><small>{guide.languages.join(' · ')}</small><strong>${guide.hourlyRate}/hr</strong></footer></div>
              <button className="message" onClick={(event) => { event.stopPropagation(); void messageGuide(guide); }}>Message</button>
            </article>
          ))}
          {guides.length === 0 && <div className="no-results">No guides found for this city yet.</div>}
        </div>
      </section>
      {selected && conversationId && <Chat guide={selected} conversationId={conversationId} onClose={() => setConversationId('')}/>} 
    </main>
  );
}
