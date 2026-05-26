import Image from './Image';
import Button from './Button';
import MiniTitle from './MiniTitle';
import Text from './Text';
import EventDate from './EventDate';
import type { DiscordEvent } from './EventCard';

interface GigCardProps {
  gig: DiscordEvent;
}

function parsePoster(description?: string): { poster: string | null; email: string | null; body: string } {
  if (!description) return { poster: null, email: null, body: '' };
  const idx = description.lastIndexOf('Posted by ');
  if (idx === -1) return { poster: null, email: null, body: description };
  let tail = description.slice(idx + 'Posted by '.length);
  const emailMatch = tail.match(/\nEmail:\s*([^\n]+)/);
  const email = emailMatch ? emailMatch[1].trim() : null;
  tail = tail.replace(/\nEmail:\s*[^\n]*/, '');
  tail = tail.replace(/\n?Discord Username:\s*[^\n]*$/, '').trim();
  tail = tail.replace(/\s*\(Discord:[^)]*\)\s*$/, '').trim();
  const body = description.slice(0, idx).trim();
  return {
    poster: tail || null,
    email,
    body: body || description,
  };
}

function GigCard({ gig }: GigCardProps) {
  const discordUrl = gig.guild_id ? `https://discord.com/events/${gig.guild_id}/${gig.id}` : null;
  const imageBaseUrl = gig.image ? `https://cdn.discordapp.com/guild-events/${gig.id}/${gig.image}.png` : null;

  const { poster, email, body } = parsePoster(gig.description);

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
      <EventDate startTime={gig.scheduled_start_time} endTime={gig.scheduled_end_time} />
      {poster && (
        <p className="text-sm text-gray-500">Posted by {poster}</p>
      )}
      {body && <Text text={body} />}
      <div className="flex flex-wrap gap-2 mt-2">
        {email && (
          <Button
            text="Contact"
            href={`mailto:${email}`}
            className="text-center"
          />
        )}
        {discordUrl && (
          <Button
            text="View on Discord"
            href={discordUrl}
            target="_blank"
            className="text-center"
          />
        )}
      </div>
    </li>
  );
}

export default GigCard;
