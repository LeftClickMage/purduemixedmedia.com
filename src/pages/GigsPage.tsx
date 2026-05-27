import { useEffect, useState } from 'react';
import GigCard from '../components/GigCard';
import type { DiscordEvent } from '../components/EventCard';
import Subtitle from '../components/Subtitle';
import Button from '../components/Button';
import Text from '../components/Text';
import DiscordButton from '../components/DiscordButton';
import PostGigModal from '../components/PostGigModal';
import YourGigPostings from '../components/YourGigPostings';
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
  const [showPostModal, setShowPostModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!session) return;
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
  }, [session, refreshKey]);

  const myGigs = session
    ? gigs.filter(g => g.description?.includes(`Discord Username: ${session.username}`))
    : [];
  const otherGigs = session
    ? gigs.filter(g => !g.description?.includes(`Discord Username: ${session.username}`))
    : gigs;

  const handleCancel = (eventId: string) => {
    setGigs(prev => prev.filter(g => g.id !== eventId));
    setRefreshKey(k => k + 1);
  };

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
        <Subtitle text="Request Gigs" />
        <p className="text-gray-700 mb-6">Log in with Discord to request videography, photography, or any content creation services.</p>
        <Button text="Log in with Discord" href="/auth/login?returnTo=/gigs" />
      </div>
    );
  }

  const titleRow = (
    <div className="flex items-baseline justify-between gap-4 flex-wrap">
      <Subtitle text="Available Gigs" />
      <div className="flex items-baseline gap-3 mb-6 sm:mb-8">
        <Text text={`Logged in as ${session.username}`} className="text-sm" />
        <a href="/auth/logout" className="text-sm text-gray-700 underline hover:text-black">Log out</a>
      </div>
    </div>
  );

  const titleRowNoAccess = (
    <div className="flex items-baseline justify-between gap-4 flex-wrap">
      <Subtitle text="Request Gigs" />
      <div className="flex items-baseline gap-3 mb-6 sm:mb-8">
        <Text text={`Logged in as ${session.username}`} className="text-sm" />
        <a href="/auth/logout" className="text-sm text-gray-700 underline hover:text-black">Log out</a>
      </div>
    </div>
  );

  const postGigButton = (
    <Button text="Post Gig" onClick={() => setShowPostModal(true)} />
  );

  const modal = showPostModal ? (
    <PostGigModal
      onClose={() => setShowPostModal(false)}
      onPosted={() => setRefreshKey(k => k + 1)}
    />
  ) : null;

  if (!session.member) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        {titleRowNoAccess}
        {myGigs.length > 0 ? (
          <YourGigPostings gigs={myGigs} onCancel={handleCancel} className="mb-8" />
        ) : (
          <p className="text-gray-700 mb-6">
            Need a photographer, videographer, or creator for an event or project? Post a gig and our members will reach out to you.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {postGigButton}
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Looking to take on gigs as a member? Contact the President or Business Manager by email or discord.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button text="View Officers" href="/officers" />
          <DiscordButton href="https://discord.gg/fYkTeMRSEr" />
        </div>
        {modal}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
      {titleRow}
      <div className="mb-6">{postGigButton}</div>
      {loading && <p className="text-gray-500">Loading gigs...</p>}
      {error && <p className="text-red-500">Could not load gigs: {error}</p>}
      {!loading && !error && otherGigs.length === 0 && (
        <p className="text-gray-500">No gigs available.</p>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {otherGigs.map(gig => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </ul>
      <YourGigPostings gigs={myGigs} onCancel={handleCancel} className="mt-10" />
      {modal}
    </div>
  );
}

export default GigsPage;
