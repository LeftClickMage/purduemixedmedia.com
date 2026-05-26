import Image from './Image';
import Button from './Button';
import MiniTitle from './MiniTitle';
import Text from './Text';
import type { DiscordEvent } from './EventCard';

interface GigCardProps {
  gig: DiscordEvent;
}

function GigCard({ gig }: GigCardProps) {
  const discordUrl = gig.guild_id ? `https://discord.com/events/${gig.guild_id}/${gig.id}` : null;
  const imageBaseUrl = gig.image ? `https://cdn.discordapp.com/guild-events/${gig.id}/${gig.image}.png` : null;

  return (
    <li className="silver-glint border border-black rounded-lg p-4 sm:p-6 flex flex-col gap-2">
      {imageBaseUrl && (
        <div className="relative w-full h-40 sm:h-48 mb-2 rounded-md overflow-hidden">
          <Image
            lowSrc={`${imageBaseUrl}?size=32`}
            src={`${imageBaseUrl}?size=2048`}
            alt={gig.name}
            className="w-full h-full"
          />
        </div>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <MiniTitle text={gig.name} />
        {gig.entity_metadata?.location && (
          <span className="text-sm bg-black text-white px-2 py-1 rounded shrink-0">{gig.entity_metadata.location}</span>
        )}
      </div>
      {gig.description && <Text text={gig.description} />}
      {discordUrl && (
        <Button
          text="View on Discord"
          href={discordUrl}
          target="_blank"
          className="block w-full sm:w-auto sm:self-start text-center mt-2"
        />
      )}
    </li>
  );
}

export default GigCard;
