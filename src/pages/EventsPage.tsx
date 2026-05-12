import { useEffect, useState } from 'react';

interface DiscordEvent {
  id: string;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  entity_metadata?: { location?: string };
  image?: string;
  user_count?: number;
}

const WORKER_URL = 'https://wandering-flower-b7ee.leftclickmage.workers.dev';

function EventsPage() {
  const [events, setEvents] = useState<DiscordEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(WORKER_URL)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch events');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error(data.message ?? 'Unexpected response from Discord');
        setEvents(data.sort((a: DiscordEvent, b: DiscordEvent) => new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime()));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
      {loading && <p className="text-gray-500">Loading events...</p>}
      {error && <p className="text-red-500">Could not load events: {error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500">No upcoming events.</p>
      )}
      <ul className="flex flex-col gap-6">
        {events.map(event => (
          <li key={event.id} className="border border-black rounded-lg p-6 flex flex-col gap-2">
            {event.image && (
              <img
                src={`https://cdn.discordapp.com/guild-events/${event.id}/${event.image}.png?size=4096`}
                alt={event.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            )}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              {event.user_count !== undefined && (
                <p className="text-sm text-gray-500">🙋 {event.user_count} interested</p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(event.scheduled_start_time).toLocaleString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
                hour: 'numeric', minute: '2-digit',
              })}
            </p>
            {event.entity_metadata?.location && (
              <p className="text-sm text-gray-500">📍 {event.entity_metadata.location}</p>
            )}
            {event.description && (
              <p className="text-gray-700 mt-1">{event.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsPage;
