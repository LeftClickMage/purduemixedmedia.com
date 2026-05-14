import Image from './Image';
import Button from './Button';
import MiniTitle from './MiniTitle';
import Text from './Text';
import SubText from './SubText';

export interface DiscordEvent {
  id: string;
  guild_id?: string;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  entity_metadata?: { location?: string };
  image?: string;
  user_count?: number;
}

interface EventCardProps {
  event: DiscordEvent;
}

function EventCard({ event }: EventCardProps) {
  const discordUrl = event.guild_id ? `https://discord.com/events/${event.guild_id}/${event.id}` : null;
  const imageBaseUrl = event.image ? `https://cdn.discordapp.com/guild-events/${event.id}/${event.image}.png` : null;

  return (
    <li className="silver-glint border border-black rounded-lg p-4 sm:p-6 flex flex-col gap-2">
      <div className="relative w-full h-40 sm:h-48 mb-2 rounded-md overflow-hidden">
        <Image
          lowSrc={imageBaseUrl ? `${imageBaseUrl}?size=32` : undefined}
          src={imageBaseUrl ? `${imageBaseUrl}?size=2048` : undefined}
          alt={event.name}
          className="w-full h-full"
        />
        {event.entity_metadata?.location && (
          <div className="absolute bottom-2 left-2 z-10 text-white text-xs px-2 py-1 bg-black/60 rounded">
            📍 {event.entity_metadata.location}
          </div>
        )}
      </div>
      {/* Title row: title left, interested count right (desktop only — count moves to date row on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <MiniTitle text={event.name} />
        {event.user_count !== undefined && (
          <SubText text={`🙋 ${event.user_count} interested`} className="hidden sm:block shrink-0" />
        )}
      </div>
      {event.description && (
        <Text text={event.description} />
      )}
      {/* Date row: date left; on mobile shows interested count on right, on desktop shows the View on Discord button on right */}
      <div className="flex items-center justify-between gap-2">
        <SubText text={new Date(event.scheduled_start_time).toLocaleString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
          hour: 'numeric', minute: '2-digit',
        })} />
        {/* Mobile only */}
        {event.user_count !== undefined && (
          <SubText text={`🙋 ${event.user_count} interested`} className="sm:hidden shrink-0" />
        )}
        {/* Desktop only */}
        {discordUrl && (
          <Button
            text="View on Discord"
            href={discordUrl}
            target="_blank"
            className="hidden sm:inline-block shrink-0"
          />
        )}
      </div>
      {/* Mobile only: full-width View on Discord button at the bottom */}
      {discordUrl && (
        <Button
          text="View on Discord"
          href={discordUrl}
          target="_blank"
          className="sm:hidden block w-full text-center mt-2"
        />
      )}
    </li>
  );
}

export default EventCard;
