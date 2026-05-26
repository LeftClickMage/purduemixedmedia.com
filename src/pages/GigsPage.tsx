import { useEffect, useState } from 'react';
import GigCard from '../components/GigCard';
import type { DiscordEvent } from '../components/EventCard';
import Subtitle from '../components/Subtitle';
import Button from '../components/Button';
import Text from '../components/Text';
import { usePageTitle } from '../lib/usePageTitle';
import { usePageDescription } from '../lib/usePageDescription';
import { pageMeta } from '../lib/pageMeta';
import { useAuth } from '../lib/useAuth';

const WORKER_URL = 'https://wandering-flower-b7ee.leftclickmage.workers.dev?type=gigs';

function GigsPage() {
  usePageTitle(pageMeta.gigs.title);
  usePageDescription(pageMeta.gigs.description);
  const { session, loading: authLoading } = useAuth();
  const [gigs, setGigs] = useState<DiscordEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.member) return;
    fetch(WORKER_URL)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch gigs');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error(data.message ?? 'Unexpected response from Discord');
        setGigs(data.sort((a: DiscordEvent, b: DiscordEvent) => new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime()));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [session?.member]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <Subtitle text="Available Gigs" />
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <Subtitle text="Available Gigs" />
        <p className="text-gray-700 mb-6">Log in with Discord to view available gigs.</p>
        <Button text="Log in with Discord" href="/auth/login?returnTo=/gigs" />
      </div>
    );
  }

  const sessionBar = (
    <div className="flex items-center justify-end gap-3 mb-4">
      <Text text={`Logged in as ${session.username}`} className="text-sm" />
      <a href="/auth/logout" className="text-sm text-gray-700 underline hover:text-black">Log out</a>
    </div>
  );

  if (!session.member) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        {sessionBar}
        <Subtitle text="Available Gigs" />
        <p className="text-gray-700 mb-6">
          Gigs are only available to certain Purdue Mixed Media members. Please contact the President or Business Manager to request access.
        </p>
        <Button text="View Officers" href="/officers" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
      {sessionBar}
      <Subtitle text="Available Gigs" />
      {loading && <p className="text-gray-500">Loading gigs...</p>}
      {error && <p className="text-red-500">Could not load gigs: {error}</p>}
      {!loading && !error && gigs.length === 0 && (
        <p className="text-gray-500">No gigs available.</p>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {gigs.map(gig => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </ul>
    </div>
  );
}

export default GigsPage;
