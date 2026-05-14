import { useEffect, useState } from 'react';
import EventCard, { type DiscordEvent } from '../components/EventCard';
import Subtitle from '../components/Subtitle';
import { usePageTitle } from '../lib/usePageTitle';
import { usePageDescription } from '../lib/usePageDescription';
import { pageMeta } from '../lib/pageMeta';

const WORKER_URL = 'https://wandering-flower-b7ee.leftclickmage.workers.dev';

function EventsPage() {
  usePageTitle(pageMeta.events.title);
  usePageDescription(pageMeta.events.description);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
      <Subtitle text="Upcoming Events" />
      {loading && <p className="text-gray-500">Loading events...</p>}
      {error && <p className="text-red-500">Could not load events: {error}</p>}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500">No upcoming events.</p>
      )}
      <ul className="flex flex-col gap-4 sm:gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </ul>
    </div>
  );
}

export default EventsPage;
