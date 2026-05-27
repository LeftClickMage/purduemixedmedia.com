import GigCard from './GigCard';
import type { DiscordEvent } from './EventCard';

interface YourGigPostingsProps {
  gigs: DiscordEvent[];
  onCancel: (eventId: string) => void;
  className?: string;
}

function YourGigPostings({ gigs, onCancel, className }: YourGigPostingsProps) {
  if (gigs.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4">Your Gig Postings</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {gigs.map(gig => (
          <GigCard key={gig.id} gig={gig} hideButtons onCancel={onCancel} />
        ))}
      </ul>
    </div>
  );
}

export default YourGigPostings;
