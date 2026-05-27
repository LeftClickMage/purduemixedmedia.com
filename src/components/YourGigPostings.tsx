import GigCard from './GigCard';
import Text from './Text';
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
      <div className="flex items-baseline flex-wrap gap-x-3 mb-4">
        <h3 className="text-xl font-semibold">Your Gig Postings</h3>
        <Text text="(updates may be delayed)" className="text-sm" />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {gigs.map(gig => (
          <GigCard key={gig.id} gig={gig} hideButtons onCancel={onCancel} />
        ))}
      </ul>
    </div>
  );
}

export default YourGigPostings;
